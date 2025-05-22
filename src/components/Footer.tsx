import { Mail, Twitter, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-left text-sm">
        {/* Brand & Description */}
        <div>
          <div className="font-bold text-lg mb-2 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mr-2" />
            PREDOC
          </div>
          <p className="text-gray-600 mb-4">
            PREDOC is your AI-powered doctor assistant. Instantly detect diseases, get safe drug recommendations, and manage patient data securely—all powered by advanced artificial intelligence for better healthcare outcomes.
          </p>
          <div className="flex gap-3">
            <a href="#" aria-label="Twitter" className="hover:text-blue-500">
              <Twitter size={18} />
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-blue-700">
              <Facebook size={18} />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-pink-500">
              <Instagram size={18} />
            </a>
            <a href="mailto:info@predoc.com" aria-label="Email" className="hover:text-blue-400">
              <Mail size={18} />
            </a>
          </div>
        </div>
        {/* Menu */}
        <div>
          <div className="font-semibold mb-2">Menu</div>
          <ul className="space-y-1 text-gray-600">
            <li><a href="#" className="hover:text-blue-600">Home</a></li>
            <li><a href="#" className="hover:text-blue-600">AI Diagnosis</a></li>
            <li><a href="#" className="hover:text-blue-600">Drug Recommendations</a></li>
            <li><a href="#" className="hover:text-blue-600">Patient Management</a></li>
          </ul>
        </div>
        {/* Support */}
        <div>
          <div className="font-semibold mb-2">Support</div>
          <ul className="space-y-1 text-gray-600">
            <li><a href="#" className="hover:text-blue-600">FAQs</a></li>
            <li><a href="#" className="hover:text-blue-600">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-blue-600">Contact Support</a></li>
          </ul>
        </div>
        {/* Stay in Touch */}
        <div>
          <div className="font-semibold mb-2">Stay in Touch</div>
          <form className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Email address..."
              className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 transition-all duration-300 text-sm"
            >
              Subscribe
            </button>
          </form>
          <div className="mt-3 text-xs text-gray-400">
            <a href="#" className="hover:underline">Track your health reports</a>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 py-4 border-t border-gray-100">
        PREDOC © 2025 All Rights Reserved.
      </div>
    </footer>
  );
}