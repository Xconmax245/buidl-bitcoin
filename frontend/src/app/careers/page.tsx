import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Careers | Ironclad Protocol",
  description: "Join the Ironclad team and help build the future of programmable Bitcoin savings.",
};

const openings = [
  {
    title: "Senior Smart Contract Engineer",
    type: "Full-time · Remote",
    team: "Protocol",
    desc: "Design and implement Clarity smart contracts for the Ironclad savings protocol on Stacks.",
    tags: ["Clarity", "Stacks", "Bitcoin", "Smart Contracts"],
  },
  {
    title: "Full-Stack Developer",
    type: "Full-time · Remote",
    team: "Product",
    desc: "Build and maintain the Ironclad web application using Next.js, TypeScript, and Prisma.",
    tags: ["Next.js", "TypeScript", "React", "Prisma"],
  },
  {
    title: "Security Researcher",
    type: "Full-time · Remote",
    team: "Security",
    desc: "Audit smart contracts, perform penetration testing, and design security frameworks for the protocol.",
    tags: ["Security", "Auditing", "Cryptography"],
  },
  {
    title: "Developer Relations Engineer",
    type: "Full-time · Remote",
    team: "Community",
    desc: "Create developer documentation, tutorials, and engage with the Bitcoin/Stacks developer communities.",
    tags: ["Documentation", "Community", "Technical Writing"],
  },
  {
    title: "UI/UX Designer",
    type: "Contract · Remote",
    team: "Design",
    desc: "Design intuitive, premium interfaces for Bitcoin-native financial products.",
    tags: ["Figma", "UI Design", "Web3 UX"],
  },
];

export default function CareersPage() {
  return (
    <div className="bg-background-dark font-display text-white min-h-screen flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 bg-background-dark/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-primary-dark flex items-center justify-center text-background-dark font-bold">
              <span className="material-icons text-lg">shield</span>
            </div>
            <span className="font-tight font-bold text-base tracking-tight text-white uppercase">IRONCLAD</span>
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">← Back</Link>
        </div>
      </nav>

      <main className="grow pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium uppercase tracking-wider mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> We're Hiring
            </span>
            <h1 className="text-4xl sm:text-5xl font-tight font-bold text-white mb-6">Join the Ironclad Team</h1>
            <p className="text-lg text-gray-400 leading-relaxed max-w-3xl">
              We're building the future of programmable Bitcoin savings. Join a remote-first team of builders, researchers, and Bitcoin enthusiasts pushing the boundaries of decentralized finance.
            </p>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-primary/20 mb-12 bg-primary/5">
            <div className="flex items-start gap-4">
              <span className="material-icons text-primary text-3xl shrink-0">rocket_launch</span>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Why Ironclad?</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex items-center gap-2"><span className="text-primary">✓</span> Remote-first, async culture</li>
                  <li className="flex items-center gap-2"><span className="text-primary">✓</span> Competitive BTC-denominated compensation</li>
                  <li className="flex items-center gap-2"><span className="text-primary">✓</span> Work on cutting-edge Bitcoin technology</li>
                  <li className="flex items-center gap-2"><span className="text-primary">✓</span> Open-source contribution encouraged</li>
                  <li className="flex items-center gap-2"><span className="text-primary">✓</span> Flexible hours across all time zones</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-tight font-bold text-white mb-8 flex items-center gap-3">
            <span className="material-icons text-primary">work</span>
            Open Positions
          </h2>

          <div className="space-y-4 mb-16">
            {openings.map((job, i) => (
              <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-primary/20 transition-all group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500">{job.type}</span>
                      <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">{job.team}</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-3">{job.desc}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-bold text-gray-500 bg-white/5 px-2 py-1 rounded uppercase tracking-wider">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <a
                    href={`mailto:careers@ironcladvault.com?subject=Application: ${job.title}`}
                    className="shrink-0 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-primary hover:text-background-dark hover:border-primary text-white font-bold text-sm transition-all"
                  >
                    Apply →
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-white/5 text-center">
            <h3 className="text-xl font-bold text-white mb-3">Don't see your role?</h3>
            <p className="text-gray-400 text-sm mb-6">We're always looking for talented people. Send us your resume and tell us how you'd contribute.</p>
            <a
              href="mailto:careers@ironcladvault.com?subject=General Application"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-background-dark font-bold transition-all hover:bg-white"
            >
              <span className="material-icons text-lg">mail</span>
              Send Application
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
