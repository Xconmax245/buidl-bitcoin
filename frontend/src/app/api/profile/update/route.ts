import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { 
      displayName, bio, avatarUrl, country, timezone, 
      preferredCurrency, language, 
      leaderboardVisible, notificationsEnabled, priorityFee, autoPersistence
    } = data;

    const updateData: Record<string, any> = {};
    if (displayName !== undefined) updateData.displayName = displayName;
    if (bio !== undefined) updateData.bio = bio;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (country !== undefined) updateData.country = country;
    if (timezone !== undefined) updateData.timezone = timezone;
    if (preferredCurrency !== undefined) updateData.preferredCurrency = preferredCurrency;
    if (language !== undefined) updateData.language = language;
    if (leaderboardVisible !== undefined) updateData.leaderboardVisible = leaderboardVisible;
    if (notificationsEnabled !== undefined) updateData.notificationsEnabled = notificationsEnabled;
    if (priorityFee !== undefined) updateData.priorityFee = priorityFee;
    if (autoPersistence !== undefined) updateData.autoPersistence = autoPersistence;

    console.log(`[API] Updating profile for user: ${session.user.id}`);
    
    // Ensure we have a username for creation if it's missing
    const username = data.username || `vault_${session.user.id.slice(0, 8)}`;

    const profile = await (prisma.profile as any).upsert({
      where: { userId: session.user.id },
      update: updateData,
      create: {
        userId: session.user.id,
        username,
        ...updateData,
      },
    });

    console.log("[API] Profile sync successful");
    return NextResponse.json(profile);
  } catch (err: any) {
    console.error("[API] Profile sync failure:", err.message || err);
    return NextResponse.json({ 
      error: "Protocol Sync Error", 
      details: err.message || "Unknown internal failure"
    }, { status: 500 });
  }
}
