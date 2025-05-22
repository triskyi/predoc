"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 px-6 py-3 flex items-center justify-between shadow-sm">
      {/* Logo */}
      <Link
        href="/"
        className="text-2xl font-bold text-blue-600 dark:text-blue-400"
      >
        PREDOC
      </Link>

      {/* Search */}
      <div className="flex-1 mx-6 max-w-md hidden sm:block">
        <form className="relative">
          <input
            type="text"
            placeholder="Search ..."
            className="w-full text-white  rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <Button
            type="submit"
            className="absolute left-0 top-1/2 -translate-y-1/2 px-2 py-1 bg-transparent text-gray-400 hover:text-blue-600"
            tabIndex={-1}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="sr-only">Search</span>
          </Button>
        </form>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <Button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 p-2 rounded-full"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </Button>

        {/* Login */}
        <Link href="/login">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 px-4 py-2 font-medium flex items-center gap-1 rounded-md shadow">
            <LogIn size={18} /> Login
          </Button>
        </Link>
      </div>
    </nav>
  );
}
