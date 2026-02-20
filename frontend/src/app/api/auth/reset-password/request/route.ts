import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { rateLimit, rateLimitResponse } from "@/lib/security/rate-limit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!rateLimit(ip, 2)) { // max 2 reset requests
    return rateLimitResponse();
  }

  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email }
    });

    // For security, don't reveal if user exists or not
    if (!user) {
      return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      }
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset/${token}`;
    
    // In production, send this via Resend/SendGrid
    console.log(`[AUTH] Password Reset for ${email}: ${resetUrl}`);

    return NextResponse.json({ message: "Reset link generated." });
  } catch (err) {
    console.error("Reset request error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
