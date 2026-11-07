"use client";

import React from "react";
import Link from "next/link";
import { Tag, Award, CheckCircle2 } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/ProductCard";
import { formatGhs } from "@/lib/utils";

export default function DealsPage() {
  const { products, coupons, settings, showToast } = useStore();

  const discountedProducts = products.filter(
    (p) => p.published && (p.compareAtPriceGhs || p.dealBadge)
  );

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-10 md:py-14">
      <nav aria-label="Breadcrumb" className="text-xs font-mono text-black/60 mb-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        / <span className="text-black font-semibold">Promotions & Coupons</span>
      </nav>

      <div className="border-b border-black pb-6 mb-8">
        <h1 className="text-h1">Promotions, Coupons & Loyalty Rewards</h1>
        <p className="text-sm text-black/75 mt-1 max-w-2xl">
          Apply verified SAMCORE coupon codes at checkout or redeem loyalty points earned on previous purchases.
        </p>
      </div>

      {/* Active Coupons Grid */}
      <section className="mb-12">
        <h2 className="text-h3 mb-4">Active Checkout Coupon Codes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {coupons
            .filter((c) => c.active)
            .map((coupon) => (
              <div
                key={coupon.code}
                className="p-5 border-2 border-black bg-white rounded-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-black text-white font-mono font-bold text-sm">
                      {coupon.code}
                    </span>
                    <span className="text-xs font-mono text-black/60">
                      Expires {coupon.expiresAt}
                    </span>
                  </div>
                  <p className="font-display font-bold text-base pt-1">
                    {coupon.description}
                  </p>
                  <p className="text-xs font-mono text-black/70">
                    Min Order: {formatGhs(coupon.minOrderGhs)} • Max Cap:{" "}
                    {formatGhs(coupon.maxDiscountGhs)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(coupon.code);
                    showToast(`Copied coupon code ${coupon.code} to clipboard.`);
                  }}
                  className="w-full py-2 border border-black text-xs font-mono uppercase hover:bg-black hover:text-white rounded-sm transition-colors"
                >
                  Copy Code: {coupon.code}
                </button>
              </div>
            ))}
        </div>
      </section>

      {/* Discounted Products */}
      <section>
        <h2 className="text-h2 mb-6">Featured Price Drops & Bundle Deals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {discountedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
