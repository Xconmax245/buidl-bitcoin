"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Lock, ShieldCheck, ArrowLeft, TrendingUp, Info, Zap, Sparkles, Loader2, Key, Cpu, Terminal, Calendar } from "lucide-react";
import GlassSurface from "@/components/ui/GlassSurface";
import { calculateTier } from "@/lib/vault/tiers";
import { stacksService, sBTCInfo } from "@/lib/stacks/service";
import { generateVaultManifest, downloadManifest } from "@/lib/vault/manifest";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ConfirmStepProps {
  duration: number;
  penalty: number;
  onConfirm: (sponsored: boolean) => Promise<void>;
  onPrev: () => void;
  address: string | null;
}

export function ConfirmStep({ duration, penalty, onConfirm, onPrev, address }: ConfirmStepProps) {
  const currentTier = calculateTier(duration, penalty);
  const [isSealing, setIsSealing] = useState(false);
  const [sbtcStatus, setSbtcStatus] = useState<sBTCInfo | null>(null);
  const [isSponsored, setIsSponsored] = useState(false);

  useEffect(() => {
    const fetchTechState = async () => {
      const [sbtc, sponsored] = await Promise.all([
        stacksService.getSBTCInfo(),
        stacksService.checkSponsoredStatus()
      ]);
      setSbtcStatus(sbtc);
      setIsSponsored(sponsored);
    };
    fetchTechState();
  }, []);

  const handleConfirm = async () => {
    try {
      setIsSealing(true);
      await onConfirm(isSponsored);
      toast.success("Protocol execution successful!");
    } catch (err: any) {
      console.error("Consensus error:", err);
      toast.error(err.message || "Protocol rejection. Check signer status.");
    } finally {
      setIsSealing(false);
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="w-full max-w-4xl mx-auto space-y-12 pb-20"
    >
      <div className="text-center space-y-4">
         <div className="flex items-center gap-3 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full w-fit mx-auto">
            <Key size={12} className="text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Final Consensus Validation</span>
         </div>
         <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase italic">
            Broadcast <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary-dark">Protocol</span>
         </h1>
         <p className="text-slate-500 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Finalize the commitment seal. Once broadcast, the parameters will be cryptographically immutable on the Bitcoin and Stacks ledgers.
         </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* LEFT: Technical Manifest */}
         <div className="lg:col-span-7 space-y-6">
             <div className="relative group">
                <GlassSurface
                  className="p-6 md:p-10 border-white/5 bg-white/1"
                  borderRadius={40}
                  displace={0.3}
                  distortionScale={-180}
                  redOffset={0}
                  greenOffset={10}
                  blueOffset={20}
                  brightness={50}
                  opacity={0.93}
                  mixBlendMode="screen"
                >
               {/* Background effect - Muted */}
               <div className="absolute inset-0 bg-white/1 pointer-events-none" />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 bg-white/2 rounded-full blur-[60px]" />
               
               <div className="relative z-10 flex flex-col items-center gap-10">
                  <div className="relative">
                     <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-background-dark border border-white/10 flex items-center justify-center text-primary relative z-10 shadow-lg">
                        <Lock className={`w-10 h-10 md:w-14 md:h-14 ${isSealing ? 'animate-pulse' : ''}`} />
                     </div>
                     <div className="absolute inset-0 bg-primary/5 blur-xl scale-125 z-0 opacity-30" />
                  </div>

                  <div className="text-center space-y-4">
                     <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Execution Manifest</h3>
                      <div className="grid grid-cols-2 gap-4 w-full">
                         <div className="p-4 rounded-2xl bg-white/2 border border-white/5 space-y-1 min-w-0">
                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest truncate">DURATION</p>
                            <p className="text-lg md:text-xl font-black text-white font-mono truncate">{duration} MTH</p>
                         </div>
                         <div className="p-4 rounded-2xl bg-white/2 border border-white/5 space-y-1 min-w-0">
                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest truncate">PENALTY</p>
                            <p className="text-lg md:text-xl font-black text-primary font-mono truncate">{penalty}%</p>
                         </div>
                      </div>
                  </div>

               </div>
               </GlassSurface>
            </div>

            <div className="glass-panel p-8 rounded-4xl border-white/5 bg-white/2 flex items-center gap-6">
               <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <ShieldCheck size={24} />
               </div>
               <p className="text-[11px] text-slate-500 leading-relaxed font-light italic">
                  By executing the final consensus, you acknowledge that the protocol will programmatically enforce the stated parameters without secondary approval requirements.
               </p>
            </div>
         </div>

         {/* RIGHT: Tier & Final Actions */}
         <div className="lg:col-span-5 space-y-8">
            <div className="glass-panel p-6 md:p-10 rounded-4xl md:rounded-[3rem] border-white/5 bg-white/1 h-full flex flex-col">
               <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 bg-white/5 rounded-2xl text-primary">
                     <Cpu size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate">Final Protocol Rank</p>
                     <p className={`text-xl md:text-2xl font-black italic tracking-tighter uppercase truncate ${currentTier.color}`}>
                        {currentTier.label} // LVL {currentTier.level}
                     </p>
                  </div>
               </div>

               <div className="space-y-8 flex-1">
                   <div className="space-y-4">
                      <div className="flex items-center justify-between opacity-50">
                        <p className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                           <Sparkles size={12} className="text-primary" />
                           Protocol Privileges
                        </p>
                        <button 
                          onClick={() => {
                            const manifest = generateVaultManifest({ address, duration, penalty, targetAmount: 100000, tier: currentTier.label });
                            downloadManifest(manifest);
                            toast.info("Institutional manifest generated.");
                          }}
                          className="text-[9px] font-black text-primary hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1.5"
                        >
                          <Terminal size={10} />
                          [ Export_Manifest ]
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                          {currentTier.benefits.map((benefit, i) => (
                             <span key={i} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black text-slate-400 uppercase tracking-tight whitespace-nowrap">
                                {benefit}
                             </span>
                          ))}
                      </div>
                   </div>

                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 opacity-50">
                         <Cpu size={12} className="text-slate-500" />
                         Technical Context
                      </p>
                     <div className="grid grid-cols-1 gap-2">
                        {sbtcStatus && (
                          <div className="p-3 rounded-2xl bg-white/2 border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                               <span className="text-[9px] font-bold text-slate-400 uppercase">sBTC Peg State</span>
                            </div>
                            <span className="text-[9px] font-mono font-bold text-white">{sbtcStatus.supply} BTC Locked</span>
                          </div>
                        )}
                        <div className="p-3 rounded-2xl bg-white/2 border border-white/5 flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <Terminal size={12} className="text-slate-500" />
                              <span className="text-[9px] font-bold text-slate-400 uppercase">Post-Condition Mode</span>
                           </div>
                           <span className="text-[9px] font-mono font-bold text-primary">DENY_ALL</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/2 border border-white/5 flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <CheckCircle2 size={12} className="text-slate-500" />
                              <span className="text-[9px] font-bold text-slate-400 uppercase">Consensus Mode</span>
                           </div>
                           <span className="text-[9px] font-mono font-bold text-white">ANCHOR_ANY</span>
                        </div>
                         {isSponsored && (
                           <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between gap-2 overflow-hidden">
                             <div className="flex items-center gap-2 min-w-0 flex-1">
                                <Zap size={12} className="text-primary animate-pulse shrink-0" />
                                <span className="text-[9px] font-bold text-primary uppercase truncate">Fee Component</span>
                             </div>
                             <span className="text-[9px] font-bold text-primary italic underline underline-offset-4 decoration-primary/30 uppercase truncate shrink-0">Protocol Sponsored</span>
                           </div>
                         )}
                     </div>
                  </div>

                  <div className="space-y-4 pt-8 border-t border-white/5">
                     <div className="flex justify-between items-center group">
                        <div className="flex items-center gap-2">
                           <TrendingUp size={14} className="text-primary" />
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">Yield Projection</span>
                        </div>
                        <span className="text-2xl font-black text-white font-mono tracking-tighter">
                           ~{(4.2 + (duration/12)*0.8 + (currentTier.level * 0.5)).toFixed(1)}%
                        </span>
                     </div>
                     <div className="flex justify-between items-center group">
                        <div className="flex items-center gap-2">
                           <Calendar size={14} className="text-slate-500" />
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">Target Maturity</span>
                        </div>
                        <span className="text-xs font-black text-white uppercase italic">
                           {new Date(new Date().setMonth(new Date().getMonth() + duration)).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                     </div>
                  </div>
               </div>

                <button 
                  onClick={handleConfirm}
                  disabled={isSealing}
                  className="w-full mt-12 py-6 md:py-8 bg-primary hover:bg-white text-background-dark font-black text-lg md:text-xl uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-4xl shadow-lg transition-all flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
               >
                  {isSealing ? (
                     <Loader2 className="animate-spin" size={24} />
                  ) : (
                     <Key size={24} className="group-hover:rotate-12 transition-transform" />
                  )}
                  <span className="truncate">{isSealing ? "BROADCASTING..." : "SEAL_VAULT"}</span>
               </button>
            </div>
         </div>
      </div>

      <div className="flex items-center justify-start">
         <button 
           onClick={onPrev}
           className="flex items-center gap-3 text-xs font-black text-slate-600 hover:text-white transition-all uppercase tracking-[0.2em] italic group"
         >
           <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
           [ REOPEN_ALLOCATION_LEDGER ]
         </button>
      </div>
    </motion.div>
  );
}
