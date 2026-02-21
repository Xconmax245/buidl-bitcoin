import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Contact | Ironclad Protocol",
  description: "Get in touch with the Ironclad Protocol team.",
};

export default function ContactPage() {
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
          <h1 className="text-4xl sm:text-5xl font-tight font-bold text-white mb-4">Contact Us</h1>
          <p className="text-lg text-gray-400 mb-12">Have questions? We'd love to hear from you.</p>

          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {[
              { title: "General Inquiries", email: "hello@ironcladvault.com", desc: "Questions about the protocol, partnerships, or general feedback.", icon: "mail" },
              { title: "Technical Support", email: "support@ironcladvault.com", desc: "Help with wallet issues, vault problems, or bug reports.", icon: "support_agent" },
              { title: "Security Issues", email: "security@ironcladvault.com", desc: "Report vulnerabilities responsibly. We have a bug bounty program.", icon: "security" },
              { title: "Careers", email: "careers@ironcladvault.com", desc: "Interested in joining the team? Send us your resume.", icon: "work" },
            ].map((item, i) => (
              <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-primary/20 transition-colors">
                <span className="material-icons text-primary text-2xl mb-4 block">{item.icon}</span>
                <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{item.desc}</p>
                <a href={`mailto:${item.email}`} className="text-primary text-sm font-bold hover:underline">{item.email}</a>
              </div>
            ))}
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-white/5">
            <h2 className="text-xl font-bold text-white mb-6">Community Channels</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { name: "GitHub", desc: "Source code & issues", href: "https://github.com/Xconmax245/buidl-bitcoin", icon: "code" },
                { name: "Twitter / X", desc: "Updates & discussions", href: "https://twitter.com", icon: "tag" },
                { name: "Discord", desc: "Community chat", href: "https://discord.gg", icon: "forum" },
              ].map((channel, i) => (
                <a key={i} href={channel.href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-primary/10 hover:border-primary/20 border border-white/5 transition-all text-center">
                  <span className="material-icons text-primary text-xl">{channel.icon}</span>
                  <span className="text-white font-bold text-sm">{channel.name}</span>
                  <span className="text-gray-500 text-xs">{channel.desc}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
