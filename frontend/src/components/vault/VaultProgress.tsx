"use client";

import { Check, Shield, Cpu, Lock } from "lucide-react";
import { motion } from "framer-motion";

interface VaultProgressProps {
  step: number;
  onAbort?: () => void;
}

const STEPS = [
  { id: 1, label: "Horizon", desc: "Lock Duration", icon: Cpu },
  { id: 2, label: "Allocation", desc: "Severity Scale", icon: Shield },
  { id: 3, label: "Consensus", desc: "Final Seal", icon: Lock }
];

export function VaultProgress({ step, onAbort }: VaultProgressProps) {
  return (
    <header className="w-full pt-16 lg:pt-12 pb-6 px-4 lg:px-8 flex flex-col items-center bg-background-dark/40 backdrop-blur-md border-b border-white/5 sticky top-0 z-30">
      <div className="max-w-5xl w-full flex justify-between items-center mb-8">
        <div className="hidden lg:flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
            <Shield className="text-primary" size={24} />
          </div>
          <div>
            <span className="font-tight text-white tracking-[0.2em] text-xs uppercase font-black block">Ironclad Protocol</span>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Setup_Session::0x842</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6 md:gap-12 relative">
          {/* Connecting line background */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-1/2 z-0 hidden sm:block" />
          
          {STEPS.map((s) => (
            <div key={s.id} className="flex items-center gap-4 relative z-10 group">
              <div 
                className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all duration-700 ${
                  s.id < step 
                    ? 'bg-primary border-primary text-background-dark scale-90' 
                    : s.id === step 
                      ? 'bg-white/5 border-primary text-primary scale-110' 
                      : 'bg-white/2 border-white/10 text-slate-600 grayscale'
                }`}
              >
                {s.id < step ? (
                  <Check size={18} strokeWidth={3} />
                ) : (
                  <s.icon size={18} className={s.id === step ? 'animate-pulse' : ''} />
                )}
              </div>
              <div className="hidden md:flex flex-col">
                <span className={`text-[10px] uppercase tracking-[0.2em] font-black transition-colors ${
                  s.id === step ? 'text-primary' : 'text-slate-600'
                }`}>
                  {s.label}
                </span>
                <span className="text-[8px] text-slate-700 font-mono uppercase tracking-widest mt-0.5">
                  {s.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="hidden md:block">
          <button 
            onClick={onAbort}
            className="px-5 py-2.5 rounded-xl text-[10px] font-black text-slate-500 hover:text-white border border-white/5 hover:border-white/10 transition-all uppercase tracking-widest bg-white/2"
          >
            Abort Protocol
          </button>
        </div>
      </div>
      
      {/* High-Fidelity Progress Indicator */}
      <div className="max-w-5xl w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(step / 3) * 100}%` }}
          transition={{ duration: 1, ease: "circOut" }}
          className="h-full bg-primary/40" 
        />
        {/* Progress indicator point - Muted */}
        <motion.div 
          animate={{ left: `${(step / 3) * 100}%` }}
          transition={{ duration: 1, ease: "circOut" }}
          className="absolute top-1/2 -translate-y-1/2 -ml-1 w-2 h-2 bg-white rounded-full z-10"
        />
      </div>
    </header>
  );
}
