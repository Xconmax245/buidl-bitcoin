import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { isEmailVerified: true },
    });

    return NextResponse.json({ message: "Verified" });
  } catch (err) {
    return NextResponse.json({ error: "Fail" }, { status: 500 });
  }
}
