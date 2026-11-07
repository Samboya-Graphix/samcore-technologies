"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, KeyRound, ShieldCheck } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { AdminNav } from "@/components/AdminNav";

export default function AdminSettingsPage() {
  const {
    settings,
    updateStoreSettings,
    adminRole,
    updateAdminCredentials,
  } = useStore();
  const [formState, setFormState] = useState(settings);

  // Credential rotation states
  const [currentPin, setCurrentPin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPin, setNewPin] = useState("");
  const [secFeedback, setSecFeedback] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(formState);
  };

  const handleRotateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    const res = updateAdminCredentials(newPassword, newPin, currentPin);
    setSecFeedback(res.message);
    if (res.ok) {
      setCurrentPin("");
      setNewPassword("");
      setNewPin("");
    }
  };

  return (
    <div>
      <AdminNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16 space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black pb-5">
          <div>
            <h1 className="text-h1">
              Store Identity, Security Vault & Delivery Settings
            </h1>
            <p className="text-sm text-black/75 mt-1">
              Configure official WhatsApp number (0509461505 / 233509461505), online platform coverage notice, and Owner Security PIN / Master Passphrase.
            </p>
          </div>
          <Link
            href="/admin/staff"
            className="px-4 py-2 border border-black text-xs font-mono uppercase rounded-sm hover:bg-black hover:text-white"
          >
            Manage Staff Roles & Audit Trail →
          </Link>
        </div>

        {adminRole !== "Owner/Admin" ? (
          <div className="p-8 border-2 border-black bg-white space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-xs font-mono uppercase font-bold">
              <Lock className="w-4 h-4" />
              <span>OWNER/ADMIN SECURITY RESTRICTION</span>
            </div>
            <h2 className="text-h3">
              Store Configuration & Security Vault Locked for Staff Role
            </h2>
            <p className="text-xs text-black/75 leading-relaxed">
              Only the authenticated Owner/Admin (<strong>samuel@samcore.gh</strong>) can modify store identity, WhatsApp routing numbers, or security credentials.
            </p>
          </div>
        ) : (
          <>
            {/* 1. Store Identity & WhatsApp Routing */}
            <form
              onSubmit={handleSave}
              className="p-6 border border-black bg-white space-y-4 text-xs"
            >
              <h2 className="font-display font-bold text-base uppercase tracking-wider border-b border-black/15 pb-2">
                1. Store Identity & Official WhatsApp Routing
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono uppercase mb-1">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={formState.storeName}
                    onChange={(e) =>
                      setFormState({ ...formState, storeName: e.target.value })
                    }
                    className="w-full border border-black px-3 py-2 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase mb-1">
                    Official WhatsApp Number (0509461505 / 233509461505)
                  </label>
                  <input
                    type="text"
                    value={formState.whatsappNumber}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        whatsappNumber: e.target.value,
                      })
                    }
                    className="w-full border border-black px-3 py-2 font-mono bg-white"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase mb-1">
                    Support Phone Display
                  </label>
                  <input
                    type="text"
                    value={formState.supportPhone}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        supportPhone: e.target.value,
                      })
                    }
                    className="w-full border border-black px-3 py-2 font-mono bg-white"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase mb-1">
                    Official Support Email
                  </label>
                  <input
                    type="email"
                    value={formState.supportEmail}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        supportEmail: e.target.value,
                      })
                    }
                    className="w-full border border-black px-3 py-2 font-mono bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono uppercase mb-1">
                    Platform Operating Model & Delivery Coverage (Online Only)
                  </label>
                  <input
                    type="text"
                    value={formState.showroomAddress}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        showroomAddress: e.target.value,
                      })
                    }
                    className="w-full border border-black px-3 py-2 bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-black text-white px-6 py-3 font-mono uppercase rounded-sm hover:bg-black/85"
              >
                Save Store Configuration
              </button>
            </form>

            {/* 2. Owner Master Passphrase & 6-Digit 2FA PIN Rotation */}
            <form
              onSubmit={handleRotateCredentials}
              className="p-6 border-2 border-black bg-white space-y-4 text-xs"
            >
              <div className="flex items-center justify-between border-b border-black pb-2.5">
                <h2 className="font-display font-bold text-base uppercase tracking-wider inline-flex items-center gap-2">
                  <KeyRound className="w-4 h-4" />
                  <span>
                    2. Rotate Owner Master Passphrase & 6-Digit Security PIN
                  </span>
                </h2>
                <span className="px-2 py-0.5 bg-black text-white font-mono text-[10px] uppercase">
                  Owner Only
                </span>
              </div>

              {secFeedback && (
                <div className="p-3 border border-black bg-black/[0.03] font-mono">
                  {secFeedback}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono uppercase mb-1 font-bold">
                    Current 6-Digit PIN *
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={currentPin}
                    onChange={(e) =>
                      setCurrentPin(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    placeholder="••••••"
                    className="w-full border border-black px-3 py-2 font-mono bg-white"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase mb-1 font-bold">
                    New Master Passphrase (8+ chars) *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New strong passphrase"
                    className="w-full border border-black px-3 py-2 font-mono bg-white"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase mb-1 font-bold">
                    New 6-Digit Security PIN *
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={newPin}
                    onChange={(e) =>
                      setNewPin(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    placeholder="6 digits"
                    className="w-full border border-black px-3 py-2 font-mono bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 font-mono uppercase rounded-sm hover:bg-black/85"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Update Security Vault Credentials</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
