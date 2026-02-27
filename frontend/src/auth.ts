import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { loginSchema } from "./lib/auth/validation";
import prisma from "./lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Ironclad Access",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        address: { label: "Address", type: "text" },
        loginType: { label: "Type", type: "text" }
      },
      async authorize(credentials) {
        console.log("Authorize attempt for:", credentials?.username, "Password:", credentials?.password);
        
        // WALLET LOGIN INTERCEPT
        if (credentials?.password === 'wallet_login_magic_string' || credentials?.loginType === 'wallet') {
          const address = (credentials.username || credentials.address) as string;
          let user = await prisma.user.findFirst({
            where: { 
              OR: [
                { walletAddress: address },
                { email: `${address}@stacks.local` }
              ]
            },
            include: { profile: true }
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                walletAddress: address,
                email: `${address}@stacks.local`,
                authProvider: 'WALLET',
                profile: {
                  create: {
                    username: `stx_${address.slice(0, 6)}_${address.slice(-4)}`.toLowerCase(),
                    displayName: `Stacker ${address.slice(0, 6)}`,
                  }
                }
              },
              include: { profile: true }
            });
          }

          return {
            id: user.id,
            email: user.email,
            name: user.profile?.displayName || `Stacker_${address.slice(-4)}`,
          };
        }


        const validated = loginSchema.safeParse(credentials);

        if (!validated.success) {
          console.log("Validation failed:", validated.error.flatten());
          return null;
        }

        const { username: rawUsername, password: rawPassword } = validated.data;
        const username = rawUsername.trim();
        const password = rawPassword.trim();

        // Find user by username (linked via profile) or email
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: { equals: username, mode: 'insensitive' } },
              { profile: { username: { equals: username, mode: 'insensitive' } } }
            ]
          },
          include: { profile: true }
        });

        if (!user || !user.passwordHash) {
          console.log("User not found or no password hash for:", username);
          return null;
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
          console.log("Password mismatch for:", username);
          return null;
        }

        console.log("Login successful for:", username);
        return {
          id: user.id,
          email: user.email,
          name: user.profile?.displayName || user.profile?.username,
          image: user.profile?.avatarUrl,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // For Google users, ensure they have a profile entry
      if (account?.provider === 'google' && user?.id) {
        try {
          const existingProfile = await prisma.profile.findUnique({
            where: { userId: user.id }
          });
          if (!existingProfile) {
            // Create a minimal profile so onboarding shows ProfileSetupModal
            // but profile check returns false (no country/timezone)
            const username = `user_${user.id.slice(0, 8)}`;
            await prisma.profile.create({
              data: {
                userId: user.id,
                username,
                displayName: user.name || undefined,
                avatarUrl: user.image || undefined,
              }
            }).catch(() => {
              // Profile creation might fail if username already exists, which is fine
              console.log("Profile auto-creation skipped (may already exist)");
            });
          }
          // Update auth provider to GOOGLE
          await prisma.user.update({
            where: { id: user.id },
            data: { authProvider: 'GOOGLE' }
          }).catch(() => {});
        } catch (err) {
          console.error("Error in signIn callback for Google:", err);
        }
      }
      return true; // Allow sign in
    },
    async session({ session, token }: any) {
      if (token.id && session.user) {
        session.user.id = token.id;
      } else if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.picture) session.user.image = token.picture;
      if (token.name) session.user.name = token.name;
      return session;
    },
    async jwt({ token, user, account }: any) {
      if (user) {
        token.id = user.id;
        if (user.image) token.picture = user.image;
        if (user.name) token.name = user.name;
      }
      // For adapter-based OAuth (Google), user.id might be in sub
      if (account?.provider === 'google' && !token.id) {
        token.id = token.sub;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === 'development',
});
