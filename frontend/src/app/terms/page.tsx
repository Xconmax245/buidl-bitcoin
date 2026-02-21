import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Terms of Service | Ironclad Protocol",
  description: "Terms of Service for Ironclad Protocol - Programmable Bitcoin Savings.",
};

export default function TermsPage() {
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
          <h1 className="text-4xl font-tight font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-10">Last updated: February 2026</p>

          <div className="prose prose-invert max-w-none space-y-8">
            {[
              { title: "1. Acceptance of Terms", content: "By accessing or using the Ironclad Protocol (the \"Service\"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the Service. The Service is a decentralized application for managing Bitcoin-based savings commitments." },
              { title: "2. Service Description", content: "Ironclad Protocol is a non-custodial, programmable Bitcoin savings platform. The Service allows users to create, manage, and execute savings plans using Bitcoin and Stacks smart contracts. The Service does not hold, custody, or control any user funds at any time." },
              { title: "3. Non-Custodial Nature", content: "Ironclad is a non-custodial protocol. You are solely responsible for the security of your private keys, recovery phrases, and passwords. We do not have access to or control over your funds. Loss of your recovery phrase will result in permanent, irreversible loss of access to your Bitcoin." },
              { title: "4. User Responsibilities", content: "You are responsible for: (a) maintaining the security of your account credentials and recovery phrase, (b) ensuring compliance with applicable laws in your jurisdiction, (c) understanding the risks associated with cryptocurrency and smart contracts, (d) all activity that occurs under your account." },
              { title: "5. Risk Disclosure", content: "Cryptocurrency and smart contract interactions involve significant risk, including but not limited to: market volatility, smart contract bugs, regulatory changes, network congestion, and permanent loss of funds. Past performance does not guarantee future results. You should only commit funds you can afford to lose." },
              { title: "6. Intellectual Property", content: "The Ironclad Protocol is open-source software. The codebase is available under the applicable open-source license. The Ironclad brand, logo, and design are proprietary and may not be used without permission." },
              { title: "7. Limitation of Liability", content: "To the fullest extent permitted by law, Ironclad Protocol and its contributors shall not be liable for any indirect, incidental, consequential, or punitive damages arising from your use of the Service, including loss of funds, data, or business opportunities." },
              { title: "8. Modifications", content: "We reserve the right to modify these Terms at any time. Material changes will be communicated through the Service. Continued use of the Service after changes constitutes acceptance of the updated Terms." },
              { title: "9. Governing Law", content: "These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles. Any disputes shall be resolved through binding arbitration." },
              { title: "10. Contact", content: "For questions about these Terms, please contact us at legal@ironcladvault.com." },
            ].map((section, i) => (
              <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5">
                <h2 className="text-lg font-bold text-white mb-3">{section.title}</h2>
                <p className="text-gray-400 text-sm leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
