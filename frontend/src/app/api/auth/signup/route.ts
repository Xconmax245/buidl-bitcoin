import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signupSchema } from "@/lib/auth/validation";
import { rateLimit, rateLimitResponse } from "@/lib/security/rate-limit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!rateLimit(ip, 10)) { // increased for dev
    return rateLimitResponse();
  }

  try {
    const data = await req.json();
    const validated = signupSchema.safeParse(data);

    if (!validated.success) {
      console.log("Signup validation failed:", validated.error.flatten());
      return NextResponse.json({ error: "Invalid data", details: validated.error.flatten() }, { status: 400 });
    }

    const { email: rawEmail, password, username: rawUsername } = validated.data;
    const email = rawEmail.trim().toLowerCase();
    const username = rawUsername.trim().toLowerCase();

    console.log("Attempting signup for:", email, username);

    // Check if user or username exists
    const existingUser = await prisma.user.findFirst({
      where: { 
        OR: [
          { email },
          { walletAddress: email }
        ]
      },
      include: { profile: true }
    });

    if (existingUser) {
      // If user exists but has no password (e.g. from Google login)
      // and they are trying to "sign up" with the same email, 
      // we allow them to set a password.
      if (!existingUser.passwordHash && (existingUser.authProvider as string) === 'GOOGLE') {
        const passwordHash = await bcrypt.hash(password.trim(), 10);
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { 
            passwordHash,
            // If they don't have a profile yet, create one (though usually Google login creates one)
            profile: !existingUser.profile ? {
              create: {
                username,
                displayName: rawUsername,
              }
            } : undefined
          }
        });
        console.log("Updated existing Google user with password:", email);
        return NextResponse.json({ message: "Account updated with password", userId: existingUser.id });
      }

      console.log("Signup failed: Email already exists:", email);
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const existingUsername = await prisma.profile.findUnique({
      where: { username }
    });

    if (existingUsername) {
      console.log("Signup failed: Username already taken:", username);
      return NextResponse.json({ error: "Username already taken" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password.trim(), 10);

    // Create user and profile in a transaction
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        authProvider: 'EMAIL',
        profile: {
          create: {
            username,
            displayName: rawUsername, // Keep original casing for display name
          }
        }
      }
    });

    console.log("User created successfully:", user.id);
    return NextResponse.json({ message: "User created successfully", userId: user.id });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
