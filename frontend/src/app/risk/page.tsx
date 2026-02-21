import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Risk Disclosure | Ironclad Protocol",
  description: "Risk disclosure for using the Ironclad Protocol.",
};

export default function RiskPage() {
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
        <div className="max-w-3xl mx-auto">
          <div className="glass-panel p-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 mb-10 flex items-start gap-4">
            <span className="material-icons text-yellow-500 text-2xl shrink-0">warning</span>
            <div>
              <h3 className="text-lg font-bold text-yellow-400 mb-1">Important Notice</h3>
              <p className="text-yellow-400/80 text-sm">Please read this risk disclosure carefully before using the Ironclad Protocol. Cryptocurrency involves significant financial risk.</p>
            </div>
          </div>

          <h1 className="text-4xl font-tight font-bold text-white mb-2">Risk Disclosure</h1>
          <p className="text-sm text-gray-500 mb-10">Last updated: February 2026</p>

          <div className="space-y-6">
            {[
              { title: "Market Volatility", content: "Bitcoin and other cryptocurrencies are highly volatile. The value of your holdings can fluctuate dramatically in short periods. You may lose a significant portion or all of your investment.", icon: "trending_down" },
              { title: "Smart Contract Risk", content: "The Ironclad Protocol relies on smart contracts deployed on the Stacks blockchain. While these contracts are audited, bugs or vulnerabilities may exist that could result in loss of funds.", icon: "bug_report" },
              { title: "Key Management", content: "You are solely responsible for the security of your private keys and recovery phrases. If you lose your recovery phrase, your funds are permanently and irreversibly lost. Ironclad cannot recover your keys.", icon: "key" },
              { title: "Regulatory Risk", content: "The regulatory landscape for cryptocurrency is evolving. Changes in laws or regulations in your jurisdiction may affect your ability to use the Service or the value of your holdings.", icon: "gavel" },
              { title: "Network Risk", content: "Bitcoin and Stacks networks may experience congestion, delays, or outages that could affect transaction processing and fund accessibility.", icon: "cloud_off" },
              { title: "No Insurance", content: "Funds committed to the Ironclad Protocol are not insured by any government agency (e.g., FDIC). There is no safety net or bailout mechanism in case of loss.", icon: "shield" },
            ].map((risk, i) => (
              <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-icons text-primary">{risk.icon}</span>
                  <h2 className="text-lg font-bold text-white">{risk.title}</h2>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{risk.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
