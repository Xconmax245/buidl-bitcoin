import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ exists: false });
  }

  try {

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    });

    // Profile only counts as existing if it's fully set up (has country/timezone)
    const isComplete = !!profile && !!profile.country && !!profile.timezone;

    return NextResponse.json({ exists: isComplete });
  } catch (err) {
    return NextResponse.json({ exists: false });
  }
}
