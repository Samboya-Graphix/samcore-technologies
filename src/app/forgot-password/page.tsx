"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <div className="p-6 sm:p-8 border-2 border-black bg-white rounded-sm space-y-5">
        <h1 className="text-h2">Password Recovery</h1>
        <p className="text-xs text-black/75">
          Enter your registered email address to receive a one-time password reset token.
        </p>

        {sent ? (
          <div className="p-4 border border-black bg-black/[0.03] space-y-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 font-bold uppercase">
              <CheckCircle2 className="w-4 h-4" />
              <span>Recovery Link Dispatched</span>
            </div>
            <p>
              If an account matches <strong>{email}</strong>, a time-limited recovery link has been sent.
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-mono uppercase mb-1">
                Account Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kofi.asante@gmail.com"
                className="w-full border border-black px-3.5 py-2.5 text-sm bg-white"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 text-xs font-mono uppercase rounded-sm"
            >
              Send Reset Instructions
            </button>
          </form>
        )}

        <div className="pt-3 border-t border-black/15 text-xs font-mono">
          <Link href="/login" className="underline">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
