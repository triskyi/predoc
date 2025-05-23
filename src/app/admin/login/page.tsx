"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mail, Lock, EyeOff, Eye, User } from "lucide-react";
import Image from "next/image";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      setLoading(false);
      if (res?.error) {
        setError(
          res.error === "CredentialsSignin"
            ? "Invalid email, password, or not an admin."
            : res.error
        );
        return;
      }
      router.push("/admin");
    } catch (err: unknown) {
      setLoading(false);
      if (err instanceof Error) {
        setError("An unexpected error occurred: " + err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-2">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">
        {/* Left: Login Form */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            Admin Login
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
            Sign in with Google
          </Button>
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="mx-3 text-gray-400 text-sm">
              Or sign in with email
            </span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="mb-2 text-red-500 text-center font-semibold">
                {error}
              </div>
            )}
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
                  autoComplete="current-password"
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
            <Button
              type="submit"
              className="w-full py-2 text-lg flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              <User size={20} /> {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center text-gray-500 dark:text-gray-300 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/admin/signup"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Sign up
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
              Enter your credentials to access the admin dashboard.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
