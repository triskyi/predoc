"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, LogIn, Rocket, BookOpen, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#0f172a]/90 via-[#1e293b]/90 to-[#0a0f1c]/90 backdrop-blur border-b border-cyan-900 px-6 py-3 flex items-center justify-between shadow-lg">
      {/* Logo */}
      <Link
        href="/"
        className="text-2xl font-extrabold tracking-widest bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-blue-400 bg-clip-text text-transparent drop-shadow-glow"
        style={{
          textShadow: "0 0 8px #0ff, 0 0 16px #a21caf, 0 0 2px #38bdf8",
        }}
      >
        PREDOC
      </Link>

      {/* Nav Links */}
      <div className="hidden md:flex gap-6 items-center">
        <Link
          href="/ai-playground"
          className="text-cyan-200 hover:text-fuchsia-400 font-medium transition"
        >
          <span className="flex items-center gap-1 rounded px-2 py-1 bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white shadow border border-cyan-800">
            <Rocket size={16} /> AI Playground
          </span>
        </Link>
        <Link
          href="/docs"
          className="text-cyan-200 hover:text-fuchsia-400 font-medium transition"
        >
          <span className="flex items-center gap-1">
            <BookOpen size={16} /> Docs
          </span>
        </Link>
        <a
          href="/our-source"
          className="text-cyan-200 hover:text-fuchsia-400 font-medium transition"
        >
          <span className="flex items-center gap-1">
            <BookOpen size={16} /> Our Source
          </span>
        </a>
        <a
          href="https://github.com/triskyi/predoc"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-200 hover:text-fuchsia-400 font-medium transition"
        >
          <span className="flex items-center gap-1">
            <Github size={16} /> GitHub
          </span>
        </a>
      </div>

      {/* Search */}
      <div className="flex-1 mx-6 max-w-md hidden sm:block">
        <form className="relative">
          <input
            type="text"
            placeholder="Search ..."
            className="w-full rounded-md border border-cyan-800 bg-[#111827] text-cyan-100 px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 transition placeholder:text-cyan-400"
          />
          <Button
            type="submit"
            className="absolute left-0 top-1/2 -translate-y-1/2 px-2 py-1 bg-transparent text-cyan-400 hover:text-fuchsia-400"
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
          className="bg-transparent hover:bg-cyan-900/40 text-cyan-200 p-2 rounded-full border border-cyan-800"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </Button>

        {/* Login */}
        <Link href="/login">
          <Button className="bg-gradient-to-r from-fuchsia-600 to-cyan-500 hover:from-cyan-500 hover:to-fuchsia-600 text-white px-4 py-2 font-medium flex items-center gap-1 rounded-md shadow border border-cyan-800">
            <LogIn size={18} /> Login
          </Button>
        </Link>
      </div>
    </nav>
  );
}
