"use client";

import React from "react";
import Link from "next/link";
import {
  User,
  Package,
  Heart,
  Bell,
  Award,
  Star,
  LogOut,
  ShieldCheck,
  MessageSquare,
  Compass,
  FileQuestion,
  CheckCircle2,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { formatGhs, getWhatsAppEnquiryUrl } from "@/lib/utils";

export default function AccountDashboardPage() {
  const {
    currentUser,
    logoutCustomer,
    orders,
    wishlistIds,
    alerts,
    settings,
  } = useStore();

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-h2">Customer Account Portal</h1>
        <p className="text-sm text-black/75">
          Sign in to track your laptop deliveries, view active hardware warranties, manage restock alerts, and redeem loyalty points.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            href="/login"
            className="bg-black text-white px-6 py-3 text-xs font-mono uppercase font-bold rounded-sm"
          >
            Sign In to Your Account →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-10">
      {/* Customer Personal Welcome Banner */}
      <div className="p-6 sm:p-8 border-2 border-black bg-white rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 bg-black text-white text-xs font-mono uppercase font-bold">
              VERIFIED BUYER ACCOUNT • {currentUser.id}
            </span>
            <span className="px-2.5 py-1 border border-black text-xs font-mono uppercase">
              Loyalty Wallet: {currentUser.loyaltyPoints} pts (
              {formatGhs(
                currentUser.loyaltyPoints *
                  settings.loyaltyRedeemValueGhsPerPoint
              )}{" "}
              Discount Value)
            </span>
          </div>
          <h1 className="text-h1">Welcome back, {currentUser.name}</h1>
          <p className="text-xs font-mono text-black/70">
            {currentUser.email} • {currentUser.phone} • Saved Delivery Address:{" "}
            {currentUser.defaultAddress}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <a
            href={getWhatsAppEnquiryUrl(
              settings,
              undefined,
              `Hello SAMCORE TECHNOLOGIES, this is ${currentUser.name} (${currentUser.email}). I need assistance with my customer account.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white text-xs font-mono uppercase rounded-sm hover:bg-black/85"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Concierge (050 946 1505)</span>
          </a>
          <button
            type="button"
            onClick={logoutCustomer}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-black text-xs font-mono uppercase rounded-sm hover:bg-black hover:text-white"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* What a Customer Does Here — 4 Buyer Self-Service Capabilities */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/account/orders"
          className="p-5 border border-black hover:bg-black hover:text-white transition-colors rounded-sm space-y-2 group"
        >
          <div className="flex items-center justify-between font-mono text-xs uppercase">
            <span>01 / MY ORDERS & WARRANTY</span>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h2 className="font-display font-bold text-base">
            Track Deliveries & Warranties ({orders.length})
          </h2>
          <p className="text-xs opacity-75 leading-relaxed">
            Follow your laptop from 25-point bench testing to doorstep courier delivery and view your 6–12 month warranty coverage.
          </p>
        </Link>

        <Link
          href="/account/rewards"
          className="p-5 border border-black hover:bg-black hover:text-white transition-colors rounded-sm space-y-2 group"
        >
          <div className="flex items-center justify-between font-mono text-xs uppercase">
            <span>02 / LOYALTY REWARDS</span>
            <Award className="w-4 h-4" />
          </div>
          <h2 className="font-display font-bold text-base">
            Redeem {currentUser.loyaltyPoints} Points ({formatGhs(
              currentUser.loyaltyPoints * settings.loyaltyRedeemValueGhsPerPoint
            )})
          </h2>
          <p className="text-xs opacity-75 leading-relaxed">
            Earn 1 point for every GH₵ 100 spent and apply your points directly toward your next laptop or power bank order.
          </p>
        </Link>

        <Link
          href="/account/wishlist"
          className="p-5 border border-black hover:bg-black hover:text-white transition-colors rounded-sm space-y-2 group"
        >
          <div className="flex items-center justify-between font-mono text-xs uppercase">
            <span>03 / SAVED & RESTOCK ALERTS</span>
            <Heart className="w-4 h-4" />
          </div>
          <h2 className="font-display font-bold text-base">
            Saved Laptops ({wishlistIds.length}) & Alerts ({alerts.length})
          </h2>
          <p className="text-xs opacity-75 leading-relaxed">
            Keep your shortlist of ThinkPads, MacBooks, and RTX workstations and get notified when sold-out units return.
          </p>
        </Link>

        <Link
          href="/request-device"
          className="p-5 border border-black hover:bg-black hover:text-white transition-colors rounded-sm space-y-2 group"
        >
          <div className="flex items-center justify-between font-mono text-xs uppercase">
            <span>04 / CUSTOM SOURCING</span>
            <FileQuestion className="w-4 h-4" />
          </div>
          <h2 className="font-display font-bold text-base">
            Request Specific Laptop Specs
          </h2>
          <p className="text-xs opacity-75 leading-relaxed">
            Need a custom 64GB RAM or 2TB SSD configuration? Submit a custom sourcing request to our team.
          </p>
        </Link>
      </section>

      {/* Main Buyer Workspace: Left Buyer Menu (3 cols) + Active Orders & Warranty Tracker (9 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3 space-y-2">
          {[
            { href: "/account", label: "Buyer Overview", icon: User, active: true },
            { href: "/account/orders", label: `My Orders & Warranties (${orders.length})`, icon: Package },
            { href: "/account/wishlist", label: `Saved Wishlist (${wishlistIds.length})`, icon: Heart },
            { href: "/account/alerts", label: `Restock Alerts (${alerts.length})`, icon: Bell },
            { href: "/account/rewards", label: `Loyalty Wallet (${currentUser.loyaltyPoints} pts)`, icon: Award },
            { href: "/account/reviews", label: "Write Product Review", icon: Star },
            { href: "/laptop-finder", label: "Guided Laptop Finder", icon: Compass },
          ].map((nav) => {
            const Icon = nav.icon;
            return (
              <Link
                key={nav.href}
                href={nav.href}
                className={`flex items-center gap-2.5 px-4 py-3 border text-xs font-mono uppercase rounded-sm transition-colors ${
                  nav.active
                    ? "bg-black text-white border-black font-bold"
                    : "bg-white text-black border-black/25 hover:border-black"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{nav.label}</span>
              </Link>
            );
          })}
        </aside>

        <div className="lg:col-span-9 space-y-6">
          {/* Active Orders, Delivery Progress & Hardware Warranty Certificates */}
          <div className="border-2 border-black rounded-sm overflow-hidden bg-white">
            <div className="px-5 py-3.5 bg-black text-white flex items-center justify-between">
              <h2 className="font-mono text-xs uppercase tracking-wider font-bold">
                My Laptop Orders, Live Delivery Progress & Hardware Warranties
              </h2>
              <Link href="/account/orders" className="text-xs font-mono underline">
                View All →
              </Link>
            </div>
            <div className="divide-y divide-black/15">
              {orders.map((order) => (
                <div key={order.id} className="p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-base">
                          Order {order.id}
                        </span>
                        <span className="px-2 py-0.5 border border-black text-[10px] font-mono uppercase">
                          Payment: {order.paymentStatus}
                        </span>
                        <span className="px-2 py-0.5 bg-black text-white text-[10px] font-mono uppercase">
                          Delivery Stage: {order.fulfilmentStatus}
                        </span>
                      </div>
                      <p className="text-xs text-black/75 mt-1 font-mono">
                        Zone: {order.deliveryZone} • Total:{" "}
                        <strong>{formatGhs(order.totalGhs)}</strong>
                      </p>
                    </div>

                    <Link
                      href={`/account/orders/${order.id}`}
                      className="px-4 py-2 bg-black text-white text-xs font-mono uppercase rounded-sm hover:bg-black/85 self-start sm:self-auto"
                    >
                      View Warranty & Timeline →
                    </Link>
                  </div>

                  {/* Purchased Hardware & Selected Specs */}
                  <div className="grid grid-cols-1 gap-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-black/[0.02] border border-black/15 flex flex-wrap items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <p className="font-bold text-black">
                            {item.quantity}× {item.name} ({item.condition})
                          </p>
                          <p className="font-mono text-[11px] text-black/70">
                            Selected Specs: {item.specsSnapshot}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 border border-black font-mono text-[10px] uppercase font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-black" />
                          <span>{item.warrantyMonths} Months SAMCORE Warranty</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
