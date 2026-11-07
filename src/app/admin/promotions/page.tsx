"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { AdminNav } from "@/components/AdminNav";
import { formatGhs } from "@/lib/utils";

export default function AdminPromotionsPage() {
  const { coupons, createCoupon, toggleCouponActive } = useStore();
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState(300);
  const [minOrderGhs, setMinOrderGhs] = useState(8000);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createCoupon({
      code: code.toUpperCase().trim(),
      description,
      discountType: "FIXED_GHS",
      value,
      minOrderGhs,
      maxDiscountGhs: value,
      usageCount: 0,
      usageLimit: 50,
      expiresAt: "2026-12-31",
      active: true,
    });
    setCode("");
    setDescription("");
  };

  return (
    <div>
      <AdminNav />
      <div className="max-w-container mx-auto px-4 sm:px-6 pb-16 space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black pb-5">
          <div>
            <h1 className="text-h1">Promotions, Coupons & Loyalty Campaigns</h1>
            <p className="text-sm text-black/75 mt-1">
              Generate auditable discount coupons with spend floors, caps, and expiry dates.
            </p>
          </div>
          <Link
            href="/admin/rewards"
            className="px-4 py-2 border border-black text-xs font-mono uppercase rounded-sm hover:bg-black hover:text-white"
          >
            Open Loyalty Ledger & Reversals →
          </Link>
        </div>

        <form
          onSubmit={handleCreate}
          className="p-6 border border-black bg-white space-y-4 text-xs"
        >
          <h2 className="font-display font-bold text-base uppercase">
            Create New Coupon Campaign
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-mono uppercase mb-1">
                Coupon Code *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="ACCRA300"
                className="w-full border border-black px-3 py-2 font-mono uppercase bg-white"
              />
            </div>
            <div>
              <label className="block font-mono uppercase mb-1">
                Discount Value (GH₵) *
              </label>
              <input
                type="number"
                required
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full border border-black px-3 py-2 font-mono bg-white"
              />
            </div>
            <div>
              <label className="block font-mono uppercase mb-1">
                Min Spend (GH₵) *
              </label>
              <input
                type="number"
                required
                value={minOrderGhs}
                onChange={(e) => setMinOrderGhs(Number(e.target.value))}
                className="w-full border border-black px-3 py-2 font-mono bg-white"
              />
            </div>
            <div>
              <label className="block font-mono uppercase mb-1">
                Campaign Description *
              </label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="GH₵ 300 off orders above GH₵ 8,000"
                className="w-full border border-black px-3 py-2 bg-white"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-black text-white px-5 py-2.5 font-mono uppercase rounded-sm"
          >
            Create Coupon
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {coupons.map((c) => (
            <div
              key={c.code}
              className="p-5 border border-black bg-white space-y-3 text-xs font-mono"
            >
              <div className="flex justify-between">
                <span className="px-2.5 py-0.5 bg-black text-white font-bold">
                  {c.code}
                </span>
                <span>
                  Used: {c.usageCount}/{c.usageLimit}
                </span>
              </div>
              <p className="font-sans font-semibold text-sm">{c.description}</p>
              <p>
                Min Order: {formatGhs(c.minOrderGhs)} • Cap:{" "}
                {formatGhs(c.maxDiscountGhs)}
              </p>
              <button
                type="button"
                onClick={() => toggleCouponActive(c.code)}
                className="w-full py-2 border border-black uppercase hover:bg-black hover:text-white"
              >
                {c.active ? "Active (Click to Pause)" : "Paused (Click to Enable)"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
