"use client";

import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, 
  Book, 
  Shield, 
  Code, 
  Terminal, 
  Search, 
  ChevronRight, 
  Network,
  Database,
  Lock,
  Zap,
  Cpu,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  FileText,
  Activity,
  UserCheck,
  AlertTriangle,
  FileSearch,
  CheckCircle2
} from "lucide-react";
import { useState, useMemo } from "react";

interface Topic {
  name: string;
  desc: string;
  details?: string;
  code?: string;
  status?: string;
}

interface Section {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  topics: Topic[];
}

const SECTIONS: Section[] = [
  {
    id: "fundamentals",
    title: "Protocol Fundamentals",
    subtitle: "Bitcoin-Native Sovereign Logic",
    icon: Rocket,
    topics: [
      { 
        name: "Clarity Smart Contracts", 
        desc: "Ironclad uses Clarity, a decidable language where the code you see is the code that executes. No hidden state, no re-entrancy bugs.",
        details: "Decidability allows for precise gas estimation and eliminates entire classes of smart contract vulnerabilities found in Turing-complete languages."
      },
      { 
        name: "Proof-of-Transfer (PoX)", 
        desc: "Our protocol inherits Bitcoin's security by anchoring every L2 block to a Bitcoin L1 transaction through the Stacks consensus.",
        details: "PoX enables sBTC and trustless commitments by rewarding Bitcoin stakers for securing the network."
      },
      { 
        name: "Non-Custodial Design", 
        desc: "All keys are encrypted locally with AES-GCM. We never see your seed phrase or private keys.",
        details: "Security first architecture ensures you maintain 100% control over your assets at all times."
      },
      {
        name: "Bitcoin L1 Finality",
        desc: "Ultimate finality. Funds held in multisig vaults secured by Bitcoin hashpower.",
        details: "Settlement occurs on the Bitcoin blockchain, providing the highest level of security for locked assets."
      }
    ]
  },
  {
    id: "api",
    title: "Smart Contract API",
    subtitle: "Programmable Value Settlement",
    icon: Code,
    topics: [
      { 
        name: "Vault Creation", 
        desc: "Programmatically initialize savings commitments with custom lock heights and penalty ratios.",
        code: `(contract-call? .ironclad-vault create-vault \n  (amount u10000000) \n  (lock-height u845000))`
      },
      { 
        name: "Reputation Oracle", 
        desc: "Query on-chain reputation data to determine fee discounts or protocol access levels.",
        code: `(get-reputation (tx-sender))`
      },
      { 
        name: "Slashing Logic", 
        desc: "Understand the mathematical enforcement of early-exit penalties.",
        code: `(calculate-penalty (current-block))`
      }
    ]
  },
  {
    id: "governance",
    title: "Governance Model",
    subtitle: "Reputation-Weighted Sovereignty",
    icon: Network,
    topics: [
      { 
        name: "Reputation-Weighted Voting", 
        desc: "Your voice in the protocol scales with your skin in the game. Long-term savers earn higher governance weight.",
        details: "Reputation accumulation and decaying mechanics ensure active participants have the most influence."
      },
      { 
        name: "Protocol Upgrades", 
        desc: "Major logic shifts require a 72-hour delay and a super-majority vote from reputation holders.",
        details: "SIP-010 compliance and upgrade paths focus on long-term stability."
      }
    ]
  },
  {
    id: "threat-modeling",
    title: "Threat Modeling",
    subtitle: "Active Mitigation Strategies",
    icon: ShieldAlert,
    topics: [
      {
        name: "Double Spend Mitigation",
        desc: "Transactions are only finalized after Bitcoin-level settlement confirmation via sBTC nodes.",
        status: "SECURE"
      },
      {
        name: "Contract Re-entrancy",
        desc: "Clarity language is non-Turing complete, eliminating entire classes of re-entrancy bugs.",
        status: "SECURE"
      },
      {
        name: "Seed Extraction",
        desc: "Mnemonic materials never leave your local environment; signed via Stacks/Xverse provider.",
        status: "USER-MANAGED"
      },
      {
        name: "Oracle Manipulation",
        desc: "Uses a decentralized set of oracles with reputation-weighted slashing for false reporting.",
        status: "HIGH-CONFIDENCE"
      }
    ]
  },
  {
    id: "security",
    title: "Security & Audits",
    subtitle: "Verified Protocol Integrity",
    icon: Shield,
    topics: [
      { 
        name: "MPC Coordination", 
        desc: "Institutional vaults use Multi-Party Computation to ensure no single point of failure during signing.",
        details: "The role of sBTC signers in protocol finality is critical for trustless bridging."
      },
      { 
        name: "Audit History", 
        desc: "View our latest audit reports from top-tier security firms.",
        details: "AUDIT REPORT 2024.pdf - Verified v1.4.2"
      },
      {
        name: "Deterministic Recovery",
        desc: "Losing your local profile does not endanger your assets. Every vault is derived deterministically from your root key.",
        details: "Use any BIP-39 compatible interface for emergency recovery."
      }
    ]
  }
];

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState("fundamentals");
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const handleAuditDownload = () => {
    alert('Security Manifest ironclad-v1.4.2-audit.pdf is being prepared for download.');
  };

  const handleVerifyContract = () => {
    window.open('https://explorer.hiro.so/address/SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.ironclad-vault?chain=mainnet', '_blank');
  };

  const filteredSections = useMemo(() => {
    return SECTIONS.filter(s => 
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.topics.some(t => t.name.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search]);

  const activeSection = useMemo(() => {
    return SECTIONS.find(s => s.id === activeTab) || SECTIONS[0];
  }, [activeTab]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
       el.scrollIntoView({ behavior: 'smooth' });
       setActiveTab(id);
    }
  };

  return (
    <div className="bg-background-dark font-display text-slate-200 min-h-screen lg:h-screen flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden selection:bg-primary selection:text-background-dark">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-h-screen lg:h-full relative overflow-y-auto lg:overflow-hidden">
        {/* Mobile Header / Search Overlay */}
        <header className="h-20 flex items-center justify-between px-6 md:px-10 border-b border-white/5 bg-background-dark/80 backdrop-blur-xl z-30 shrink-0">
          <div className="flex items-center gap-4">
             <div className="p-2 bg-primary/10 rounded-xl text-primary lg:hidden">
                <Book size={20} />
             </div>
             <h1 className="text-xl font-black text-white uppercase tracking-tighter">Protocol Docs</h1>
          </div>
          
          <div className="relative group flex-1 max-w-sm ml-4 lg:ml-8">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-silver group-focus-within:text-primary transition-colors" size={14} />
             <input 
               type="text"
               placeholder="Search specs..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-silver/30"
             />
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden lg:overflow-visible">
          {/* Detailed Navigation (Sidebar within Docs) */}
          <aside className="hidden lg:block w-72 border-r border-white/5 p-8 overflow-y-auto bg-background-dark/20 backdrop-blur-sm">
            <nav className="space-y-10">
               {SECTIONS.map(s => (
                 <div key={s.id} className="space-y-4">
                    <button 
                      onClick={() => scrollToSection(s.id)}
                      className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === s.id ? 'text-primary' : 'text-slate-500 hover:text-white'}`}
                    >
                       <s.icon size={16} />
                       {s.title}
                    </button>
                    <ul className="space-y-2.5 ml-7">
                       {s.topics.map(t => (
                         <li key={t.name}>
                            <button 
                              onClick={() => {
                                scrollToSection(s.id);
                                setSelectedTopic(t);
                              }}
                              className="text-[11px] font-bold text-slate-400 hover:text-primary transition-colors text-left"
                            >
                                {t.name}
                            </button>
                         </li>
                       ))}
                    </ul>
                 </div>
               ))}
            </nav>
            
            <div className="mt-12 pt-8 border-t border-white/5">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Quick Links</p>
                <div className="space-y-3">
                   <button 
                     onClick={handleAuditDownload}
                     className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-white transition-colors text-left w-full"
                   >
                      <FileText size={14} /> Audit Report 2024
                   </button>
                   <button 
                     onClick={handleVerifyContract}
                     className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-white transition-colors text-left w-full"
                   >
                      <Code size={14} /> Verify Contract
                   </button>
                   <button 
                     onClick={() => alert('Ironclad Vulnerability Disclosure Program (VDP) is hosted on Immunefi. Transitioning...')}
                     className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-white transition-colors text-left w-full"
                   >
                      <Shield size={14} /> Bug Bounty
                   </button>
                </div>
            </div>
          </aside>

          {/* Doc Content Area */}
          <div className="flex-1 overflow-y-auto px-6 py-10 md:p-12 lg:p-16 scroll-smooth bg-linear-to-b from-transparent to-background-dark/50">
            <div className="max-w-4xl mx-auto space-y-24">
               {filteredSections.map(section => (
                 <section key={section.id} id={section.id} className="space-y-10 scroll-mt-24">
                    <div className="flex items-center gap-5">
                       <div className="w-16 h-16 bg-primary/10 rounded-3xl text-primary border border-primary/20 shadow-lg shadow-primary/5 flex items-center justify-center">
                          <section.icon size={32} />
                       </div>
                       <div>
                          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic">{section.title}</h2>
                          <div className="flex items-center gap-2 mt-1">
                             <div className="h-0.5 w-8 bg-primary rounded-full" />
                             <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">{section.subtitle}</p>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {section.topics.map((topic, i) => (
                         <motion.div 
                           key={i} 
                           initial={{ opacity: 0, y: 10 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           viewport={{ once: true }}
                           onClick={() => setSelectedTopic(topic)}
                           className={`glass-panel p-8 rounded-[2.5rem] border-white/5 bg-white/1 space-y-5 hover:border-primary/30 transition-all cursor-pointer group relative overflow-hidden ${topic.code ? 'md:col-span-2' : ''}`}
                         >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/2 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/5 transition-colors" />
                            
                            <div className="flex justify-between items-start relative z-10">
                               <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                  {topic.name}
                               </h3>
                               {topic.status && (
                                  <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-tighter ${topic.status === 'SECURE' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                     {topic.status}
                                  </span>
                               )}
                            </div>
                            
                            <p className="text-sm text-slate-400 leading-relaxed font-light relative z-10">
                               {topic.desc}
                            </p>
                            
                            <div className="flex items-center justify-between pt-4 relative z-10">
                               <span className="text-[9px] font-black text-slate-500 group-hover:text-primary transition-colors uppercase tracking-[0.2em] flex items-center gap-2">
                                  Inspect Details <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                               </span>
                            </div>
                         </motion.div>
                       ))}
                    </div>
                 </section>
               ))}

               {/* Security Log Section */}
               <section id="security-log" className="space-y-8">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-red-500/10 rounded-3xl text-red-500 border border-red-500/20 shadow-lg shadow-red-500/5 flex items-center justify-center">
                       <Activity size={32} />
                    </div>
                    <div>
                       <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Security Log_</h2>
                       <p className="text-[10px] text-red-500 font-black uppercase tracking-[0.2em] mt-1">LAST_RUN: 2024.02.17.1355</p>
                    </div>
                  </div>
                  
                  <div className="glass-panel p-0 rounded-[2.5rem] border-white/5 bg-white/1 overflow-hidden">
                     <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/5">
                           <tr>
                              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Incident/Check</th>
                              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Class</th>
                              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Status</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                           {[
                              { id: "FIND-01", name: "Integer Overflow in Reward Calc", class: "Logic", status: "Fixed", color: "text-green-400" },
                              { id: "FIND-02", name: "Redundant Map Lookups", class: "Gas", status: "Optimized", color: "text-primary" },
                              { id: "FIND-03", name: "Seed Phrase UI Guidance", class: "UX", status: "Mitigated", color: "text-slate-400" },
                           ].map(log => (
                              <tr key={log.id} className="hover:bg-white/2 transition-colors">
                                 <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                       <span className="text-[10px] font-black text-slate-600 font-mono">{log.id}</span>
                                       <span className="text-xs font-bold text-white">{log.name}</span>
                                    </div>
                                 </td>
                                 <td className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase">{log.class}</td>
                                 <td className={`px-8 py-5 text-[10px] font-black uppercase text-right ${log.color}`}>{log.status}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </section>

               {/* Developer Hub CTA */}
               <div className="glass-panel p-10 md:p-16 rounded-[3rem] border-primary/20 bg-linear-to-br from-primary/5 via-transparent to-transparent text-center space-y-8 mb-12">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20 shadow-2xl shadow-primary/10">
                     <Cpu size={40} className="text-primary" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Protocol Developer Hub</h3>
                    <p className="text-base text-slate-400 max-w-xl mx-auto font-light leading-relaxed">
                      Scale the sovereign economy. Build high-assurance apps on the Ironclad settlement layer using decentralized primitives.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4">
                     <button className="px-10 py-4 bg-primary text-background-dark font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-white transition-all shadow-xl shadow-primary/10 active:scale-95">
                        Join Beta Access
                     </button>
                     <button className="px-10 py-4 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all active:scale-95">
                        GitHub Source
                     </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Detail Overlay (Pseudo-Pages) */}
      <AnimatePresence>
         {selectedTopic && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 bg-background-dark/95 backdrop-blur-2xl flex items-center justify-center p-6"
           >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-2xl glass-panel p-8 md:p-12 rounded-[3.5rem] border-white/10 bg-white/1 relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                 
                 <button 
                   onClick={() => setSelectedTopic(null)}
                   className="absolute top-8 right-8 p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                 >
                    <ArrowLeft size={20} />
                 </button>

                 <div className="space-y-8 relative z-10">
                    <div className="space-y-2">
                       <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Technical Specification_</span>
                       <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">{selectedTopic.name}</h2>
                    </div>

                    <div className="space-y-6">
                       <p className="text-lg text-slate-300 font-light leading-relaxed italic">
                          "{selectedTopic.desc}"
                       </p>
                       
                       {selectedTopic.details && (
                          <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-3">
                             <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <FileSearch size={14} className="text-primary" /> Implementation Details
                             </div>
                             <p className="text-sm text-slate-400 leading-relaxed font-light">
                                {selectedTopic.details}
                             </p>
                          </div>
                       )}

                       {selectedTopic.code && (
                          <div className="space-y-3">
                             <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <Code size={14} className="text-primary" /> Clarity_Execution_Snippet
                             </div>
                             <div className="p-6 bg-black/60 rounded-3xl border border-white/10 font-mono text-xs text-primary/90 relative group">
                                <pre className="overflow-x-auto">{selectedTopic.code}</pre>
                                <button className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10 rounded-lg text-primary">
                                   <Terminal size={14} />
                                </button>
                             </div>
                          </div>
                       )}

                       {selectedTopic.status && (
                          <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/20">
                             <CheckCircle2 size={24} className="text-primary" />
                             <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Security Status</p>
                                <p className="text-sm font-black text-white uppercase tracking-[0.1em]">{selectedTopic.status}</p>
                             </div>
                          </div>
                       )}
                    </div>

                    <div className="pt-8 border-t border-white/5 flex gap-4">
                       <button className="flex-1 py-4 bg-primary text-background-dark font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2">
                          View Recovery Guide <ExternalLink size={14} />
                       </button>
                       <button 
                         onClick={() => setSelectedTopic(null)}
                         className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
                       >
                          Close Detail
                       </button>
                    </div>
                 </div>
              </motion.div>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
