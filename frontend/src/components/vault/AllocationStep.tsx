"use client";

import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, ArrowRight, ShieldCheck, Zap, Fingerprint, Database, Activity } from "lucide-react";
import { calculateTier } from "@/lib/vault/tiers";
import { useEffect, useState } from "react";

interface AllocationStepProps {
  duration: number;
  onNext: (penalty: number, amount: number, asset: string) => void;
  onPrev: () => void;
  address: string | null;
}

export function AllocationStep({ duration, onNext, onPrev, address }: AllocationStepProps) {
  const [penalty, setPenalty] = useState(25);
  const [amount, setAmount] = useState(100000); // 0.001 BTC default
  const [selectedAsset, setSelectedAsset] = useState('sBTC');
  const [prices, setPrices] = useState<Record<string, number>>({ 'sBTC': 64000, 'STX': 1.8, 'Bitflow': 0.5, 'USDCx': 1 });
  
  const assets = [
    { id: 'sBTC', name: 'Ironclad BTC', principal: 'ST2QTHF5ANDT876XA3T0V032S1QWE9AGCN76PFFWM.sbtc-token', unit: 'satoshi', factor: 100000000, symbol: 'BTC', geckoId: 'bitcoin' },
    { id: 'STX', name: 'Stacks Native', principal: 'STX', unit: 'microstx', factor: 1000000, symbol: 'STX', geckoId: 'blockstack' },
    { id: 'Bitflow', name: 'Bitflow Yield', principal: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.bitflow-token', unit: 'share', factor: 1000000, symbol: 'BF', geckoId: 'stxeur' }, // Placeholder gecko
    { id: 'USDCx', name: 'USDC (Cross-chain)', principal: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdc-token', unit: 'cent', factor: 1000000, symbol: 'USDC', geckoId: 'usd-coin' },
  ];

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const ids = assets.map(a => a.geckoId).join(',');
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
        const data = await res.json();
        const newPrices: Record<string, number> = { ...prices };
        assets.forEach(a => {
          if (data[a.geckoId]?.usd) newPrices[a.id] = data[a.geckoId].usd;
        });
        setPrices(newPrices);
      } catch (e) {
        console.warn("Price fetch failed, using fallbacks");
      }
    };
    fetchPrices();
  }, []);

  const asset = assets.find(a => a.id === selectedAsset) || assets[0];
  const currentTier = calculateTier(duration, penalty);
  const principalVal = amount / asset.factor;
  const usdVal = principalVal * prices[asset.id];
  const projectedLossVal = ((penalty / 100) * principalVal).toFixed(asset.factor === 100000000 ? 8 : 4);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPenalty(Number(e.target.value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(100, Math.max(0, Number(e.target.value) || 0));
    setPenalty(val);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="w-full max-w-6xl mx-auto space-y-12"
    >
      <div className="space-y-4">
         <div className="flex items-center gap-3 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full w-fit">
            <Zap size={12} className="text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Parameter Severity Control</span>
         </div>
         <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase italic">
            Allocation & <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary-dark">Severity</span>
         </h1>
         <p className="text-muted-silver text-lg max-w-2xl font-light leading-relaxed">
            Configure the commitment volume and termination penalty. These variables define your <span className="text-white font-medium">Protocol Authority Level</span>.
         </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 space-y-8">
            <div className="glass-panel p-6 md:p-10 lg:p-12 rounded-4xl md:rounded-4xl border-white/5 bg-white/1 relative overflow-hidden">

               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <label className="text-[9px] md:text-[10px] font-black text-muted-silver uppercase tracking-widest flex items-center gap-2 truncate">
                           <Database size={10} className="shrink-0" />
                           Asset Selection
                        </label>
                        <div className="flex flex-wrap gap-2">
                           {assets.map((a) => (
                              <button
                                 key={a.id}
                                 onClick={() => setSelectedAsset(a.id)}
                                 className={`px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${
                                    selectedAsset === a.id 
                                       ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/10' 
                                       : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'
                                 }`}
                                 title={a.name}
                              >
                                 {a.id}
                              </button>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="text-[9px] md:text-[10px] font-black text-muted-silver uppercase tracking-widest flex items-center gap-2 truncate" title={`Target Commitment (${asset.unit.toUpperCase()})`}>
                           <Database size={10} className="shrink-0" />
                           Commitment ({asset.unit.toUpperCase()})
                        </label>
                        <div className="relative group overflow-hidden">
                           <input
                              className="w-full bg-background-dark/30 p-4 md:p-6 lg:p-8 pr-16 md:pr-24 lg:pr-32 rounded-2xl text-lg md:text-2xl lg:text-3xl font-black text-white border border-white/5 focus:border-primary outline-none transition-all font-mono"
                              type="number"
                              value={amount}
                              onChange={(e) => setAmount(Number(e.target.value))}
                           />
                           <div className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 flex flex-col items-end pointer-events-none min-w-0">
                              <span className="text-[8px] md:text-[10px] font-black text-primary uppercase italic truncate max-w-[60px] md:max-w-none">{asset.unit}</span>
                              <span className="text-[7px] md:text-[9px] text-muted-silver font-mono truncate max-w-[80px] md:max-w-none">
                                ≈ {principalVal.toFixed(asset.factor === 100000000 ? 6 : 2)} {asset.symbol} 
                                <span className="ml-1 opacity-50">(${usdVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</span>
                              </span>
                           </div>
                        </div>
                     </div>

                      <div className="p-4 md:p-5 rounded-2xl bg-primary/5 border border-primary/10 space-y-2.5 overflow-hidden group/notice relative">
                         <div className="flex items-center gap-2 text-primary">
                            <AlertCircle size={12} className="shrink-0" />
                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.15em] truncate">Atomic Commitment Protocol</span>
                         </div>
                         <p className="text-[9px] md:text-[10px] text-primary/60 leading-tight font-light italic">
                            All assets in this vault share a single temporal horizon. Secondary commitments require plan completion.
                         </p>
                         <div className="absolute top-2 right-4 text-[7px] font-black text-primary/30 uppercase tracking-widest hidden group-hover/notice:block">
                            [ Single_Plan_Model ]
                         </div>
                      </div>
                  </div>

                  <div className="space-y-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-muted-silver uppercase tracking-widest flex items-center gap-2">
                           <Activity size={12} />
                           Penalty Scale (%)
                        </label>
                        <div className="bg-background-dark/30 p-4 md:p-8 rounded-3xl border border-white/5 flex flex-col items-center justify-center relative overflow-hidden h-28 md:h-40">
                           <input
                              className="bg-transparent text-center text-3xl md:text-6xl font-black text-white outline-none w-full transition-all tracking-tighter font-mono"
                              type="number"
                              value={penalty}
                              onChange={handleInputChange}
                           />
                           <span className="text-[8px] md:text-xs font-black text-primary uppercase italic tracking-widest mt-0.5 truncate max-w-full">Protocol_Slash</span>
                        </div>
                     </div>

                     <div className="px-4">
                        <input
                           className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
                           max={100}
                           min={0}
                           type="range"
                           value={penalty}
                           onChange={handleSliderChange}
                        />
                        <div className="flex justify-between mt-6 text-[9px] font-black text-muted-silver uppercase tracking-widest">
                           <span className={penalty < 20 ? 'text-green-500' : ''}>CONSERVATIVE</span>
                           <span className={penalty >= 20 && penalty < 70 ? 'text-primary' : ''}>STANDARD</span>
                           <span className={penalty >= 70 ? 'text-red-500' : ''}>MAXIMUS</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="glass-panel p-6 md:p-8 rounded-4xl md:rounded-4xl border-white/5 bg-white/1 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
               <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 border border-white/5">
                     <Fingerprint size={28} />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate">Derived Vault Multi-sig</p>
                     <code className="text-[10px] md:text-xs font-mono text-white opacity-80 uppercase truncate block">
                        {address ? `${address.slice(0, 10)}...${address.slice(-6)}` : 'GENERATING_VAULT_ADDRESS'}
                     </code>
                  </div>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-green-500/5 rounded-xl border border-green-500/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Ready</span>
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 space-y-6 text-slate-200">
            <div className="glass-panel p-6 md:p-10 rounded-4xl md:rounded-4xl border-white/5 bg-white/1 space-y-10 flex flex-col h-full">
               <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Commitment Manifest</p>
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">Final Parameters</h3>
               </div>

               <div className="space-y-6 flex-1">
                   <div className="space-y-4 pt-6 border-t border-white/5">
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-bold uppercase tracking-widest">Principal ({asset.symbol})</span>
                        <span className="text-white font-mono">{principalVal.toFixed(asset.factor === 100000000 ? 8 : 4)}</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-bold uppercase tracking-widest">Lock Span</span>
                        <span className="text-white font-mono">{duration} Mo.</span>
                     </div>
                  </div>

                   <div className="p-6 rounded-3xl bg-background-dark/40 border border-white/5 space-y-4">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Est. Termination Penalty</p>
                     <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-black text-red-500 font-mono tracking-tighter italic">-{projectedLossVal}</p>
                        <span className="text-xs font-bold text-red-500/50 uppercase tracking-widest">{asset.symbol}</span>
                     </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-white/2 border border-white/5 space-y-4">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Standing</p>
                     <p className={`text-xl font-black italic tracking-tighter uppercase ${currentTier.color}`}>
                        {currentTier.label} // LVL {currentTier.level}
                     </p>
                  </div>
               </div>

               <button 
                  onClick={() => onNext(penalty, amount, asset.principal)}
                  className="w-full py-6 bg-amber-600 hover:bg-white text-background-dark font-black text-sm uppercase tracking-widest rounded-3xl shadow-lg transition-all flex items-center justify-center gap-3 group"
               >
                  VERIFY PROTOCOL
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
         </div>
      </div>

      <div className="flex items-center justify-start pt-8">
         <button 
           onClick={onPrev}
           className="flex items-center gap-3 text-xs font-black text-slate-600 hover:text-white transition-all uppercase tracking-[0.2em] italic group"
         >
           <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
           [ RECALIBRATE_TEMPORAL_WINDOW ]
         </button>
      </div>
    </motion.div>
  );
}
