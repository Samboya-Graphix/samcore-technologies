"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { AdminNav } from "@/components/AdminNav";
import { formatGhs } from "@/lib/utils";

export default function AdminRewardsPage() {
  const { currentUser, settings } = useStore();

  return (
    <div>
      <AdminNav />
      <div className="max-w-container mx-auto px-4 sm:px-6 pb-16 space-y-8">
        <div className="border-b border-black pb-5">
          <h1 className="text-h1">Loyalty Points Ledger & Audit Rules</h1>
          <p className="text-sm text-black/75 mt-1">
            Earn rate: 1 point per {formatGhs(settings.loyaltyEarnRateGhsPerPoint)} spent. Redemption value: {formatGhs(settings.loyaltyRedeemValueGhsPerPoint)} per point. Refunds automatically reverse earned points.
          </p>
        </div>

        <div className="border border-black rounded-sm overflow-hidden text-xs font-mono">
          <div className="p-4 bg-black text-white uppercase font-bold">
            Customer Loyalty Ledger — {currentUser?.name || "Kofi Asante-Boateng"} (
            {currentUser?.loyaltyPoints ?? 280} PTS)
          </div>
          <div className="divide-y divide-black/15">
            {(currentUser?.loyaltyHistory ?? []).map((h) => (
              <div key={h.id} className="p-4 flex justify-between">
                <div>
                  <p className="font-bold">{h.description}</p>
                  <p className="text-black/60">{h.date}</p>
                </div>
                <span className="font-bold">
                  {h.pointsDelta > 0 ? `+${h.pointsDelta}` : h.pointsDelta} PTS
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
