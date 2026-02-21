"use client";

import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="bg-background-dark font-display text-white min-h-screen flex flex-col overflow-x-hidden">
      {/* Navigation */}
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
            <Link
              href="/auth"
              className="text-muted-silver hover:text-white transition-all text-[11px] font-black uppercase tracking-widest hidden sm:block"
            >
              Sign In
            </Link>
            <Link
              href="/onboarding"
              className="bg-primary text-background-dark px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 hover:bg-white hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
            >
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Hero Section */}
      <main className="grow relative flex items-center justify-center pt-40 pb-24 px-6">
        {/* Ambient Background Effects */}
        <div className="absolute inset-0 bg-fog-gradient z-0 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 z-0 opacity-[0.05] bg-grid-subtle" />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-16 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/5">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Sovereign Testnet_ v1.2
            </div>

            <h1 className="font-tight font-black text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tighter text-white">
              Sovereign <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-white to-primary-dark">
                Bitcoin Core
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-silver max-w-2xl font-light leading-relaxed">
              Programmable, rules-based BTC commitments secured by the world's most robust settlement layer. Build sovereign wealth without custodial risk.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5 pt-4 w-full sm:w-auto">
              <Link
                href="/onboarding"
                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-linear-to-r from-primary to-primary-dark text-background-dark font-black text-xs uppercase tracking-widest hover:shadow-[0_0_30px_rgba(169,208,195,0.4)] transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 group"
              >
                Go Sovereign
                <span className="material-icons text-xl group-hover:translate-x-1.5 transition-transform font-bold">arrow_forward</span>
              </Link>
              <Link
                href="/docs"
                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 text-white font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 hover:bg-white/10"
              >
                <span className="material-icons text-xl">description</span>
                Whitepaper
              </Link>
            </div>

            <div className="pt-10 flex flex-wrap items-center gap-8 text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-default group">
                <span className="material-icons text-primary/60 group-hover:text-primary text-lg transition-colors">code</span>
                GPL-3.0 Licensed
              </div>
              <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-default group">
                <span className="material-icons text-primary/60 group-hover:text-primary text-lg transition-colors">lock_open</span>
                Open-Protocol
              </div>
              <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-default group">
                <span className="material-icons text-primary/60 group-hover:text-primary text-lg transition-colors">verified_user</span>
                Audit: Verified
              </div>
            </div>
          </div>

          {/* Right Content: Floating Stats */}
          <div className="lg:col-span-5 relative h-[550px] hidden lg:block select-none">
            {/* Spinning Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-primary/10 rounded-full flex items-center justify-center animate-[spin_40s_linear_infinite]">
              <div className="w-64 h-64 border border-primary/20 rounded-full border-dashed" />
            </div>

            {/* Stat Card 1 */}
            <div className="absolute top-[5%] right-[0%] animate-float glass-panel p-6 rounded-3xl w-64 z-20 border-white/10 bg-white/5 backdrop-blur-2xl hover:border-primary/40 transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] text-muted-silver font-black uppercase tracking-widest">Global TVL</span>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background-dark transition-colors">
                  <span className="material-icons text-sm">lock</span>
                </div>
              </div>
              <div className="text-3xl font-black text-white mb-1 tracking-tighter">21,405 BTC</div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-tighter">
                <span className="material-icons text-xs">trending_up</span>
                Institutional Demand +12%
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="absolute top-[45%] left-[-10%] animate-float-delayed glass-panel p-6 rounded-3xl w-64 z-20 border-white/10 bg-white/5 backdrop-blur-2xl hover:border-primary/40 transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] text-muted-silver font-black uppercase tracking-widest">Rule Enforcement</span>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background-dark transition-colors">
                  <span className="material-icons text-sm">dns</span>
                </div>
              </div>
              <div className="text-3xl font-black text-white mb-2 tracking-tighter">1,240 Vaults</div>
              <div className="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden p-px">
                <div className="bg-primary h-full rounded-full shadow-[0_0_10px_rgba(169,208,195,0.5)]" style={{ width: "82%" }} />
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="absolute bottom-[5%] right-[5%] animate-float glass-panel p-6 rounded-3xl w-60 z-20 border-white/10 bg-white/5 backdrop-blur-2xl hover:border-primary/40 transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] text-muted-silver font-black uppercase tracking-widest">Sovereign Yield</span>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background-dark transition-colors">
                  <span className="material-icons text-sm">percent</span>
                </div>
              </div>
              <div className="text-4xl font-black text-primary mb-1 tracking-tighter">4.50%</div>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Protocol-Locked APY</span>
            </div>
          </div>

          {/* Mobile Stats */}
          <div className="lg:hidden w-full grid grid-cols-2 gap-4 mt-8">
            <div className="glass-panel p-4 rounded-lg">
              <p className="text-xs text-gray-400 uppercase">BTC Locked</p>
              <p className="text-xl font-bold text-white">21,405</p>
            </div>
            <div className="glass-panel p-4 rounded-lg">
              <p className="text-xs text-gray-400 uppercase">APY</p>
              <p className="text-xl font-bold text-primary">4.5%</p>
            </div>
          </div>
        </div>
      </main>

      {/* Protocol Highlights Section */}
      <section className="border-t border-white/5 py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-tight font-bold text-white mb-4">How Ironclad Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">A programmable savings protocol built on Bitcoin, powered by Stacks smart contracts.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "account_balance_wallet",
                title: "Create Your Vault",
                desc: "Generate a non-custodial BTC wallet with military-grade local encryption. Your keys never leave your device.",
              },
              {
                icon: "schedule",
                title: "Set Commitment Rules",
                desc: "Define time locks, penalty rates, and savings goals. Smart contracts enforce your rules with zero trust required.",
              },
              {
                icon: "trending_up",
                title: "Build Reputation",
                desc: "Successfully completing savings builds your on-chain reputation score, unlocking lower fees and higher protocol tiers.",
              },
              {
                icon: "how_to_vote",
                title: "Community Governance",
                desc: "Vote on protocol parameters and upgrades. Your reputation score determines your voting power.",
              },
              {
                icon: "analytics",
                title: "Track & Analyze",
                desc: "Monitor your savings progress, view analytics dashboards, and track your portfolio performance in real-time.",
              },
              {
                icon: "security",
                title: "Bitcoin Security",
                desc: "All funds are secured by Bitcoin's finality. Stacks smart contracts settle on Bitcoin Layer 1 for ultimate security.",
              },
            ].map((feature, i) => (
              <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-primary/20 transition-all group">
                <span className="material-icons text-primary text-3xl mb-4 block group-hover:scale-110 transition-transform">{feature.icon}</span>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/how-it-works" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
              Learn more about the protocol
              <span className="material-icons text-lg">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Documentation / Read the Protocol Section */}
      <section className="border-t border-white/5 py-16 sm:py-24 px-4 sm:px-6 bg-white/1">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium uppercase tracking-wider mb-6">
              <span className="material-icons text-sm">menu_book</span> Documentation
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-tight font-bold text-white mb-4">Read the Protocol</h2>
            <p className="text-gray-400 max-w-2xl mx-auto px-4">
              Comprehensive documentation covering architecture, smart contracts, security model, and developer guides.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2 sm:px-0">
            {[
              { title: "Getting Started", desc: "Quick start guide for creating your first vault and making your first commitment.", href: "/docs", icon: "rocket_launch" },
              { title: "Architecture", desc: "Deep dive into the protocol design, smart contract interactions, and data model.", href: "/docs", icon: "architecture" },
              { title: "Security Model", desc: "Learn about local encryption, key management, and the non-custodial design.", href: "/security", icon: "shield" },
              { title: "API Reference", desc: "Smart contract function signatures, parameters, and usage examples.", href: "/docs", icon: "api" },
            ].map((doc, i) => (
              <Link key={i} href={doc.href} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group block">
                <span className="material-icons text-primary text-2xl mb-4 block">{doc.icon}</span>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-primary transition-colors">{doc.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{doc.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Careers / Join Us CTA */}
      <section className="border-t border-white/5 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-primary/20 bg-primary/3 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> We're Hiring
            </span>
            <h2 className="text-2xl sm:text-3xl font-tight font-bold text-white mb-4">Build the Future of Bitcoin Savings</h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Join a remote-first team of Bitcoin builders, smart contract engineers, and security researchers.
            </p>
            <Link href="/careers" className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-background-dark font-bold transition-all hover:bg-white">
              View Open Positions
              <span className="material-icons text-lg">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Partners Strip */}
      <div className="border-t border-gray-800 bg-background-dark/50 backdrop-blur-sm py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-sm text-gray-500 font-medium">Built with</span>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-sm sm:text-lg font-bold text-white">BITCOIN</span>
            <span className="text-sm sm:text-lg font-bold font-tight tracking-tighter text-white">STACKS</span>
            <span className="text-sm sm:text-lg font-semibold text-white">NEXT.JS</span>
            <span className="text-sm sm:text-lg font-bold font-tight text-white">PRISMA</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
