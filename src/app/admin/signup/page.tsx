"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Lock, EyeOff, Eye, User, UserPlus } from "lucide-react";
import Image from "next/image";

export default function AdminSignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showRePass, setShowRePass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password !== rePassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/admin/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess("Admin account created! You can now sign in.");
      setName("");
      setEmail("");
      setPassword("");
      setRePassword("");
    } else {
      const data = await res.json();
      setError(data.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-2">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">
        {/* Left: Signup Form */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            Admin Signup
          </h2>
          <Button
            type="button"
            className="w-full flex items-center justify-center gap-2 mb-6"
            disabled
          >
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            Sign up with Google
          </Button>
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="mx-3 text-gray-400 text-sm">
              Or sign up with email
            </span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            {error && (
              <div className="mb-2 text-red-500 text-center">{error}</div>
            )}
            {success && (
              <div className="mb-2 text-green-600 text-center">{success}</div>
            )}
            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-200 font-medium">
                Name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-200 font-medium">
                Admin Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="Enter your admin email"
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-200 font-medium">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <Lock size={18} />
                </span>
                <input
                  type={showPass ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-400"
                  tabIndex={-1}
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-200 font-medium">
                Re-type Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <Lock size={18} />
                </span>
                <input
                  type={showRePass ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-400"
                  tabIndex={-1}
                  onClick={() => setShowRePass((v) => !v)}
                  aria-label={showRePass ? "Hide password" : "Show password"}
                >
                  {showRePass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full py-2 text-lg flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              <UserPlus size={20} /> Create Admin Account
            </Button>
          </form>
          <div className="mt-4 text-center text-gray-500 dark:text-gray-300 text-sm">
            Already have an account?{" "}
            <Link
              href="/admin/login"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>
        {/* Right: Welcome Panel */}
        <div className="hidden md:flex flex-col justify-center items-center flex-1 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-10">
          <div className="flex flex-col items-center">
            <Image
              src="/logo.png"
              alt="PREDOC Logo"
              width={64}
              height={64}
              className="w-16 h-16 mb-4"
            />
            <span className="font-bold text-2xl text-blue-700 dark:text-blue-400 mb-2">
              PREDOC
            </span>
            <span className="text-gray-700 dark:text-gray-200 text-lg font-semibold mb-2">
              Welcome Admin!
            </span>
            <span className="text-gray-500 dark:text-gray-300 text-center">
              Please fill in the fields to create your admin account.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
