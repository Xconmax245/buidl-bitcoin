import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "About | Ironclad Protocol",
  description: "Learn about the Ironclad Protocol team and our mission to build programmable Bitcoin savings.",
};

export default function AboutPage() {
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
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Our Mission
            </span>
            <h1 className="text-4xl sm:text-5xl font-tight font-bold text-white mb-6">About Ironclad</h1>
            <p className="text-lg text-gray-400 leading-relaxed max-w-3xl">
              Ironclad Protocol is a programmable Bitcoin savings platform that enables trustless, rule-based BTC commitments secured by Bitcoin finality. We believe in building generational wealth without custodial risk.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-16">
            {[
              { title: "Non-Custodial", desc: "Your keys, your Bitcoin. We never have access to your funds. All wallet operations happen locally on your device.", icon: "vpn_key" },
              { title: "Bitcoin-Native", desc: "Built on Bitcoin and secured by its finality. Smart contracts on Stacks bring programmability while inheriting Bitcoin's security.", icon: "currency_bitcoin" },
              { title: "Open Source", desc: "Our entire codebase is open-source and auditable. Transparency is a core principle of everything we build.", icon: "code" },
              { title: "Community-Driven", desc: "Governed by its users through on-chain reputation and voting. Protocol changes require community consensus.", icon: "groups" },
            ].map((item, i) => (
              <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-primary/20 transition-colors">
                <span className="material-icons text-primary text-2xl mb-4 block">{item.icon}</span>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="glass-panel p-8 sm:p-10 rounded-2xl border border-white/5 mb-16">
            <h2 className="text-2xl font-tight font-bold text-white mb-6">Our Vision</h2>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>We envision a world where saving Bitcoin is as programmatic and disciplined as institutional-grade finance, but accessible to everyone. The Ironclad Protocol removes intermediaries and replaces trust with code.</p>
              <p>By combining Bitcoin's unparalleled security with Stacks smart contracts, we enable savings plans with built-in penalties for early withdrawal, automated verification, and community-governed parameters — all without ever taking custody of your funds.</p>
              <p>Our goal is to make Bitcoin savings a first-class financial primitive that anyone can use, regardless of their technical background.</p>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-tight font-bold text-white mb-4">Join the Protocol</h2>
            <p className="text-gray-400 mb-8">Start building your Bitcoin savings today.</p>
            <Link href="/onboarding" className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-background-dark font-bold transition-all hover:bg-white">
              Open App
              <span className="material-icons text-lg">arrow_forward</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
