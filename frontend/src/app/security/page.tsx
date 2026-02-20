"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  Key, 
  Zap, 
  Server, 
  Cpu, 
  Search, 
  AlertTriangle,
  Fingerprint,
  ChevronRight,
  Download,
  Terminal,
  FileCode
} from "lucide-react";

const ATTACK_VECTORS = [
  {
    title: "Double Spend Mitigation",
    desc: "Transactions are only finalized after Bitcoin-level settlement confirmation via sBTC nodes.",
    status: "SECURE",
    icon: Zap
  },
  {
    title: "Contract Re-entrancy",
    desc: "Clarity language is non-Turing complete, eliminating entire classes of re-entrancy bugs.",
    status: "SECURE",
    icon: Lock
  },
  {
    title: "Seed Extraction",
    desc: "Mnemonic materials never leave your local environment; signed via Stacks/Xverse provider.",
    status: "USER-MANAGED",
    icon: Key
  },
  {
    title: "Oracle Manipulation",
    desc: "Uses a decentralized set of oracles with reputation-weighted slashing for false reporting.",
    status: "HIGH-CONFIDENCE",
    icon: Eye
  }
];

const AUDIT_FINDINGS = [
  { id: "FIND-01", area: "Logic", severity: "Low", status: "Fixed", title: "Integer Overflow in Reward Calc" },
  { id: "FIND-02", area: "Gas", severity: "Medium", status: "Optimized", title: "Redundant Map Lookups" },
  { id: "FIND-03", area: "UX", severity: "Info", status: "Mitigated", title: "Seed Phrase UI Guidance" }
];

export default function SecurityPage() {
  return (
    <div className="bg-background-dark font-display text-slate-200 min-h-screen flex overflow-hidden selection:bg-primary selection:text-background-dark">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-24 hidden lg:flex items-center justify-between px-10 border-b border-white/5 bg-background-dark/80 backdrop-blur-xl z-20 sticky top-0">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-white tracking-tight">Security Infrastructure</h1>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
              <ShieldCheck size={14} className="text-primary" />
              Verified Architecture
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-black text-green-500 uppercase">System Nominal</span>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 md:p-8 lg:p-12 pt-24 lg:pt-12 scroll-smooth bg-glow">
          <div className="max-w-6xl mx-auto space-y-12 pb-20">
            
            {/* HER0 - Trust Pillar */}
            <section className="relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="max-w-3xl">
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                  Protocol-Level <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary-dark">Sovereignty</span> & Proof-of-Reserve.
                </h2>
                <p className="text-lg text-slate-400 font-light leading-relaxed mb-8">
                  Ironclad eliminates custodial risk by moving trust from humans to immutable Clarity smart contracts. Every savings commitment is mathematically verifiable on both the Bitcoin and Stacks layers.
                </p>
                <div className="flex flex-wrap gap-4">
                   <button className="px-6 py-3 bg-primary text-background-dark font-bold rounded-2xl flex items-center gap-2 hover:bg-white transition-all shadow-xl shadow-primary/10">
                      <Download size={18} />
                      AUDIT REPORT 2024.pdf
                   </button>
                   <button className="px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all">
                      <FileCode size={18} />
                      VERIFY CONTRACT
                   </button>
                </div>
              </div>
            </section>

            {/* Technical Layers Visualization */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
               <div className="lg:col-span-12 glass-panel p-10 rounded-[2.5rem] border-white/5 relative overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10 text-center">
                     <div className="space-y-4">
                        <div className="w-16 h-16 bg-orange-500/10 rounded-3xl flex items-center justify-center text-orange-500 mx-auto mb-6">
                           <Lock size={32} />
                        </div>
                        <h4 className="text-lg font-bold text-white uppercase tracking-tighter">Bitcoin L1</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">Ultimate finality. Funds held in multisig vaults secured by Bitcoin hashpower.</p>
                     </div>
                     <div className="space-y-4 pt-10 md:pt-0">
                        <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6 relative">
                           <div className="absolute inset-0 bg-primary/20 rounded-3xl animate-ping opacity-20" />
                           <Cpu size={32} />
                        </div>
                        <h4 className="text-lg font-bold text-white uppercase tracking-tighter">Stacks L2</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">Clarity smart contracts enforce time-locks and reputation logic deterministically.</p>
                     </div>
                     <div className="space-y-4 pt-10 md:pt-0">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-500 mx-auto mb-6">
                           <Fingerprint size={32} />
                        </div>
                        <h4 className="text-lg font-bold text-white uppercase tracking-tighter">Sovereign Key</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">Owner-only access. No protocol upgrades can seize user collateral without consensus.</p>
                     </div>
                  </div>
                  {/* Decorative Connector Line */}
                  <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-px bg-linear-to-r from-orange-500/20 via-primary/50 to-blue-500/20 -translate-y-[20px]" />
               </div>
            </section>

            {/* Attack Vectors & Mitigations */}
            <section className="space-y-8">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/10 rounded-2xl text-red-500">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">Threat Modeling</h3>
                    <p className="text-slate-500 text-sm">Active mitigation strategies for protocol integrity.</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ATTACK_VECTORS.map((v, i) => (
                    <div key={i} className="glass-panel p-8 rounded-4xl border-white/5 flex items-start gap-6 hover:border-white/10 transition-all">
                       <div className="p-4 bg-white/2 rounded-2xl text-slate-400">
                          <v.icon size={28} />
                       </div>
                       <div>
                          <div className="flex items-center gap-3 mb-2">
                             <h4 className="text-lg font-bold text-white">{v.title}</h4>
                             <span className="text-[9px] font-black text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full">{v.status}</span>
                          </div>
                          <p className="text-sm text-slate-500 leading-relaxed font-light">{v.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </section>

            {/* Audit Logs Sidebar - Grid Style */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               <div className="lg:col-span-8 glass-panel p-8 rounded-[2.5rem] border-white/5 space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <Terminal size={24} className="text-primary" />
                        <h4 className="text-lg font-bold text-white">Security Log_</h4>
                     </div>
                     <span className="text-[10px] font-mono text-slate-500">LAST_RUN: 2024.02.17.1355</span>
                  </div>
                  
                  <div className="space-y-3">
                     {AUDIT_FINDINGS.map(finding => (
                       <div key={finding.id} className="flex items-center justify-between p-4 bg-white/2 rounded-2xl border border-white/5 group hover:bg-white/5 transition-all">
                          <div className="flex items-center gap-4">
                             <span className={`w-2 h-2 rounded-full ${finding.severity === 'Low' ? 'bg-blue-400' : finding.severity === 'Medium' ? 'bg-amber-400' : 'bg-slate-400'}`} />
                             <div>
                                <p className="text-xs font-bold text-white">{finding.title}</p>
                                <p className="text-[10px] text-slate-600 font-mono">{finding.id} • {finding.area}</p>
                             </div>
                          </div>
                          <span className="text-[10px] font-black text-primary uppercase tracking-tighter bg-primary/10 px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                             {finding.status}
                          </span>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="lg:col-span-4 glass-panel p-8 rounded-[2.5rem] border-blue-500/10 bg-blue-500/2 flex flex-col justify-center gap-6">
                  <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                    <Server size={32} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2 uppercase tracking-tight">Deterministic Recovery</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Losing your local profile does not endanger your assets. Every vault is derived deterministically from your root key. Use any BIP-39 compatible interface for emergency recovery.
                    </p>
                  </div>
                  <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl text-xs font-bold text-white hover:bg-white/10 transition-all">
                     View Recovery Guide
                     <ChevronRight size={16} className="text-primary" />
                  </button>
               </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
