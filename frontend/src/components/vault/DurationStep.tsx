"use client";

import { motion } from "framer-motion";
import { Clock, Globe, Zap, ArrowRight, Shield, TrendingUp, Calendar, BarChart3, Layers, Database } from "lucide-react";
import { useState, useEffect } from "react";
import { calculateTier } from "@/lib/vault/tiers";
import { toast } from "sonner";

interface DurationStepProps {
  onNext: (duration: number) => void;
  onPrev: () => void;
}

const PRESETS = [
  { label: "1 Month", value: 1, tier: "ASSOCIATE", premium: "Base Scale", blocks: "~4,320" },
  { label: "6 Months", value: 6, tier: "STRATEGIC", premium: "+0.5% APY", blocks: "~25,920" },
  { label: "1 Year", value: 12, tier: "STRATEGIC++", premium: "+1.2% APY", preferred: true, blocks: "~51,840" },
  { label: "4 Years", value: 48, tier: "IRONCLAD", premium: "+2.5% APY", blocks: "~207,360" },
];

export function DurationStep({ onNext, onPrev }: DurationStepProps) {
  const [duration, setDuration] = useState(12);
  const currentTier = calculateTier(duration, 25);
  const [maturityDate, setMaturityDate] = useState("");

  useEffect(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + duration);
    setMaturityDate(date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
  }, [duration]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="w-full max-w-5xl mx-auto space-y-12"
    >
      <div className="space-y-4">
         <div className="flex items-center gap-3 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full w-fit">
            <Clock size={12} className="text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Temporal Parameterization</span>
         </div>
         <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
            Define Vault <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary-dark">Horizon</span>
         </h1>
         <p className="text-slate-500 text-lg max-w-2xl font-light leading-relaxed">
            Specify the block-height duration for the cryptographic lock. Assets are immutable during the retention window to ensure baseline protocol rewards.
         </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Main Duration Selection */}
         <div className="lg:col-span-8 space-y-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {PRESETS.map((preset) => (
                 <button 
                   key={preset.value}
                   onClick={() => setDuration(preset.value)}
                   className={`flex flex-col items-start p-6 rounded-3xl border transition-all relative group overflow-hidden ${
                     duration === preset.value 
                       ? 'border-primary bg-primary/5 active-ring' 
                       : 'border-white/5 hover:border-white/10 bg-white/1'
                   }`}
                 >
                   {preset.preferred && (
                     <div className="absolute top-0 right-0 bg-primary text-background-dark text-[8px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                       Optimal
                     </div>
                   )}
                   <span className={`text-[9px] font-black mb-4 transition-colors uppercase tracking-[0.2em] ${
                     duration === preset.value ? 'text-primary' : 'text-slate-600'
                   }`}>
                     {preset.tier}
                   </span>
                   <span className="text-2xl font-black text-white tracking-tight">{preset.label}</span>
                   <div className="mt-4 space-y-1">
                      <p className={`text-[10px] font-bold ${duration === preset.value ? 'text-primary' : 'text-slate-500'}`}>
                        {preset.premium}
                      </p>
                      <p className="text-[10px] font-mono text-slate-700">{preset.blocks} Blocks</p>
                   </div>
                 </button>
               ))}
            </div>

            <div className="glass-panel p-10 rounded-[2.5rem] border-white/5 space-y-10 bg-white/2">
               <div className="flex justify-between items-end">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Precision Tuning</p>
                     <h3 className="text-2xl font-black text-white uppercase tracking-tight italic">Retention Window</h3>
                  </div>
                   <div className="text-right">
                      <span className="text-4xl md:text-6xl font-black text-white font-mono tracking-tighter">{duration}</span>
                      <span className="text-xl text-primary font-bold ml-2 uppercase tracking-tighter italic">mth</span>
                   </div>
               </div>
               
               <div className="relative pt-4 pb-8">
                  <input 
                    type="range"
                    min="1"
                    max="48"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between mt-6 text-[9px] font-black text-slate-700 uppercase tracking-widest">
                    <div className="flex flex-col items-center gap-1">
                       <span className="w-px h-1 bg-slate-800" />
                       1 Mth
                    </div>
                    <div className="flex flex-col items-center gap-1">
                       <span className="w-px h-1 bg-slate-800" />
                       12 Mth
                    </div>
                    <div className="flex flex-col items-center gap-1">
                       <span className="w-px h-1 bg-slate-800" />
                       24 Mth
                    </div>
                    <div className="flex flex-col items-center gap-1">
                       <span className="w-px h-1 bg-slate-800" />
                       48 Mth
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 rounded-3xl bg-white/1 border border-white/5 space-y-3">
                     <div className="flex items-center gap-2 text-slate-500">
                        <Database size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Stack Finality Height</span>
                     </div>
                     <p className="text-xl font-black text-white font-mono">+{duration * 4320} <span className="text-[10px] text-slate-400">BLOCKS</span></p>
                  </div>
                  <div className="p-6 rounded-3xl bg-white/1 border border-white/5 space-y-3">
                     <div className="flex items-center gap-2 text-slate-500">
                        <Globe size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Global Maturity</span>
                     </div>
                     <p className="text-xl font-black text-white italic tracking-tighter truncate">{maturityDate}</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Sidebar Stats / Info */}
         <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 bg-primary/2 space-y-8 h-full flex flex-col">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-primary/10 rounded-xl text-primary">
                        <BarChart3 size={18} />
                     </div>
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">Yield Simulation</span>
                  </div>
                  <div className="bg-background-dark/50 rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Estimated APY</p>
                     <p className="text-4xl font-black text-white font-mono tracking-tighter">
                        ~{(4.2 + (duration/12)*0.8).toFixed(1)}%
                     </p>
                  </div>
               </div>

               <div className="space-y-4">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Attributes</span>
                  <div className="space-y-3">
                     {[
                        { label: "Commitment Multiplier", val: "x" + (1 + (duration/48)).toFixed(2), icon: Layers },
                        { label: "Recovery Delta", val: "Deterministic", icon: Shield },
                        { label: "Yield Velocity", val: duration >= 12 ? "HIGH" : "STANDARD", icon: Zap },
                     ].map(item => (
                        <div key={item.label} className="flex items-center justify-between p-3 bg-white/2 rounded-xl border border-white/5">
                           <div className="flex items-center gap-3 text-slate-400">
                              <item.icon size={14} />
                              <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
                           </div>
                           <span className="text-[10px] font-black text-white uppercase">{item.val}</span>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="mt-auto pt-6 border-t border-white/5">
                  <p className="text-[9px] text-slate-600 leading-relaxed font-light uppercase tracking-widest italic">
                     Time-locking is a non-revocable contract action on the Stacks layer. Ensure the maturity window aligns with your protocol liquidity needs.
                  </p>
               </div>
            </div>
         </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-6 border-t border-white/5">
         <button 
           onClick={onPrev}
           className="text-xs font-black text-slate-600 hover:text-white transition-all uppercase tracking-[0.2em] italic"
         >
           [ RETREAT_FROM_INITIALIZATION ]
         </button>
         
         <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Step</span>
               <span className="text-[10px] font-black text-primary uppercase italic">01 // HORIZON_WINDOW_LOCK</span>
            </div>
            <button 
               onClick={() => {
                 onNext(duration);
               }}
               className="bg-primary hover:bg-white px-12 py-5 rounded-[1.5rem] text-background-dark font-black text-sm uppercase tracking-[0.2em] shadow-lg transition-all flex items-center gap-3 group"
            >
               PROCEED TO ALLOCATION
               <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
         </div>
      </div>
    </motion.div>
  );
}
