import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Blog | Ironclad Protocol",
  description: "Latest updates, insights, and announcements from the Ironclad Protocol team.",
};

const posts = [
  {
    title: "Introducing Ironclad: Programmable Bitcoin Savings",
    date: "Feb 15, 2026",
    category: "Announcement",
    excerpt: "Today we launch Ironclad Protocol — a non-custodial, rule-based Bitcoin savings platform built on Stacks. Learn about our vision for programmable savings.",
    readTime: "5 min",
  },
  {
    title: "Understanding Bitcoin Savings Plans",
    date: "Feb 10, 2026",
    category: "Education",
    excerpt: "What are programmable savings plans? How do time-locked commitments work? A beginner's guide to disciplined Bitcoin savings.",
    readTime: "8 min",
  },
  {
    title: "Security Architecture Deep Dive",
    date: "Feb 5, 2026",
    category: "Technical",
    excerpt: "An in-depth look at how Ironclad secures your keys locally using AES-256-GCM, PBKDF2, and BIP-84 HD wallets.",
    readTime: "12 min",
  },
  {
    title: "Community Governance: How Ironclad Is Governed",
    date: "Jan 28, 2026",
    category: "Governance",
    excerpt: "Explore our on-chain reputation system, community voting mechanisms, and how protocol parameters are decided.",
    readTime: "6 min",
  },
];

export default function BlogPage() {
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
            <h1 className="text-4xl sm:text-5xl font-tight font-bold text-white mb-4">Blog</h1>
            <p className="text-lg text-gray-400">Updates, insights, and technical deep dives from the Ironclad team.</p>
          </div>

          <div className="space-y-6">
            {posts.map((post, i) => (
              <div key={i} className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 hover:border-primary/20 transition-all group cursor-pointer">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-wider">{post.category}</span>
                  <span className="text-xs text-gray-500">{post.date}</span>
                  <span className="text-xs text-gray-500">· {post.readTime} read</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{post.title}</h2>
                <p className="text-gray-400 text-sm leading-relaxed">{post.excerpt}</p>
                <div className="mt-4">
                  <span className="text-primary text-sm font-bold group-hover:underline">Read more →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
