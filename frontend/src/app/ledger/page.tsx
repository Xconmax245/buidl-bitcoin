"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/providers/WalletProvider";
import { useContract } from "@/hooks/useContract";
import { useNotifications } from "@/providers/NotificationProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { NotificationsModal } from "@/components/notifications/NotificationsModal";
import { 
  RefreshCcw, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History as HistoryIcon, 
  Search,
  Zap,
  Activity,
  Filter,
  ShieldCheck,
  ChevronRight,
  Bell
} from "lucide-react";

import { useOnboarding } from "@/hooks/useOnboarding";
import { useSession } from "next-auth/react";

export default function LedgerPage() {
  const { address } = useWallet();
  const { network, isMainnet } = useContract();
  const { unreadCount, toggleOpen } = useNotifications();
  const { isLoading, isFullyOnboarded, redirectToOnboarding } = useOnboarding();
  const { data: session } = useSession();
  const isDemo = session?.user?.email === "demo@ironclad.finance";

  const [ledger, setLedger] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isLoading && isFullyOnboarded === false) {
      redirectToOnboarding();
    }
  }, [isLoading, isFullyOnboarded, redirectToOnboarding]);

  const fetchLedger = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`${network.client.baseUrl}/extended/v1/tx?limit=50`);
      const data = await response.json();
      
      if (data?.results) {
        const transformed = data.results.map((tx: any) => ({
          id: tx.tx_id,
          type: tx.tx_type === 'token_transfer' ? 'PEER_TRANSFER' : 
                tx.tx_type === 'contract_call' ? 'PROTOCOL_INTEGRATION' :
                tx.tx_type.toUpperCase().replace('_', ' '),
          amount: tx.token_transfer ? Number(tx.token_transfer.amount) / 1000000 : 0,
          status: tx.tx_status === 'success' ? 'CONFIRMED' : tx.tx_status.toUpperCase(),
          date: tx.burn_block_time_iso || new Date().toISOString(),
          hash: `${tx.tx_id.slice(0, 10)}...${tx.tx_id.slice(-8)}`,
          fullHash: tx.tx_id,
          token: tx.tx_type === 'token_transfer' ? 'STX' : 'GAS',
          sender: tx.sender_address,
          fee: Number(tx.fee_rate) / 1000000
        }));
        setLedger(transformed);
      }
    } catch (e) {
      console.error("Ledger fetch failed", e);
    }
    setIsRefreshing(false);
  }, [network]);

  useEffect(() => {
    fetchLedger();
  }, [fetchLedger]);

  if (isLoading || isFullyOnboarded === null) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const filteredLedger = ledger.filter(tx => 
    tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.sender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-background-dark font-display text-slate-200 min-h-screen flex overflow-hidden">
      <Sidebar />
      <NotificationsModal />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative pt-16 lg:pt-0">
        {/* Floating Mobile Notification Button */}
        <div className="lg:hidden fixed bottom-8 right-8 z-50">
           <button 
             onClick={toggleOpen}
             className="w-14 h-14 bg-primary rounded-full shadow-[0_0_20px_rgba(169,208,195,0.4)] flex items-center justify-center text-background-dark active:scale-90 transition-transform relative border-2 border-white/10"
           >
              <Bell size={24} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-background-dark flex items-center justify-center text-[10px] font-black text-white">
                   {unreadCount}
                </span>
              )}
           </button>
        </div>

        <header className="h-24 flex items-center justify-between px-6 lg:px-10 border-b border-white/5 bg-background-dark/40 backdrop-blur-xl z-10 sticky top-0">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                <HistoryIcon className="text-primary" size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Immutable Ledger</h1>
                <p className="text-[10px] text-muted-silver uppercase font-bold tracking-[0.2em] mt-0.5">Real-time Protocol Activity_</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-silver group-focus-within:text-primary transition-colors" size={16} />
                <input 
                  type="text"
                  placeholder="Filter by hash, type or sender..."
                  className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-6 text-xs font-bold text-white placeholder:text-muted-silver focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all min-w-[350px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <button 
               onClick={fetchLedger}
               disabled={isRefreshing}
               className={`p-2.5 glass-panel rounded-xl text-muted-silver hover:text-white transition-all ${isRefreshing ? 'animate-spin text-primary' : 'hover:scale-105 active:scale-95'}`}
             >
               <RefreshCcw size={20} />
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar scroll-smooth">
           <div className="max-w-7xl mx-auto space-y-8 pb-10">
              {/* breadcrumb */}
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-silver">
                 <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
                 <ChevronRight size={12} />
                 <span className="text-white">Extended Ledger</span>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 {[
                   { label: "Total Observed", val: ledger.length.toString(), icon: Activity, color: "text-primary" },
                   { label: "Confirmed_v1", val: ledger.filter(l => l.status === 'CONFIRMED').length.toString(), icon: ShieldCheck, color: "text-primary" },
                   { label: "Pending", val: ledger.filter(l => l.status !== 'CONFIRMED').length.toString(), icon: RefreshCcw, color: "text-muted-silver" },
                   { label: "Integrity Index", val: "Verified", icon: Zap, color: "text-primary" }
                 ].map(stat => (
                   <div key={stat.label} className="glass-panel p-6 rounded-4xl border-white/5 flex items-center gap-5 group hover:bg-white/2 transition-colors">
                      <div className={`p-4 bg-white/5 rounded-2xl border border-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                         <stat.icon size={22} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-muted-silver uppercase tracking-widest">{stat.label}</p>
                         <p className="text-2xl font-black text-white mt-1 tracking-tighter font-mono">{stat.val}</p>
                      </div>
                   </div>
                 ))}
              </div>

              {/* Transactions Table */}
              <div className="glass-panel rounded-[2.5rem] overflow-hidden border-white/5">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="border-b border-white/5 bg-white/2">
                             <th className="px-10 py-6 text-[11px] font-black text-muted-silver uppercase tracking-[0.2em]">Hash / Authentication</th>
                             <th className="px-10 py-6 text-[11px] font-black text-muted-silver uppercase tracking-[0.2em]">Protocol Intent</th>
                             <th className="px-10 py-6 text-[11px] font-black text-muted-silver uppercase tracking-[0.2em]">Asset Volume</th>
                             <th className="px-10 py-6 text-[11px] font-black text-muted-silver uppercase tracking-[0.2em]">L1 Status</th>
                             <th className="px-10 py-6 text-[11px] font-black text-muted-silver uppercase tracking-[0.2em]">Verification</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                          <AnimatePresence mode="popLayout">
                            {filteredLedger.map((tx, idx) => (
                               <motion.tr 
                                 initial={{ opacity: 0, x: -20 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 transition={{ delay: Math.min(idx * 0.015, 0.5) }}
                                 key={tx.id} 
                                 className="hover:bg-white/3 transition-colors group cursor-default"
                               >
                                  <td className="px-10 py-8">
                                     <div className="flex items-center gap-5">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all shadow-lg ${
                                          tx.type === 'PEER_TRANSFER' ? 'bg-primary/20 border-primary/30 text-primary shadow-primary/10' :
                                          tx.type === 'PROTOCOL_INTEGRATION' ? 'bg-white/10 border-white/20 text-white shadow-white/5' :
                                          'bg-white/5 border-white/10 text-muted-silver'
                                        }`}>
                                          {tx.type === 'PEER_TRANSFER' ? <ArrowDownLeft size={20} /> : 
                                           tx.type === 'PROTOCOL_INTEGRATION' ? <Zap size={20} /> : <Activity size={20} />}
                                        </div>
                                        <div>
                                           <div className="flex items-center gap-2">
                                              <p className="text-sm font-black text-white font-mono tracking-tight group-hover:text-primary transition-colors">{tx.hash}</p>
                                           </div>
                                           <div className="flex items-center gap-2 mt-1.5 grayscale group-hover:grayscale-0 transition-all opacity-40 group-hover:opacity-100">
                                               <span className="text-[10px] text-muted-silver font-black uppercase tracking-widest">Auth:</span>
                                               <span className="text-[10px] text-muted-silver font-mono">{tx.sender?.slice(0, 16) || "Protocol_Managed"}...</span>
                                            </div>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="px-10 py-8">
                                     <span className="text-[10px] font-black bg-white/5 px-4 py-2 rounded-xl text-white border border-white/10 uppercase tracking-widest group-hover:border-primary/40 transition-all whitespace-nowrap">
                                        {tx.type.replace('_', ' ')}
                                     </span>
                                  </td>
                                    <td className="px-10 py-8">
                                     <div>
                                        <p className={tx.amount > 0 ? "text-lg font-black text-primary font-mono tracking-tighter" : "text-lg font-black text-white font-mono tracking-tighter"}>
                                           {tx.amount > 0 ? `+${(tx.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 6 })}` : (tx.amount || 0).toFixed(6)}
                                           <span className="text-[10px] ml-2 font-black text-muted-silver uppercase">{tx.token}</span>
                                        </p>
                                        <div className="flex items-center gap-1.5 mt-1">
                                           <div className="w-1 h-1 rounded-full bg-muted-silver/30" />
                                           <p className="text-[10px] text-muted-silver/60 font-bold uppercase tracking-widest">Network Fee: {(tx.fee || 0).toFixed(6)} STX</p>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="px-10 py-8">
                                     <div className="flex items-center gap-3">
                                        <span className={`w-2 h-2 rounded-full ${tx.status === 'CONFIRMED' ? 'bg-primary shadow-[0_0_12px_rgba(169,208,195,0.7)]' : 'bg-muted-silver/30 animate-pulse'}`} />
                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${tx.status === 'CONFIRMED' ? 'text-primary' : 'text-muted-silver'}`}>
                                           {tx.status}
                                        </span>
                                     </div>
                                  </td>
                                  <td className="px-10 py-8">
                                     <a 
                                       href={`https://explorer.hiro.so/txid/${tx.id}?chain=${isMainnet ? 'mainnet' : 'testnet'}`}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/2 border border-white/10 text-[10px] font-black text-muted-silver uppercase tracking-widest hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all group/btn"
                                     >
                                        Inspect
                                        <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                     </a>
                                  </td>
                               </motion.tr>
                            ))}
                          </AnimatePresence>
                       </tbody>
                    </table>
                 </div>
                 
                 {filteredLedger.length === 0 && !isRefreshing && (
                    <div className="flex flex-col items-center justify-center py-40 space-y-8 text-center bg-white/1">
                       <div className="w-24 h-24 bg-white/5 rounded-4xl flex items-center justify-center border border-white/10 shadow-2xl relative">
                          <HistoryIcon size={40} className="text-muted-silver/20" />
                          <div className="absolute inset-0 border border-primary/20 rounded-4xl animate-pulse" />
                       </div>
                       <div className="space-y-2">
                          <p className="text-lg font-black text-white uppercase tracking-tight">Zero matching protocols found_</p>
                          <p className="text-xs text-muted-silver/60 max-w-sm mx-auto leading-relaxed uppercase font-bold tracking-widest">
                            No ledger entries match your current filter parameters. Verify authentication hash or clear search.
                          </p>
                       </div>
                       <button 
                         onClick={() => setSearchTerm("")}
                         className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-all"
                       >
                          Clear Authentication Filter
                       </button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
