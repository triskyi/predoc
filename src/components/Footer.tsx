import {
  Mail,
  Twitter,
  Facebook,
  Instagram,
  Github,
  BookOpen,
  Rocket,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0a0f1c] border-t border-cyan-900 mt-auto text-cyan-100">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-left text-sm">
        {/* Brand & Description */}
        <div>
          <div className="font-extrabold text-lg mb-2 flex items-center gap-2 tracking-widest bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-blue-400 bg-clip-text text-transparent">
            PREDOC
          </div>
          <p className="text-cyan-200 mb-4">
            PREDOC is your AI-powered doctor assistant. Instantly detect
            diseases, get safe drug recommendations, and manage patient data
            securely—all powered by advanced artificial intelligence for better
            healthcare outcomes.
          </p>
          <div className="flex gap-3 mt-2">
            <a
              href="https://twitter.com/"
              aria-label="Twitter"
              className="hover:text-cyan-400 transition"
            >
              <Twitter size={18} />
            </a>
            <a
              href="https://facebook.com/"
              aria-label="Facebook"
              className="hover:text-blue-400 transition"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://instagram.com/"
              aria-label="Instagram"
              className="hover:text-fuchsia-400 transition"
            >
              <Instagram size={18} />
            </a>
            <a
              href="mailto:info@predoc.com"
              aria-label="Email"
              className="hover:text-cyan-300 transition"
            >
              <Mail size={18} />
            </a>
            <a
              href="https://github.com/triskyi/predoc"
              aria-label="GitHub"
              className="hover:text-cyan-400 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={18} />
            </a>
          </div>
        </div>
        {/* Menu */}
        <div>
          <div className="font-semibold mb-2 text-cyan-200">Menu</div>
          <ul className="space-y-1">
            <li>
              <Link href="/" className="hover:text-fuchsia-400 transition">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/ai-playground"
                className="hover:text-fuchsia-400 transition flex items-center gap-1"
              >
                <Rocket size={14} /> AI Playground
              </Link>
            </li>
            <li>
              <Link
                href="/docs"
                className="hover:text-fuchsia-400 transition flex items-center gap-1"
              >
                <BookOpen size={14} /> Docs
              </Link>
            </li>
            <li>
              <Link
                href="/our-source"
                className="hover:text-fuchsia-400 transition flex items-center gap-1"
              >
                <BookOpen size={14} /> Our Source
              </Link>
            </li>
          </ul>
        </div>
        {/* Support */}
        <div>
          <div className="font-semibold mb-2 text-cyan-200">Support</div>
          <ul className="space-y-1">
            <li>
              <a href="#" className="hover:text-fuchsia-400 transition">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-fuchsia-400 transition">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-fuchsia-400 transition">
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="mailto:info@predoc.com"
                className="hover:text-fuchsia-400 transition"
              >
                Contact Support
              </a>
            </li>
          </ul>
        </div>
        {/* Stay in Touch */}
        <div>
          <div className="font-semibold mb-2 text-cyan-200">Stay in Touch</div>
          <form className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Email address..."
              className="px-3 py-2 rounded-md border border-cyan-800 bg-[#111827] text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-fuchsia-600 to-cyan-500 hover:from-cyan-500 hover:to-fuchsia-600 text-white rounded-md px-4 py-2 transition-all duration-300 text-sm"
            >
              Subscribe
            </button>
          </form>
          <div className="mt-3 text-xs text-cyan-400">
            <a href="#" className="hover:underline">
              Track your health reports
            </a>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-cyan-700 py-4 border-t border-cyan-900 bg-[#0a0f1c]">
        PREDOC © 2025 All Rights Reserved.
      </div>
    </footer>
  );
}
