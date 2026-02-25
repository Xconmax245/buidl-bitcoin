"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useWallet } from "@/providers/WalletProvider";
import { motion } from "framer-motion";

export function Navbar() {
  const { data: session } = useSession();
  const { address, hasWallet } = useWallet();
  const isDemo = false;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-panel px-6 py-3 rounded-2xl border-white/10 bg-background-dark/30 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-primary-dark flex items-center justify-center text-background-dark font-bold shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <span className="material-icons text-xl">shield</span>
          </div>
          <span className="font-tight font-bold text-lg lg:text-xl tracking-tight text-white uppercase">
            IRONCLAD
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-muted-silver">
          <Link href="/philosophy" className="hover:text-primary transition-all hover:tracking-[0.25em]">Philosophy</Link>
          <Link href="/how-it-works" className="hover:text-primary transition-all hover:tracking-[0.25em]">How It Works</Link>
          <Link href="/security" className="hover:text-primary transition-all hover:tracking-[0.25em]">Security</Link>
          <Link href="/docs" className="hover:text-primary transition-all hover:tracking-[0.25em]">Docs</Link>
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          {!session ? (
            <Link
              href="/auth"
              className="text-muted-silver hover:text-white transition-all text-[11px] font-black uppercase tracking-widest hidden sm:block"
            >
              Sign In
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="text-muted-silver hover:text-white transition-all text-[11px] font-black uppercase tracking-widest hidden sm:block"
            >
              Dashboard
            </Link>
          )}
          <Link
            href="/onboarding"
            className="bg-primary text-background-dark px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 hover:bg-white hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
          >
            {session ? 'Launch App' : 'Get Started'}
          </Link>
        </div>
      </div>
    </nav>
  );
}
