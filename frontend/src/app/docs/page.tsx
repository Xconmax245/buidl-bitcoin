"use client";

import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { motion } from "framer-motion";
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
  ArrowRight
} from "lucide-react";
import { useState } from "react";

interface Topic {
  name: string;
  desc: string;
  details?: string;
  code?: string;
}

interface Section {
  id: string;
  title: string;
  icon: any;
  topics: Topic[];
}

const SECTIONS: Section[] = [
  {
    id: "fundamentals",
    title: "Protocol Fundamentals",
    icon: Rocket,
    topics: [
      { 
        name: "Clarity Smart Contracts", 
        desc: "Ironclad uses Clarity, a decidable language where the code you see is the code that executes. No hidden state, no re-entrancy bugs.",
        details: "Learn why decidability is critical for high-stakes Bitcoin savings."
      },
      { 
        name: "Proof-of-Transfer (PoX)", 
        desc: "Our protocol inherits Bitcoin's security by anchoring every L2 block to a Bitcoin L1 transaction through the Stacks consensus.",
        details: "How PoX enables sBTC and trustless commitments."
      },
      { 
        name: "Non-Custodial Design", 
        desc: "All keys are encrypted locally with AES-GCM. We never see your seed phrase or private keys.",
        details: "Security first architecture and encryption standards."
      }
    ]
  },
  {
    id: "api",
    title: "Smart Contract API",
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
        name: "slashing-logic", 
        desc: "Understand the mathematical enforcement of early-exit penalties.",
        code: `(calculate-penalty (current-block))`
      }
    ]
  },
  {
    id: "governance",
    title: "Governance Model",
    icon: Network,
    topics: [
      { 
        name: "Reputation-Weighted Voting", 
        desc: "Your voice in the protocol scales with your skin in the game. Long-term savers earn higher governance weight.",
        details: "Reputation accumulation and decaying mechanics."
      },
      { 
        name: "Protocol Upgrades", 
        desc: "Major logic shifts require a 72-hour delay and a super-majority vote from reputation holders.",
        details: "SIP-010 compliance and upgrade paths."
      }
    ]
  },
  {
    id: "security",
    title: "Security & Audits",
    icon: Shield,
    topics: [
      { 
        name: "MPC Coordination", 
        desc: "Institutional vaults use Multi-Party Computation to ensure no single point of failure during signing.",
        details: "The role of sBTC signers in protocol finality."
      },
      { 
        name: "Audit History", 
        desc: "View our latest audit reports from top-tier security firms like Least Authority and NCC Group.",
        details: "Formal verification and bug-bounty programs."
      }
    ]
  }
];

export default function DocsPage() {
  const [activeId, setActiveId] = useState("fundamentals");
  const [search, setSearch] = useState("");

  const filteredSections = SECTIONS.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.topics.some(t => t.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-background-dark font-display text-slate-200 min-h-screen flex overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-6 md:px-10 border-b border-white/5 bg-background-dark/80 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
             <div className="p-2 bg-primary/10 rounded-xl text-primary md:hidden">
                <Book size={20} />
             </div>
             <h1 className="text-xl font-black text-white uppercase tracking-tighter">Documentation</h1>
          </div>
          
          <div className="relative group flex-1 max-w-sm ml-4 hidden md:block">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-silver group-focus-within:text-primary transition-colors" size={14} />
             <input 
               type="text"
               placeholder="Search technical specs..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
             />
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Navigation Sidebar (Desktop) */}
          <aside className="hidden lg:block w-72 border-r border-white/5 p-6 overflow-y-auto">
            <nav className="space-y-8">
               {SECTIONS.map(s => (
                 <div key={s.id} className="space-y-3">
                    <button 
                      onClick={() => setActiveId(s.id)}
                      className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeId === s.id ? 'text-primary' : 'text-slate-500 hover:text-white'}`}
                    >
                       <s.icon size={14} />
                       {s.title}
                    </button>
                    <ul className="space-y-2 ml-7">
                       {s.topics.map(t => (
                         <li key={t.name}>
                            <button className="text-[11px] text-slate-400 hover:text-primary transition-colors text-left">{t.name}</button>
                         </li>
                       ))}
                    </ul>
                 </div>
               ))}
            </nav>
          </aside>

          {/* Doc Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 scroll-smooth">
            <div className="max-w-4xl mx-auto space-y-16 pb-20">
               {filteredSections.map(section => (
                 <section key={section.id} id={section.id} className="space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-primary/10 rounded-[2rem] text-primary border border-primary/20 shadow-lg shadow-primary/5">
                          <section.icon size={32} />
                       </div>
                       <div>
                          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">{section.title}</h2>
                          <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mt-1">Sovereign_Logic_Manifest</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {section.topics.map((topic, i) => (
                         <div key={i} className={`glass-panel p-8 rounded-4xl border-white/5 bg-white/1 space-y-4 hover:border-primary/20 transition-all ${topic.code ? 'md:col-span-2' : ''}`}>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                               {topic.name}
                            </h3>
                            <p className="text-sm text-slate-400 leading-relaxed font-light">{topic.desc}</p>
                            
                            {topic.details && (
                               <p className="text-[11px] text-slate-500 italic mt-2">
                                  {topic.details}
                               </p>
                            )}

                            {topic.code && (
                               <div className="mt-4 p-4 bg-black/40 rounded-2xl border border-white/5 font-mono text-[11px] text-primary/80 relative overflow-hidden group">
                                  <div className="absolute top-0 right-0 p-2 text-[8px] font-black text-slate-600 uppercase">Clarity_Execution</div>
                                  <pre className="overflow-x-auto">{topic.code}</pre>
                                  <div className="absolute bottom-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <Terminal size={14} className="text-slate-700" />
                                  </div>
                               </div>
                            )}

                            <div className="pt-4 flex items-center justify-between">
                               <button className="text-[9px] font-black text-slate-500 hover:text-primary transition-colors uppercase tracking-[0.2em] flex items-center gap-2">
                                  Learn More <ArrowRight size={12} />
                               </button>
                            </div>
                         </div>
                       ))}
                    </div>
                 </section>
               ))}

               {/* Developer Hub CTA */}
               <div className="glass-panel p-10 rounded-[2.5rem] border-primary/20 bg-linear-to-br from-primary/5 to-transparent text-center space-y-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20">
                     <Cpu size={32} className="text-primary" />
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Protocol Developer Hub</h3>
                  <p className="text-sm text-slate-400 max-w-xl mx-auto font-light">
                    Build sovereign applications on top of the Ironclad Protocol. Access SDKs, playground environments, and formal verification tools.
                  </p>
                  <div className="flex justify-center gap-4">
                     <button className="px-8 py-3 bg-primary text-background-dark font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-xl shadow-primary/10">
                        Join Beta Program
                     </button>
                     <button className="px-8 py-3 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all">
                        GitHub Repo
                     </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
