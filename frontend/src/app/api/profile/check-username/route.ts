import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  const username = req.nextUrl.searchParams.get("username");

  if (!username || username.length < 3) {
    return NextResponse.json({ available: false, error: "Invalid username" });
  }

  try {
    const existing = await prisma.profile.findUnique({
      where: { username },
    });

    // If it's the current user's own username, it's "available" for them to keep
    const available = !existing || (session?.user?.id && existing.userId === session.user.id);

    return NextResponse.json({ available });
  } catch (err) {
    console.error("Check username error:", err);
    return NextResponse.json({ available: false, error: "Check failed" });
  }
}
