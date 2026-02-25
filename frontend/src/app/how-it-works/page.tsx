"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { 
  Shield, 
  Settings, 
  Lock, 
  Cpu, 
  Zap, 
  ArrowRight, 
  Terminal,
  Database,
  CheckCircle2,
  Layers,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    id: "01",
    title: "Independent Intent",
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
  const { data: session } = useSession();

  return (
    <div className="bg-background-dark font-display text-slate-200 min-h-screen flex overflow-hidden selection:bg-primary selection:text-background-dark relative">
      {session ? <Sidebar /> : <Navbar />}
      
      <main className={`flex-1 flex flex-col min-h-screen relative ${session ? 'h-screen overflow-hidden pt-16 lg:pt-0' : 'pt-32'}`}>
        <div className="flex-1 overflow-y-auto p-5 md:p-8 lg:p-12 scroll-smooth bg-glow relative">
          <div className="max-w-6xl mx-auto space-y-20 pb-20">
            
            <section className="text-center space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest"
              >
                <Layers size={12} />
                Architecture Diagram
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight uppercase tracking-tighter">
                Anatomy of <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary-dark italic">Independent Rules</span>
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto font-light leading-relaxed wrap-break-word">
                Ironclad maps Bitcoin's finality to programmable logic. Follow the technical lifecycle of a trustless savings commitment.
              </p>
            </section>

            <div className="relative space-y-12">
               <div className="absolute left-[20px] lg:left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-primary/50 via-white/10 to-transparent -translate-x-1/2 hidden lg:block" />

               {STEPS.map((step, i) => (
                 <motion.div 
                   key={step.id}
                   initial={{ opacity: 0, y: 40 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   className={`relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}
                 >
                    <div className={`space-y-6 ${i % 2 === 0 ? 'lg:text-right' : 'lg:order-2'}`}>
                       <div className={`flex flex-col ${i % 2 === 0 ? 'lg:items-end' : 'lg:items-start'} gap-4`}>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                             <div className="p-4 bg-primary/10 rounded-3xl text-primary shadow-[0_0_20px_rgba(169,208,195,0.1)] shrink-0">
                                <step.icon size={28} />
                             </div>
                             <div className="min-w-0">
                                <h3 className="text-2xl font-black text-white tracking-tight uppercase truncate">{step.title}</h3>
                                <div className="flex items-center gap-2 mt-1 min-w-0">
                                   <span className="text-[10px] font-black text-primary uppercase tracking-widest shrink-0">{step.type}</span>
                                   <span className="w-1 h-1 rounded-full bg-slate-700 shrink-0" />
                                   <span className="text-[10px] font-mono text-slate-500 tracking-tighter truncate">{step.details}</span>
                                </div>
                             </div>
                          </div>
                          
                          <p className="text-sm text-slate-400 leading-relaxed max-w-lg font-light wrap-break-word">
                             {step.desc}
                          </p>

                          {step.code && (
                             <div className="w-full max-w-md bg-white/2 border border-white/5 rounded-2xl p-4 font-mono text-[10px] text-slate-500 relative overflow-hidden text-left overflow-x-auto">
                                <pre className="whitespace-pre-wrap">{step.code}</pre>
                             </div>
                          )}

                          {step.tx && (
                             <div className="w-full max-w-md flex items-center justify-between p-3 bg-green-500/5 border border-green-500/20 rounded-xl">
                                <div className="flex items-center gap-2 min-w-0">
                                   <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                                   <span className="text-[10px] font-mono text-slate-400 tracking-tighter truncate">HASH: {step.tx}</span>
                                </div>
                                <span className="text-[9px] font-black text-green-500 uppercase tracking-widest shrink-0">VERIFIED</span>
                             </div>
                          )}
                       </div>
                    </div>

                    <div className={`${i % 2 !== 0 ? 'lg:order-1' : ''}`}>
                       <div className="glass-panel rounded-4xl p-8 border-white/5 bg-primary/1 flex items-center justify-center relative overflow-hidden group hover:border-white/10 transition-all min-h-[200px]">
                          {step.id === '01' && <Terminal size={48} className="text-primary opacity-50" />}
                          {step.id === '02' && <Shield size={60} className="text-primary opacity-80" />}
                          {step.id === '03' && <Lock size={48} className="text-primary shadow-2xl" />}
                          {step.id === '04' && <CheckCircle2 size={56} className="text-primary" />}
                          <span className="absolute bottom-6 right-8 text-6xl font-black text-white/5 leading-none pointer-events-none italic">{step.id}</span>
                       </div>
                    </div>

                    <div className="absolute left-[20px] lg:left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 hidden lg:flex items-center justify-center">
                       <div className="w-3 h-3 border-2 border-primary rounded-full z-20 bg-primary shadow-[0_0_10px_rgba(169,208,195,0.5)]" />
                    </div>
                 </motion.div>
               ))}
            </div>

            <section className="glass-panel p-8 md:p-12 rounded-4xl border-white/5 relative overflow-hidden bg-white/1">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                  <div className="space-y-6">
                     <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">Finality Engine</h3>
                     <p className="text-sm text-slate-500 leading-relaxed font-light wrap-break-word">
                        The Ironclad Protocol doesn't just store data; it inherits the hashpower of Bitcoin. By settlement time, your savings rules are as immutable as the Bitcoin ledger itself.
                     </p>
                  </div>
                  <div className="p-8 bg-black/40 rounded-3xl border border-white/5 font-mono text-[11px] text-primary/80 overflow-x-auto">
                     <pre>{`>> BLOCK_HEIGHT: 842015\n>> STATUS: MATURED\n>> SETTLEMENT_READY`}</pre>
                  </div>
               </div>
            </section>

            <section className="text-center py-10 space-y-10">
               <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Initialize Protocol?</h2>
               <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Link href="/vault/setup" className="px-10 py-5 bg-primary text-background-dark font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-white transition-all shadow-xl shadow-primary/20 flex items-center gap-2 justify-center">
                    Launch Flow
                    <ArrowRight size={18} />
                  </Link>
                  <Link href="/docs" className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all flex items-center gap-2 justify-center">
                    <Terminal size={18} />
                    View Docs
                  </Link>
               </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
