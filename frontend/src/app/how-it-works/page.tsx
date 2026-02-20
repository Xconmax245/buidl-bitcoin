"use client";

import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Settings, 
  Lock, 
  Cpu, 
  Network, 
  Zap, 
  ArrowRight, 
  Terminal,
  Database,
  Search,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  Gavel
} from "lucide-react";

const STEPS = [
  {
    id: "01",
    title: "Sovereign Intent",
    desc: "Define your commitment parameters: Lock duration (Blocks), target sBTC volume, and maturity beneficiary. The protocol generates a deterministic rule-set.",
    icon: Settings,
    type: "INPUT_STREAM",
    details: "m/84'/0'/0'/1",
    code: `(create-vault \n  (amount u50000000) \n  (lock u14400))`
  },
  {
    id: "02",
    title: "Multi-Sig Verification",
    desc: "Your assets are synchronized with the Stacks Layer 2 multi-sig bridge. Proof-of-Transfer (PoX) logic verifies the Bitcoin L1 state before sealing the vault.",
    icon: Shield,
    type: "TX_VERIFICATION",
    details: "H=842,015",
    tx: "8f3...c29"
  },
  {
    id: "03",
    title: "Immutable Custody",
    desc: "The Clarity contract enforces a strict block-height lock. Withdrawal logic is mathematically obstructed until the designated maturity height is recorded.",
    icon: Lock,
    type: "STATE_ENFORCEMENT",
    details: "ENFORCED",
    progress: 100
  },
  {
    id: "04",
    title: "Autonomous Settlement",
    desc: "Once maturity height is reached, the protocol automatically releases custody. Alternatively, early exits trigger programmatic slashing based on the initial rule-set.",
    icon: Zap,
    type: "SETTLEMENT",
    details: "SETTLED",
    status: "FINALIZED"
  }
];

export default function HowItWorksPage() {
  return (
    <div className="bg-background-dark font-display text-slate-200 min-h-screen flex overflow-hidden selection:bg-primary selection:text-background-dark">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Technical Header */}
        <header className="h-24 hidden lg:flex items-center justify-between px-10 border-b border-white/5 bg-background-dark/80 backdrop-blur-xl z-20 sticky top-0">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-white tracking-tight uppercase italic">Execution Protocol</h1>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
              <Cpu size={14} className="text-primary" />
              Logic Lifecycle
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="px-4 py-2 bg-white/2 border border-white/5 rounded-xl text-[10px] font-mono font-bold text-slate-500">
               VERSION: 0.1.4-BETA
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 md:p-8 lg:p-12 pt-24 lg:pt-12 scroll-smooth bg-glow">
          <div className="max-w-6xl mx-auto space-y-20 pb-20">
            
            {/* HER0 - Visual Flow Intro */}
            <section className="text-center space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest"
              >
                <Layers size={12} />
                Architecture Diagram
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                The Anatomy of <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary-dark">Sovereign Rules</span>
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
                Ironclad maps Bitcoin's finality to programmable logic. Follow the technical lifecycle of a trustless savings commitment.
              </p>
            </section>

            {/* Timeline - High Density Technical View */}
            <div className="relative space-y-12">
               {/* Connector Line */}
               <div className="absolute left-[20px] lg:left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-primary/50 via-white/10 to-transparent -translate-x-1/2 hidden lg:block" />

               {STEPS.map((step, i) => (
                 <motion.div 
                   key={step.id}
                   initial={{ opacity: 0, y: 40 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   className={`relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}
                 >
                    {/* Panel 1: Content */}
                    <div className={`space-y-6 ${i % 2 === 0 ? 'lg:text-right' : 'lg:order-2'}`}>
                       <div className={`flex flex-col ${i % 2 === 0 ? 'lg:items-end' : 'lg:items-start'} gap-4`}>
                          <div className="flex items-center gap-4">
                             {i % 2 !== 0 && (
                                <div className="p-4 bg-primary/10 rounded-3xl text-primary shadow-[0_0_20px_rgba(169,208,195,0.1)]">
                                   <step.icon size={28} />
                                </div>
                             )}
                             <div>
                                <h3 className="text-2xl font-black text-white tracking-tight uppercase">{step.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                   <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{step.type}</span>
                                   <span className="w-1 h-1 rounded-full bg-slate-700" />
                                   <span className="text-[10px] font-mono text-slate-500 tracking-tighter">{step.details}</span>
                                </div>
                             </div>
                             {i % 2 === 0 && (
                                <div className="p-4 bg-primary/10 rounded-3xl text-primary shadow-[0_0_20px_rgba(169,208,195,0.1)]">
                                   <step.icon size={28} />
                                </div>
                             )}
                          </div>
                          
                          <p className="text-sm text-slate-400 leading-relaxed max-w-lg font-light">
                             {step.desc}
                          </p>

                          {step.code && (
                             <div className="w-full max-w-md bg-white/2 border border-white/5 rounded-2xl p-4 font-mono text-[10px] text-slate-500 relative overflow-hidden text-left">
                                <span className="absolute top-2 right-2 text-[8px] font-bold text-primary/50">CLARITY_V1</span>
                                {step.code}
                             </div>
                          )}

                          {step.tx && (
                             <div className="w-full max-w-md flex items-center justify-between p-3 bg-green-500/5 border border-green-500/20 rounded-xl">
                                <div className="flex items-center gap-2">
                                   <CheckCircle2 size={12} className="text-green-500" />
                                   <span className="text-[10px] font-mono text-slate-400 tracking-tighter">HASH: {step.tx}...</span>
                                </div>
                                <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">VERIFIED</span>
                             </div>
                          )}

                          {step.progress && (
                             <div className="w-full max-w-md space-y-2">
                                <div className="flex justify-between items-end">
                                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Security Lock status</span>
                                  <span className="text-[10px] font-mono text-primary uppercase font-bold">In_Custody</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                   <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: "85%" }}
                                      className="h-full bg-primary"
                                   />
                                </div>
                             </div>
                          )}
                       </div>
                    </div>

                    {/* Panel 2: Visual Metaphor */}
                    <div className={`${i % 2 !== 0 ? 'lg:order-1' : ''}`}>
                     <div className="lg:col-span-4 glass-panel rounded-[2.5rem] p-8 border-white/5 bg-secondary/2 flex items-center justify-center relative overflow-hidden group hover:border-white/10 transition-all min-h-[220px] bg-primary/1">
                          <div className="absolute inset-0 bg-primary/1 pointer-events-none" />
                          
                          {/* Dynamic visual representations purely with CSS/Lucide */}
                          {step.id === '01' && (
                             <div className="relative animate-pulse-slow">
                                <div className="w-32 h-32 border border-white/10 rounded-full flex items-center justify-center">
                                   <div className="w-24 h-24 border border-dashed border-primary/40 rounded-full animate-spin-slow" />
                                   <Terminal size={40} className="text-primary opacity-50 absolute" />
                                </div>
                             </div>
                          )}
                          {step.id === '02' && (
                             <div className="flex items-center gap-4">
                                <Database size={40} className="text-slate-600" />
                                <ChevronRight size={24} className="text-primary animate-bounce-horizontal" />
                                <Shield size={60} className="text-primary opacity-80" />
                             </div>
                          )}
                          {step.id === '03' && (
                             <div className="relative">
                                 <div className="p-8 bg-white/5 rounded-4xl border border-white/5 relative z-10">
                                   <Lock size={48} className="text-primary shadow-2xl" />
                                </div>
                                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-110 opacity-20" />
                             </div>
                          )}
                          {step.id === '04' && (
                             <div className="text-center space-y-4">
                                <div className="flex gap-4">
                                   <div className="w-16 h-1 bg-primary/50 rounded-full" />
                                   <div className="w-16 h-1 bg-primary/20 rounded-full" />
                                   <div className="w-16 h-1 bg-primary/10 rounded-full" />
                                </div>
                                <CheckCircle2 size={56} className="text-primary mx-auto" />
                             </div>
                          )}

                          <span className="absolute bottom-6 right-8 text-[60px] font-black text-white/2 leading-none pointer-events-none italic">{step.id}</span>
                       </div>
                    </div>

                    {/* Node on central line */}
                    <div className="absolute left-[20px] lg:left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 hidden lg:flex items-center justify-center">
                       <div className="w-3 h-3 border-2 border-primary rounded-full z-20 group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(169,208,195,0.5)] bg-primary" />
                    </div>
                 </motion.div>
               ))}
            </div>

            {/* Bottom Section: Multi-Layer Security Visualization */}
            <section className="glass-panel p-12 rounded-4xl border-white/5 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/30 to-transparent" />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                  <div className="space-y-6">
                     <h3 className="text-3xl font-black text-white italic tracking-tighter">Cross-Layer <br />Finality Engine</h3>
                     <p className="text-sm text-slate-500 leading-relaxed font-light">
                        The Ironclad Protocol doesn't just store data; it inherits the hashpower of Bitcoin. By settlement time, your savings rules are as immutable as the Bitcoin ledger itself.
                     </p>
                     <div className="flex gap-4">
                        <div className="px-4 py-2 bg-white/2 rounded-xl text-[10px] font-black uppercase text-slate-400 border border-white/5">PoX Consensus</div>
                        <div className="px-4 py-2 bg-white/2 rounded-xl text-[10px] font-black uppercase text-slate-400 border border-white/5">BIP-322 Proofs</div>
                     </div>
                  </div>
                  <div className="p-8 bg-background-dark/50 rounded-3xl border border-white/5 space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-500 uppercase font-black">Contract_Maturity_Check</span>
                        <div className="flex h-1.5 w-1.5 rounded-full bg-green-500" />
                     </div>
                     <pre className="text-[11px] font-mono text-primary/80">
                        {`>> CHECKING BLOCK_HEIGHT...
>> CURRENT: 842015
>> RULE_TARGET: 842014
>> STATUS: MATURED
>> UNLOCKING ASSETS...
>> SETTLEMENT_READY`}
                     </pre>
                  </div>
               </div>
            </section>

            {/* Final CTA */}
            <section className="text-center py-10 space-y-10">
               <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Ready to initialize?</h2>
               <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Link href="/vault/setup" className="px-10 py-5 bg-primary text-background-dark font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-white transition-all hover:scale-105 shadow-2xl shadow-primary/20 flex items-center gap-2">
                    Start Execution Flow
                    <ArrowRight size={18} />
                  </Link>
                  <Link href="/docs" className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all flex items-center gap-2">
                    <Terminal size={18} />
                    View Specs
                  </Link>
               </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
