import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { rateLimit, rateLimitResponse } from "@/lib/security/rate-limit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!rateLimit(ip, 20)) {
    return rateLimitResponse();
  }

  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { 
      username, 
      displayName, 
      country, 
      timezone, 
      preferredCurrency,
      bio,
      language,
      notifications,
      avatarUrl,
    } = data;

    // Check if username already exists
    if (username) {
      const existing = await prisma.profile.findUnique({
        where: { username }
      });

      if (existing && existing.userId !== session.user.id) {
        return NextResponse.json({ error: "Username already taken" }, { status: 400 });
      }
    }

    const profileData: Record<string, any> = {
      username,
      displayName,
      country,
      timezone,
      preferredCurrency,
      bio,
      avatarUrl: avatarUrl || null,
    };

    // Only include language if provided
    if (language) profileData.language = language;
    // Only include notifications if provided
    if (notifications) profileData.notifications = notifications;

    const profile = await (prisma.profile as any).upsert({
      where: { userId: session.user.id },
      update: profileData,
      create: {
        userId: session.user.id,
        ...profileData,
      },
    });

    return NextResponse.json(profile);
  } catch (err) {
    console.error("Profile creation error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
