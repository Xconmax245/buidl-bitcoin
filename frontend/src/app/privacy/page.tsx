import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Privacy Policy | Ironclad Protocol",
  description: "Privacy Policy for Ironclad Protocol - Your data, your control.",
};

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-tight font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-10">Last updated: February 2026</p>

          <div className="space-y-8">
            {[
              { title: "Data We Collect", content: "When you create an account, we collect your email address, username, and profile information. We store authentication tokens and session data. We do NOT collect or store private keys, recovery phrases, or wallet passwords — these remain exclusively on your device." },
              { title: "Local Storage", content: "Your Bitcoin wallet keys, encrypted mnemonics, and vault data are stored exclusively in your browser's local storage (IndexedDB). This data never leaves your device. We use AES-256-GCM encryption for all sensitive local data." },
              { title: "How We Use Data", content: "Account data is used solely for authentication, profile management, and protocol features (reputation, governance). We do not sell, rent, or share your personal data with third parties for marketing purposes." },
              { title: "Blockchain Data", content: "When you interact with smart contracts, your transactions are recorded on the Stacks and Bitcoin blockchains. This data is public by nature and not controlled by Ironclad. Your wallet addresses and transaction history are visible on-chain." },
              { title: "Cookies & Analytics", content: "We use essential cookies for session management. We may use privacy-respecting analytics to understand usage patterns. We do not use third-party advertising trackers." },
              { title: "Third-Party Services", content: "We may use the following third-party services: Google OAuth for authentication (subject to Google's Privacy Policy), Supabase for database hosting, Vercel for application hosting. Each service has its own privacy policy." },
              { title: "Data Retention", content: "Account data is retained as long as your account is active. You may request deletion of your account data at any time by contacting us. Local wallet data is managed entirely by you and can be deleted by clearing your browser data." },
              { title: "Security", content: "We implement industry-standard security measures including encryption at rest and in transit, rate limiting, and secure authentication protocols. However, no system is completely secure, and we cannot guarantee absolute security." },
              { title: "Your Rights", content: "You have the right to: access your personal data, request correction of inaccurate data, request deletion of your data, export your data, and withdraw consent for data processing." },
              { title: "Contact", content: "For privacy-related inquiries, please contact us at privacy@ironcladvault.com." },
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
