import Link from "next/link";
import { useState } from "react";
import { Sun, Moon, Bell, LogIn, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [dark, setDark] = useState(false);

  // Simple theme toggle (replace with your actual dark mode logic if needed)
  const toggleTheme = () => {
    setDark((prev) => !prev);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 px-4 py-2 flex items-center justify-between">
      {/* Logo/Brand */}
      <Link href="/" className="text-2xl font-bold text-blue-600">
        Smart Health
      </Link>

      {/* Search */}
      <div className="flex-1 mx-6 max-w-md">
        <form className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <Button
            type="submit"
            className="absolute left-0 top-1/2 -translate-y-1/2 px-2 py-1 bg-transparent text-gray-400 hover:text-blue-600"
            tabIndex={-1}
          >
            <span className="sr-only">Search</span>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Button>
        </form>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <Button
          type="button"
          onClick={toggleTheme}
          className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 px-2 py-2"
          aria-label="Toggle theme"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </Button>

        {/* Notifications */}
        <Button
          type="button"
          className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 px-2 py-2"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </Button>

        {/* Login */}
        <Link href="/login">
          <Button className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 font-medium flex items-center gap-1">
            <LogIn size={18} /> Login
          </Button>
        </Link>

        {/* Get Started */}
        <Link href="/predictor">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-semibold flex items-center gap-1">
            Get Started <ArrowRight size={18} />
          </Button>
        </Link>
      </div>
    </nav>
  );
}