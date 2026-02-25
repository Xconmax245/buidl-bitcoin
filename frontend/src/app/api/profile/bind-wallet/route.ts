
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const bindWalletSchema = z.object({
  btcXpub: z.string().optional(),
  stacksPrincipal: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = bindWalletSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.errors },
        { status: 400 }
      );
    }

    const { btcXpub, stacksPrincipal } = result.data;

    // Only update if provided
    const updateData: any = {};
    // Set timestamp if at least one is being bound and it wasn't set before
    // Or just always update it to show *latest* binding? 
    // The spec says "wallet_binding_timestamp", usually implies the first time.
    const userId = session.user.id;

    // 1. Update User model if stacksPrincipal provided
    if (stacksPrincipal) {
      await prisma.user.update({
        where: { id: userId },
        data: { walletAddress: stacksPrincipal }
      });
    }

    // 2. Update Profile model if btcXpub provided
    const profileData: any = {};
    if (btcXpub) profileData.btcXpub = btcXpub;

    // Check current profile first to set timestamp
    const currentProfile = await prisma.profile.findUnique({
      where: { userId }
    });

    if (currentProfile && !currentProfile.walletBindingTimestamp && (btcXpub || stacksPrincipal)) {
        profileData.walletBindingTimestamp = new Date();
    }

    const updatedProfile = currentProfile ? await prisma.profile.update({
      where: { userId },
      data: profileData,
    }) : null;

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error("Wallet binding error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
