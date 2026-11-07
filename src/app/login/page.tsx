"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function LoginPage() {
  const router = useRouter();
  const {
    loginCustomer,
    authenticateAdmin,
    adminLockoutUntil,
  } = useStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lockoutSecondsLeft, setLockoutSecondsLeft] = useState<number>(0);

  // Brute-force lockout countdown timer
  useEffect(() => {
    if (!adminLockoutUntil) {
      setLockoutSecondsLeft(0);
      return;
    }
    const interval = setInterval(() => {
      const diff = Math.ceil((adminLockoutUntil - Date.now()) / 1000);
      if (diff <= 0) {
        setLockoutSecondsLeft(0);
        clearInterval(interval);
      } else {
        setLockoutSecondsLeft(diff);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [adminLockoutUntil]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();

    // Check if login attempt is for an Admin or Staff account
    if (
      cleanEmail === "samuel@samcore.gh" ||
      cleanEmail === "staff@samcore.gh"
    ) {
      const res = authenticateAdmin(cleanEmail, password);
      if (!res.ok) {
        setError(res.error || "Invalid login credentials.");
        return;
      }
      router.push("/admin");
      return;
    }

    // Standard Customer login
    if (password.trim().length < 4) {
      setError("Please enter your account password.");
      return;
    }

    loginCustomer(cleanEmail);
    router.push("/account");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <div className="p-6 sm:p-8 border-2 border-black bg-white rounded-sm space-y-6">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase">
            <Lock className="w-3.5 h-3.5" />
            <span>SAMCORE TECHNOLOGIES • UNIFIED SIGN IN</span>
          </span>
          <h1 className="text-h2">Sign In to Account</h1>
          <p className="text-xs text-black/70">
            Enter your email address and password to access your account.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="p-3.5 border-2 border-black bg-black/[0.04] flex items-start gap-2.5 text-xs font-mono"
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {lockoutSecondsLeft > 0 && (
          <div className="p-3.5 bg-black text-white text-xs font-mono flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 font-bold uppercase">
              <ShieldAlert className="w-4 h-4" />
              <span>Security Lockout Active</span>
            </span>
            <span className="font-bold">{lockoutSecondsLeft}s</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-mono uppercase mb-1"
            >
              Email Address *
            </label>
            <input
              id="login-email"
              type="email"
              required
              disabled={lockoutSecondsLeft > 0}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-black px-3.5 py-2.5 text-sm bg-white disabled:opacity-50"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-mono uppercase mb-1">
              <label htmlFor="login-password">Password *</label>
              <Link href="/forgot-password" className="underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative flex">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                required
                disabled={lockoutSecondsLeft > 0}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-black px-3.5 py-2.5 pr-10 text-sm bg-white disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-3 border-y border-r border-black bg-white text-black hover:bg-black/5"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={lockoutSecondsLeft > 0}
            className="w-full bg-black text-white py-3 text-xs font-mono uppercase tracking-wider font-bold rounded-sm hover:bg-black/85 disabled:opacity-40"
          >
            Sign In
          </button>
        </form>

        <div className="pt-4 border-t border-black/15 text-xs font-mono text-center space-y-2">
          <p>
            New to SAMCORE TECHNOLOGIES?{" "}
            <Link href="/register" className="underline font-bold">
              Create Customer Account
            </Link>
          </p>
          <p>
            Looking up a Guest Order?{" "}
            <Link href="/track-order" className="underline font-bold">
              Verified Order Lookup →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
