import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Return some realistic mock transactions for the demo
  const mockTransactions = [
    {
      id: "tx-7721",
      type: "DEPOSIT",
      amount: 0.0050,
      status: "CONFIRMED",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      hash: "0x3b1a...f2e0"
    },
    {
      id: "tx-8832",
      type: "VAULT_SEAL",
      amount: 0.0000,
      status: "CONFIRMED",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      hash: "0x8e92...a1b4"
    },
    {
      id: "tx-9943",
      type: "FEE_PAYMENT",
      amount: -0.0001,
      status: "PENDING",
      date: new Date().toISOString(),
      hash: "0x0a75...c6a9"
    }
  ];

  return NextResponse.json({ transactions: mockTransactions });
}
