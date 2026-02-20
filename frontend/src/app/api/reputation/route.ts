import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: {
        reputation: true,
        rank: true,
        achievements: true,
      }
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (err) {
    console.error("Fetch reputation error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // This endpoint could be used to "Sync" or "Claim" achievements
    // For now, we'll allow it to update reputation if logic allows
    const data = await req.json();
    const { reputation, rank, achievements } = data;

    const updateData: any = {};
    if (reputation !== undefined) updateData.reputation = reputation;
    if (rank !== undefined) updateData.rank = rank;
    if (achievements !== undefined) updateData.achievements = achievements;

    const profile = await prisma.profile.update({
      where: { userId: session.user.id },
      data: updateData,
    });

    return NextResponse.json(profile);
  } catch (err) {
    console.error("Update reputation error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Protocol Heartbeat: Validated Reputation Matrix

