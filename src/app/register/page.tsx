"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";

export default function RegisterPage() {
  const router = useRouter();
  const { loginCustomer } = useStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    loginCustomer(email, name, phone);
    router.push("/account");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <div className="p-6 sm:p-8 border-2 border-black bg-white rounded-sm space-y-6">
        <div>
          <span className="text-xs font-mono uppercase">
            SAMCORE LOYALTY & WARRANTY ACCOUNT
          </span>
          <h1 className="text-h2 mt-1">Create Account</h1>
          <p className="text-xs text-black/70 mt-1">
            Earn 1 loyalty point for every GH₵ 100 spent and track all hardware warranties in one place.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Akosua Mensah"
              className="w-full border border-black px-3.5 py-2.5 text-sm bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase mb-1">
              Ghana Phone / WhatsApp Number *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="024 XXX XXXX"
              className="w-full border border-black px-3.5 py-2.5 text-sm bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-black px-3.5 py-2.5 text-sm bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase mb-1">
              Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full border border-black px-3.5 py-2.5 text-sm bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 text-xs font-mono uppercase tracking-wider rounded-sm hover:bg-black/85"
          >
            Register & Sign In
          </button>
        </form>

        <p className="text-xs font-mono text-center pt-3 border-t border-black/15">
          Already have an account?{" "}
          <Link href="/login" className="underline font-bold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
