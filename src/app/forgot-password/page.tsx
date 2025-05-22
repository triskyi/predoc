"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSent(false);
    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setSent(true);
    } else {
      setError("Failed to send reset link. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-2">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">
        {/* Left: Form */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            Email
          </h2>
          <form onSubmit={handleReset} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="email"
                className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                autoComplete="email"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">
                <Mail size={18} />
              </span>
            </div>
            <Button
              type="submit"
              className="w-full py-2 text-lg bg-blue-600 hover:bg-blue-700"
            >
              Send Password Reset Link
            </Button>
            {sent && (
              <div className="text-green-600 text-center text-sm">
                If this email exists, a reset link has been sent.
              </div>
            )}
            {error && (
              <div className="text-red-500 text-center text-sm">{error}</div>
            )}
          </form>
          <div className="mt-4 text-center text-gray-500 dark:text-gray-300 text-sm">
            Login to your account from{" "}
            <Link
              href="/login"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              here
            </Link>
          </div>
        </div>
        {/* Right: Info Panel */}
        <div className="hidden md:flex flex-col justify-center items-center flex-1 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-10">
          <div className="flex flex-col items-center">
            <Image src="/logo.png" alt="Logo" width={100} height={100} />
            <span className="font-bold text-2xl text-blue-700 dark:text-blue-400 mb-2">
              PREDOC
            </span>
            <span className="text-gray-700 dark:text-gray-200 text-lg font-semibold mb-2">
              Reset Password!
            </span>
            <span className="text-gray-500 dark:text-gray-300 text-center">
              Enter your email address to receive a password reset link.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
