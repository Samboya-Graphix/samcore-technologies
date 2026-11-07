"use client";

import React from "react";
import Link from "next/link";
import { Bell, Trash2 } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/ProductCard";

export default function WishlistPage() {
  const { products, wishlistIds, alerts, removeRestockAlert } = useStore();
  const savedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-10 md:py-14">
      <nav aria-label="Breadcrumb" className="text-xs font-mono text-black/60 mb-4">
        <Link href="/account" className="hover:underline">
          My Account
        </Link>{" "}
        /{" "}
        <span className="text-black font-semibold">
          Saved Wishlist & Restock Alerts
        </span>
      </nav>

      <div className="border-b border-black pb-6 mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-h1">Wishlist & Restock Alerts</h1>
          <p className="text-sm text-black/75 mt-1">
            Monitor saved laptops and manage WhatsApp/Email restock alert subscriptions.
          </p>
        </div>
        <Link
          href="/account/alerts"
          className="px-4 py-2 border border-black text-xs font-mono uppercase rounded-sm hover:bg-black hover:text-white"
        >
          Manage Alert Subscriptions ({alerts.length}) →
        </Link>
      </div>

      {savedProducts.length === 0 ? (
        <div className="p-10 border border-dashed border-black text-center space-y-3">
          <h2 className="text-h3">Your Wishlist is Empty</h2>
          <Link
            href="/shop"
            className="inline-block bg-black text-white px-5 py-2.5 text-xs font-mono uppercase"
          >
            Browse Laptops
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {savedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* Restock Subscriptions Section */}
      <section className="border-t border-black pt-8">
        <h2 className="text-h3 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          <span>Active Restock Alert Subscriptions ({alerts.length})</span>
        </h2>
        <div className="space-y-3">
          {alerts.map((a) => (
            <div
              key={a.id}
              className="p-4 border border-black flex items-center justify-between text-xs"
            >
              <div>
                <p className="font-bold text-sm">{a.productName}</p>
                <p className="font-mono text-black/65">
                  Channel: {a.channel} ({a.emailOrPhone}) • Subscribed:{" "}
                  {a.createdAt}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeRestockAlert(a.id)}
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-black font-mono uppercase hover:bg-black hover:text-white"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Unsubscribe</span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
