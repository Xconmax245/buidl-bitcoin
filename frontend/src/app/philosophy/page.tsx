"use client";

import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { motion } from "framer-motion";
import { 
  Shield, 
  Lock, 
  TrendingDown, 
  Zap, 
  ArrowRight, 
  Fingerprint, 
  BarChart3, 
  Globe, 
  Cpu,
  RefreshCcw,
  CheckCircle2,
  Gavel
} from "lucide-react";

export default function PhilosophyPage() {
  return (
    <div className="bg-background-dark font-display text-slate-200 min-h-screen flex overflow-hidden selection:bg-primary selection:text-background-dark">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Technical Header */}
        <header className="h-24 hidden lg:flex items-center justify-between px-10 border-b border-white/5 bg-background-dark/80 backdrop-blur-xl z-20 sticky top-0">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-white tracking-tight uppercase italic">Core Philosophy</h1>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
              <Globe size={14} className="text-primary" />
              Sovereign Baseline
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 md:p-8 lg:p-12 pt-24 lg:pt-12 scroll-smooth bg-glow">
          <div className="max-w-6xl mx-auto space-y-20 pb-20">
            
            {/* HERO - The Problem of Trust */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest"
                >
                  <RefreshCcw size={12} className="animate-spin-slow" />
                  The Trust Transition
                </motion.div>
                <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter">
                  Beyond <span className="text-red-500 italic">Liabilities</span>. <br />
                  Towards <span className="text-primary">Assets</span>.
                </h2>
                <p className="text-lg text-slate-400 font-light leading-relaxed">
                  Traditional savings are promises made by institutions. Ironclad replaces these promises with <span className="text-white font-bold">cryptographic proofs</span>. We are moving from a system of "trusted intermediaries" to "verified protocols."
                </p>
                <div className="flex gap-4">
                  <div className="p-4 rounded-2xl bg-white/2 border border-white/5 flex items-center gap-4">
                    <TrendingDown className="text-red-500" size={24} />
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase">Legacy Decay</p>
                      <p className="text-xs text-white">-7.2% Purchase Power / Yr</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-10 rounded-[3rem] border-white/5 bg-primary/2 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                 <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tighter">The Ironclad Mandate</h3>
                 <div className="space-y-6">
                    {[
                      { icon: Lock, title: "Deterministic Custody", desc: "No human has the keys. Only the protocol, governed by your signed intent." },
                      { icon: Fingerprint, title: "Sovereign Identity", desc: "Your savings are linked to your keys, not your name. Privacy is protocol-native." },
                      { icon: Gavel, title: "Mathematical Consensus", desc: "Rules are enforced by wait-times and hashpower, not legal filings." },
                    ].map((m, i) => (
                      <div key={i} className="flex gap-6 items-start group">
                         <div className="p-3 bg-white/5 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                            <m.icon size={20} />
                         </div>
                         <div>
                            <h4 className="text-sm font-bold text-white mb-1">{m.title}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed font-light">{m.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            </section>

            {/* Comparison Table - Technical Depth */}
            <section className="space-y-10">
               <div className="text-center">
                  <h3 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Systems Analysis</h3>
                  <p className="text-slate-500 text-sm italic">Comparing centralized liability with sovereign protocol assets.</p>
               </div>

               <div className="glass-panel rounded-[2.5rem] border-white/5 overflow-hidden">
                  <table className="w-full text-left">
                     <thead className="bg-white/2 border-b border-white/5">
                        <tr>
                           <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Variable</th>
                           <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-red-500/5">Legacy Banking</th>
                           <th className="px-8 py-6 text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5">Ironclad Protocol</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {[
                          { var: "Settlement Layer", legacy: "Central Bank Ledger", protocol: "Bitcoin / Stacks L2" },
                          { var: "Finality Engine", legacy: "Legal Enforcement", protocol: "PoW Hashpower" },
                          { var: "Custody Model", legacy: "Fractional Reserve", protocol: "Non-Custodial Multi-sig" },
                          { var: "Risk Profile", legacy: "Counterparty Failure", protocol: "Mathematical Maturity" },
                          { var: "Verification", legacy: "Periodic Audits", protocol: "Real-time On-chain Proof" },
                        ].map((row, i) => (
                          <tr key={i} className="group hover:bg-white/2 transition-all">
                             <td className="px-8 py-6 text-xs font-bold text-slate-400 italic">{row.var}</td>
                             <td className="px-8 py-6 text-xs text-slate-500 font-mono">{row.legacy}</td>
                             <td className="px-8 py-6 text-xs text-white font-mono flex items-center gap-3">
                                <CheckCircle2 size={12} className="text-primary" />
                                {row.protocol}
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </section>

            {/* Visual Callout - The Network State */}
            <section className="glass-panel p-16 rounded-[4rem] border-white/5 text-center relative overflow-hidden bg-primary/1">
               <div className="absolute top-0 right-0 w-full h-full bg-grid-dark opacity-[0.03] pointer-events-none" />
               <div className="relative z-10 max-w-2xl mx-auto space-y-8 rounded-4xl">
                  <div className="w-20 h-20 bg-primary/10 rounded-4xl flex items-center justify-center mx-auto border border-primary/20 mb-8">
                     <BarChart3 size={40} className="text-primary" />
                  </div>
                  <h3 className="text-4xl font-black text-white leading-tight italic">Transitioning to <br />Sovereign Credit.</h3>
                  <p className="text-lg text-slate-400 font-light leading-relaxed">
                    By participating in the Ironclad Protocol, you aren't just saving Bitcoin; you are building a <span className="text-white font-bold">Resilience Reputation</span> that persists across the network state.
                  </p>
                  <div className="pt-6">
                     <Link 
                        href="/vault/setup" 
                        className="inline-flex px-12 py-5 bg-primary text-background-dark font-black text-sm uppercase tracking-widest rounded-3xl hover:bg-white transition-all shadow-2xl shadow-primary/30 items-center gap-3"
                     >
                        Claim Your Sovereignty
                        <ArrowRight size={20} />
                     </Link>
                  </div>
               </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
