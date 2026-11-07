"use client";

import React from "react";
import { ShieldAlert } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { AdminNav } from "@/components/AdminNav";
import { formatGhs } from "@/lib/utils";

export default function AdminAnalyticsPage() {
  const { orders, products, adminRole } = useStore();

  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  const paidRevenue = paidOrders.reduce((s, o) => s + o.totalGhs, 0);
  const aov =
    paidOrders.length > 0 ? Math.round(paidRevenue / paidOrders.length) : 0;

  const totalCost = paidOrders.reduce((s, o) => {
    return (
      s +
      o.items.reduce((is, item) => {
        const prod = products.find((p) => p.id === item.productId);
        return is + (prod?.costPriceGhs ?? 0) * item.quantity;
      }, 0)
    );
  }, 0);
  const grossMargin = paidRevenue - totalCost;

  return (
    <div>
      <AdminNav />
      <div className="max-w-container mx-auto px-4 sm:px-6 pb-16 space-y-8">
        <div className="border-b border-black pb-5">
          <h1 className="text-h1">Sales & Margin Analytics (Paid Orders Only)</h1>
          <p className="text-sm text-black/75 mt-1">
            Revenue metrics strictly count verified paid orders only. Gross margin is restricted to Owner/Admin.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 border border-black bg-white">
            <span className="text-xs font-mono uppercase text-black/60">
              Verified Paid Revenue
            </span>
            <p className="text-3xl font-display font-bold mt-1">
              {formatGhs(paidRevenue)}
            </p>
          </div>

          <div className="p-5 border border-black bg-white">
            <span className="text-xs font-mono uppercase text-black/60">
              Average Order Value (AOV)
            </span>
            <p className="text-3xl font-display font-bold mt-1">
              {formatGhs(aov)}
            </p>
          </div>

          <div className="p-5 border border-black bg-white">
            <span className="text-xs font-mono uppercase text-black/60">
              Paid Conversion Volume
            </span>
            <p className="text-3xl font-display font-bold mt-1">
              {paidOrders.length} / {orders.length} Orders
            </p>
          </div>

          <div className="p-5 border border-black bg-white">
            <span className="text-xs font-mono uppercase text-black/60">
              Gross Margin (Admin-Only)
            </span>
            {adminRole === "Owner/Admin" ? (
              <p className="text-3xl font-display font-bold mt-1">
                {formatGhs(grossMargin)}
              </p>
            ) : (
              <p className="text-xs font-mono mt-2 inline-flex items-center gap-1">
                <ShieldAlert className="w-4 h-4" /> Hidden for Staff
              </p>
            )}
          </div>
        </div>

        {/* Monochrome Bar Chart Breakdown by Category */}
        <div className="p-6 border border-black bg-white space-y-4">
          <h2 className="font-mono text-xs uppercase font-bold">
            Catalogue Inventory Value & Popularity by Product
          </h2>
          <div className="space-y-3">
            {products.slice(0, 6).map((p) => {
              const widthPct = Math.min(
                100,
                Math.round((p.reviewCount / 45) * 100)
              );
              return (
                <div key={p.id} className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="font-bold">{p.shortTitle}</span>
                    <span>
                      {formatGhs(p.priceGhs)} • {p.reviewCount} Verified Reviews
                    </span>
                  </div>
                  <div className="w-full h-3 border border-black bg-white">
                    <div
                      className="h-full bg-black"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
