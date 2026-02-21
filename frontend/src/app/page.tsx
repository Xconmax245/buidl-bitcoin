"use client";

import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="bg-background-dark font-display text-white min-h-screen flex flex-col overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 bg-background-dark/80 backdrop-blur-xl border-b border-white/5 lg:bg-transparent lg:backdrop-blur-none lg:border-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-primary-dark flex items-center justify-center text-background-dark font-bold">
              <span className="material-icons text-lg">shield</span>
            </div>
            <span className="font-tight font-bold text-base lg:text-lg tracking-tight text-white uppercase">
              IRONCLAD
            </span>
          </Link>
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-400">
            <Link href="/philosophy" className="hover:text-primary transition-colors">Philosophy</Link>
            <Link href="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link>
            <Link href="/security" className="hover:text-primary transition-colors">Security</Link>
            <Link href="/docs" className="hover:text-primary transition-colors">Docs</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth"
              className="text-gray-400 hover:text-white transition-colors text-xs lg:text-sm font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/onboarding"
              className="bg-primary text-background-dark px-4 py-2 rounded-lg text-xs lg:text-sm font-bold transition-all duration-300 hover:bg-white"
            >
              LAUNCH APP
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Hero Section */}
      <main className="grow relative flex items-center justify-center pt-20 pb-20 px-6">
        {/* Ambient Background Effects */}
        <div className="absolute inset-0 bg-fog-gradient z-0 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 z-0 opacity-[0.03] bg-grid-subtle" />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-primary/20 text-primary text-xs font-medium tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Testnet Live
            </div>

            <h1 className="font-tight font-bold text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-white">
              Programmable <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-dark to-primary">
                Bitcoin Savings
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
              Trustless, rule-based BTC commitments secured by Bitcoin finality. Build generational wealth without custodial risk.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
              <Link
                href="/onboarding"
                className="w-full sm:w-auto px-8 py-4 rounded-lg bg-linear-to-r from-primary to-primary-dark text-background-dark font-bold text-base hover:shadow-[0_0_20px_rgba(169,208,195,0.3)] transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
              >
                Open App
                <span className="material-icons text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
              <Link
                href="/docs"
                className="w-full sm:w-auto px-8 py-4 rounded-lg bg-transparent border border-gray-600 hover:border-primary text-white font-medium text-base transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span className="material-icons text-lg">description</span>
                Read the Protocol
              </Link>
            </div>

            <div className="pt-8 flex items-center gap-6 text-sm text-gray-500 font-mono">
              <div className="flex items-center gap-2">
                <span className="material-icons text-primary text-base">code</span>
                Open Source
              </div>
              <div className="flex items-center gap-2">
                <span className="material-icons text-primary text-base">lock</span>
                Non-Custodial
              </div>
            </div>
          </div>

          {/* Right Content: Floating Stats */}
          <div className="lg:col-span-5 relative h-[500px] hidden lg:block select-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-primary/10 rounded-full flex items-center justify-center animate-[spin_30s_linear_infinite]">
              <div className="w-48 h-48 border border-primary/20 rounded-full" />
            </div>

            <div className="connector-line w-32 top-[30%] left-[20%] -rotate-15" />
            <div className="connector-line w-32 bottom-[35%] right-[25%] rotate-15" />
            <div className="connector-line-vertical h-24 top-[15%] right-[30%]" />

            {/* Stat Card 1 */}
            <div className="absolute top-[10%] right-[5%] animate-float glass-panel p-5 rounded-lg w-60 z-20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Value Locked</span>
                <span className="material-icons text-primary text-sm">lock</span>
              </div>
              <div className="text-2xl font-tight font-bold text-white mb-1">21,405 BTC</div>
              <div className="flex items-center gap-1 text-xs text-primary">
                <span className="material-icons text-[10px]">trending_up</span>
                +12.4% this week
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="absolute top-[40%] left-[-5%] animate-float-delayed glass-panel p-5 rounded-lg w-56 z-20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Active Vaults</span>
                <span className="material-icons text-primary text-sm">dns</span>
              </div>
              <div className="text-2xl font-tight font-bold text-white mb-1">1,240</div>
              <div className="w-full bg-gray-700 h-1 rounded-full mt-2 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "75%" }} />
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="absolute bottom-[15%] right-[10%] animate-float glass-panel p-5 rounded-lg w-48 z-20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Protocol APY</span>
                <span className="material-icons text-primary text-sm">percent</span>
              </div>
              <div className="text-3xl font-tight font-bold text-primary mb-1">4.5%</div>
              <span className="text-xs text-gray-500">Fixed rate yield</span>
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
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium uppercase tracking-wider mb-6">
              <span className="material-icons text-sm">menu_book</span> Documentation
            </span>
            <h2 className="text-3xl sm:text-4xl font-tight font-bold text-white mb-4">Read the Protocol</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Comprehensive documentation covering architecture, smart contracts, security model, and developer guides.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
