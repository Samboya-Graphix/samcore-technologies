"use client";

import React from "react";
import Link from "next/link";
import { Award, ArrowRight } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { formatGhs } from "@/lib/utils";

export default function AccountRewardsPage() {
  const { currentUser, coupons, settings } = useStore();
  const points = currentUser?.loyaltyPoints ?? 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <nav aria-label="Breadcrumb" className="text-xs font-mono text-black/60 mb-4">
        <Link href="/account" className="hover:underline">
          My Account
        </Link>{" "}
        / <span className="text-black font-semibold">Loyalty Ledger & Coupons</span>
      </nav>

      <div className="border-b border-black pb-6 mb-8">
        <h1 className="text-h1">SAMCORE Loyalty Ledger & Coupons</h1>
        <p className="text-sm text-black/75 mt-1">
          Auditable loyalty points ledger with refund reversal rules and checkout redemption.
        </p>
      </div>

      {/* Balance Card */}
      <div className="p-6 sm:p-8 bg-black text-white rounded-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-white/70">
            Available Loyalty Points Balance
          </span>
          <p className="text-4xl font-display font-bold mt-1">{points} PTS</p>
          <p className="text-xs font-mono text-white/80 mt-1">
            Checkout Discount Value:{" "}
            <strong>
              {formatGhs(points * settings.loyaltyRedeemValueGhsPerPoint)}
            </strong>{" "}
            (Earn 1 pt per {formatGhs(settings.loyaltyEarnRateGhsPerPoint)} spent)
          </p>
        </div>
        <Link
          href="/checkout"
          className="inline-flex items-center gap-2 bg-white text-black px-5 py-3 text-xs font-mono uppercase font-bold rounded-sm"
        >
          <span>Redeem at Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Points Transaction Ledger */}
      <div className="border border-black rounded-sm overflow-hidden mb-10">
        <div className="px-5 py-3 bg-black/[0.03] border-b border-black font-mono text-xs uppercase font-bold">
          Audited Points Ledger
        </div>
        <div className="divide-y divide-black/15 text-xs">
          {(currentUser?.loyaltyHistory ?? []).map((entry) => (
            <div
              key={entry.id}
              className="px-5 py-3.5 flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-sm">{entry.description}</p>
                <p className="font-mono text-black/60">{entry.date}</p>
              </div>
              <span className="font-mono font-bold text-sm">
                {entry.pointsDelta > 0
                  ? `+${entry.pointsDelta} PTS`
                  : `${entry.pointsDelta} PTS`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Eligible Coupons */}
      <h2 className="text-h3 mb-4">Eligible Member Discount Coupons</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {coupons
          .filter((c) => c.active)
          .map((c) => (
            <div key={c.code} className="p-4 border border-black space-y-2">
              <span className="px-2 py-0.5 bg-black text-white font-mono text-xs font-bold">
                {c.code}
              </span>
              <p className="text-xs font-medium">{c.description}</p>
              <p className="text-[11px] font-mono text-black/60">
                Min Spend: {formatGhs(c.minOrderGhs)}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
