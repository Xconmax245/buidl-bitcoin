"use client";

import Link from "next/link";

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
              href="/dashboard"
              className="text-gray-400 hover:text-white transition-colors text-xs lg:text-sm font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
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
              Mainnet Live
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
                <span className="material-icons text-primary text-base">verified_user</span>
                Audited by Trail of Bits
              </div>
              <div className="flex items-center gap-2">
                <span className="material-icons text-primary text-base">code</span>
                Open Source
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

      {/* Partners Footer Strip */}
      <div className="border-t border-gray-800 bg-background-dark/50 backdrop-blur-sm py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-sm text-gray-500 font-medium">Trusted by institutions worldwide</span>
          <div className="flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-lg font-bold text-white">GENESIS</span>
            <span className="text-lg font-bold font-tight tracking-tighter text-white">BLOCKFI</span>
            <span className="text-lg font-semibold italic text-white">NEXO</span>
            <span className="text-lg font-bold font-tight text-white flex items-center gap-1">
              <span className="block w-3 h-3 bg-white rounded-full" />CIRCLE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
