"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Truck,
  Shield,
  DollarSign,
  Boxes,
  KeyRound,
  FileQuestion,
  Star,
  Wrench,
  PackageCheck,
  MessageSquare,
  ArrowUpRight,
  Lock,
  TrendingUp,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { AdminNav } from "@/components/AdminNav";
import { formatGhs } from "@/lib/utils";
import { FulfilmentStatus } from "@/lib/types";

export default function AdminOverviewPage() {
  const {
    products,
    orders,
    requests,
    reviews,
    auditLogs,
    adminRole,
    verifyOrderPayment,
    updateOrderFulfilment,
    updateAvailabilityRequest,
    adjustProductInventory,
    moderateReview,
  } = useStore();

  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  const pendingOrders = orders.filter((o) => o.paymentStatus === "pending");
  const paidRevenueGhs = paidOrders.reduce((sum, o) => sum + o.totalGhs, 0);

  // Calculate gross margin & inventory valuation (Owner/Admin only)
  const paidCostGhs = paidOrders.reduce((sum, o) => {
    return (
      sum +
      o.items.reduce((itemSum, item) => {
        const prod = products.find((p) => p.id === item.productId);
        return itemSum + (prod?.costPriceGhs ?? 0) * item.quantity;
      }, 0)
    );
  }, 0);
  const grossMarginGhs = paidRevenueGhs - paidCostGhs;
  const marginPercent =
    paidRevenueGhs > 0 ? Math.round((grossMarginGhs / paidRevenueGhs) * 100) : 0;

  const ownedInventoryRetailValue = products.reduce(
    (sum, p) => sum + p.priceGhs * p.ownedQtyAvailable,
    0
  );
  const ownedInventoryCostValue = products.reduce(
    (sum, p) => sum + p.costPriceGhs * p.ownedQtyAvailable,
    0
  );

  const pendingReviews = reviews.filter((r) => r.status === "pending");

  // ==========================================================================
  // VIEW 1: STAFF OPERATIONS & DISPATCH WORKBENCH (COMPLETELY DISTINCT)
  // ==========================================================================
  if (adminRole === "Staff") {
    return (
      <div className="min-h-screen bg-white text-black">
        <AdminNav />
        <div className="max-w-container mx-auto px-4 sm:px-6 pb-20 space-y-8">
          {/* Staff Role Definition & Daily Duties Matrix */}
          <section className="border-2 border-black bg-black/[0.02] p-6 rounded-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/15 pb-3">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                <h1 className="font-display font-bold text-xl uppercase tracking-tight">
                  Staff Operations, 25-Point Bench QA & Dispatch Workbench
                </h1>
              </div>
              <span className="px-2.5 py-1 bg-black text-white text-[11px] font-mono uppercase font-bold">
                OPERATIONAL SHIFT MODE • FINANCIALS LOCKED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 bg-white border border-black space-y-1">
                <span className="font-mono font-bold uppercase block">
                  Duty 01 • Bench QA & Packing
                </span>
                <p className="text-black/75 leading-relaxed">
                  Test battery cycle health (≥85%), SSD SMART status, ports, and original charger before packing any customer order.
                </p>
              </div>
              <div className="p-3.5 bg-white border border-black space-y-1">
                <span className="font-mono font-bold uppercase block">
                  Duty 02 • Courier & Rider Dispatch
                </span>
                <p className="text-black/75 leading-relaxed">
                  Hand off packed orders to Greater Accra riders or VIP/DHL nationwide couriers and update live tracking stages below.
                </p>
              </div>
              <div className="p-3.5 bg-white border border-black space-y-1">
                <span className="font-mono font-bold uppercase block">
                  Duty 03 • Customer Sourcing Desk
                </span>
                <p className="text-black/75 leading-relaxed">
                  Check partner availability for custom laptop requests and contact the customer via WhatsApp with lead times.
                </p>
              </div>
              <div className="p-3.5 bg-white border border-black space-y-1">
                <span className="font-mono font-bold uppercase block">
                  Duty 04 • Stock Count & Reviews
                </span>
                <p className="text-black/75 leading-relaxed">
                  Keep physical unit counts accurate as stock arrives and moderate customer product reviews for quality.
                </p>
              </div>
            </div>
          </section>

          {/* 3-Column Live Operational Kanban Workbench */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* COLUMN 1 (5 cols): Active Order Packing, 25-Point QA & Dispatch Queue */}
            <div className="lg:col-span-5 border-2 border-black bg-white rounded-sm overflow-hidden">
              <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
                <span className="font-mono text-xs uppercase font-bold inline-flex items-center gap-2">
                  <PackageCheck className="w-4 h-4" />
                  <span>1. Order Packing & Dispatch Queue ({orders.length})</span>
                </span>
                <Link
                  href="/admin/orders"
                  className="text-[11px] font-mono underline"
                >
                  Full View →
                </Link>
              </div>

              <div className="divide-y divide-black/15">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-4 space-y-3 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono font-bold text-sm block">
                          {ord.id}
                        </span>
                        <span className="text-black/75 font-medium">
                          Customer: {ord.customerName} ({ord.customerPhone})
                        </span>
                      </div>
                      <span className="px-2 py-0.5 bg-black text-white font-mono text-[10px] uppercase">
                        Stage: {ord.fulfilmentStatus}
                      </span>
                    </div>

                    <div className="p-2.5 bg-black/[0.03] border border-black/15 space-y-1 font-mono text-[11px]">
                      {ord.items.map((it, idx) => (
                        <div key={idx}>
                          • <strong>{it.quantity}× {it.name}</strong> ({it.condition})
                          <div className="text-black/65 pl-3">
                            Specs to Verify: {it.specsSnapshot}
                          </div>
                        </div>
                      ))}
                      <div className="pt-1 border-t border-black/10 text-black/80">
                        Zone: <strong>{ord.deliveryZone}</strong>
                      </div>
                    </div>

                    {/* Staff Fulfilment Stage Buttons */}
                    <div className="space-y-1.5">
                      <span className="font-mono text-[10px] uppercase text-black/60 block">
                        Update Dispatch Stage (Logs to Audit Trail):
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono text-[10px]">
                        {(
                          [
                            { id: "confirmed", label: "1. Confirmed" },
                            { id: "processing", label: "2. 25-Pt QA" },
                            { id: "out_for_delivery", label: "3. Dispatched" },
                            { id: "delivered", label: "4. Delivered" },
                          ] as { id: FulfilmentStatus; label: string }[]
                        ).map((st) => (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() =>
                              updateOrderFulfilment(
                                ord.id,
                                st.id,
                                `Staff updated stage to ${st.label}`
                              )
                            }
                            className={`py-1.5 px-2 border border-black uppercase rounded-sm ${
                              ord.fulfilmentStatus === st.id
                                ? "bg-black text-white font-bold"
                                : "bg-white text-black hover:bg-black/5"
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 2 (4 cols): Customer Device Sourcing & Availability Queue */}
            <div className="lg:col-span-4 border-2 border-black bg-white rounded-sm overflow-hidden">
              <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
                <span className="font-mono text-xs uppercase font-bold inline-flex items-center gap-2">
                  <FileQuestion className="w-4 h-4" />
                  <span>2. Customer Sourcing Queue ({requests.length})</span>
                </span>
                <Link
                  href="/admin/requests"
                  className="text-[11px] font-mono underline"
                >
                  Open Desk →
                </Link>
              </div>

              <div className="divide-y divide-black/15">
                {requests.map((req) => (
                  <div key={req.id} className="p-4 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-bold">{req.id}</span>
                      <span className="px-2 py-0.5 border border-black text-[10px] uppercase">
                        {req.status}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-sm">{req.productName}</p>
                      <p className="font-mono text-[11px] text-black/70">
                        Requested Specs: {req.desiredSpecs}
                      </p>
                      <p className="text-black/75 mt-1">
                        Client: <strong>{req.customerName}</strong> • {req.customerPhone}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-[10px]">
                      <button
                        type="button"
                        onClick={() =>
                          updateAvailabilityRequest(req.id, {
                            status: "Sourcing with Supplier",
                          })
                        }
                        className="px-2.5 py-1.5 border border-black uppercase hover:bg-black hover:text-white"
                      >
                        Mark Checking
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateAvailabilityRequest(req.id, {
                            status: "Quoted to Customer",
                          })
                        }
                        className="px-2.5 py-1.5 bg-black text-white uppercase"
                      >
                        Mark Quoted
                      </button>
                      <a
                        href={`https://wa.me/${req.customerPhone.replace(
                          /^0/,
                          "233"
                        )}?text=${encodeURIComponent(
                          `Hello ${req.customerName}, SAMCORE Operations Desk here regarding your request (${req.id}) for ${req.productName}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 border border-black uppercase inline-flex items-center gap-1 hover:bg-black hover:text-white"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp Client</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 3 (3 cols): Quick Physical Stock Counter & Review Queue */}
            <div className="lg:col-span-3 space-y-6">
              {/* Physical Stock Quick Counter */}
              <div className="border-2 border-black bg-white rounded-sm overflow-hidden">
                <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
                  <span className="font-mono text-xs uppercase font-bold inline-flex items-center gap-1.5">
                    <Boxes className="w-4 h-4" />
                    <span>3. Quick Stock Count</span>
                  </span>
                  <Link
                    href="/admin/inventory"
                    className="text-[11px] font-mono underline"
                  >
                    Ledger →
                  </Link>
                </div>
                <div className="divide-y divide-black/15 max-h-80 overflow-y-auto text-xs">
                  {products.slice(0, 6).map((p) => (
                    <div
                      key={p.id}
                      className="p-3 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="font-bold truncate">{p.shortTitle}</p>
                        <p className="font-mono text-[10px] text-black/60">
                          {p.sku}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 font-mono shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            adjustProductInventory(p.id, {
                              ownedQtyAvailable: Math.max(
                                0,
                                p.ownedQtyAvailable - 1
                              ),
                            })
                          }
                          className="w-6 h-6 border border-black flex items-center justify-center hover:bg-black hover:text-white"
                        >
                          -
                        </button>
                        <span className="w-7 text-center font-bold">
                          {p.ownedQtyAvailable}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            adjustProductInventory(p.id, {
                              ownedQtyAvailable: p.ownedQtyAvailable + 1,
                              supplyState: "OWNED_IN_STOCK",
                            })
                          }
                          className="w-6 h-6 border border-black flex items-center justify-center hover:bg-black hover:text-white"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Review Moderation Queue */}
              <div className="border-2 border-black bg-white rounded-sm overflow-hidden">
                <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
                  <span className="font-mono text-xs uppercase font-bold inline-flex items-center gap-1.5">
                    <Star className="w-4 h-4" />
                    <span>4. Review Queue ({pendingReviews.length})</span>
                  </span>
                  <Link
                    href="/admin/reviews"
                    className="text-[11px] font-mono underline"
                  >
                    All →
                  </Link>
                </div>
                <div className="p-4 space-y-3 text-xs">
                  {pendingReviews.length === 0 ? (
                    <p className="font-mono text-[11px] text-black/65 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                      <span>All submitted customer reviews have been moderated.</span>
                    </p>
                  ) : (
                    pendingReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-3 border border-black space-y-2"
                      >
                        <p className="font-bold">&ldquo;{rev.title}&rdquo;</p>
                        <p className="text-black/75">{rev.comment}</p>
                        <div className="flex gap-1.5 font-mono text-[10px]">
                          <button
                            type="button"
                            onClick={() => moderateReview(rev.id, "published")}
                            className="px-2.5 py-1 bg-black text-white uppercase"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => moderateReview(rev.id, "hidden")}
                            className="px-2.5 py-1 border border-black uppercase"
                          >
                            Hide
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // VIEW 2: EXECUTIVE OWNER / ADMIN COMMAND CENTER (FULL FINANCIAL & ERP VAULT)
  // ==========================================================================
  return (
    <div className="min-h-screen bg-white text-black">
      <AdminNav />
      <div className="max-w-container mx-auto px-4 sm:px-6 pb-20 space-y-10">
        {/* 1. Executive Owner Mandate & Exclusive Capabilities Matrix */}
        <section className="bg-black text-white p-6 sm:p-8 rounded-sm border-2 border-black space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/20 pb-5">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white text-black text-xs font-mono uppercase font-bold">
                <Shield className="w-3.5 h-3.5" />
                <span>EXECUTIVE OWNER COMMAND CENTER</span>
              </span>
              <h1 className="text-h1 text-white mt-2">
                Financial, Margin, Catalogue & Security Governance
              </h1>
              <p className="text-sm text-white/80 mt-1 max-w-3xl">
                This Executive Command Center is visible exclusively to the Owner/Administrator (<strong>samuel@samcore.gh</strong>). Here you control landed hardware costs, gross profit margins, catalogue pricing, settlement approvals, and security vault credentials.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/admin/products"
                className="bg-white text-black hover:bg-white/90 px-4 py-2.5 text-xs font-mono uppercase font-bold rounded-sm"
              >
                + Add / Price Laptops
              </Link>
              <Link
                href="/admin/suppliers"
                className="border border-white text-white hover:bg-white hover:text-black px-4 py-2.5 text-xs font-mono uppercase rounded-sm transition-colors"
              >
                Supplier Cost Ledger
              </Link>
              <Link
                href="/admin/settings"
                className="border border-white text-white hover:bg-white hover:text-black px-4 py-2.5 text-xs font-mono uppercase rounded-sm transition-colors"
              >
                Security Vault & WhatsApp
              </Link>
            </div>
          </div>

          {/* 4-Pillar Owner Exclusive Powers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <Link
              href="/admin/analytics"
              className="p-4 border border-white/30 hover:border-white rounded-sm space-y-1.5 transition-colors"
            >
              <div className="flex items-center justify-between font-mono uppercase text-white/70">
                <span>01 / FINANCIAL VAULT</span>
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <p className="font-display font-bold text-base text-white">
                Gross Profit & Unit Margins
              </p>
              <p className="text-white/75 leading-relaxed">
                Inspect landed supplier costs vs. GH₵ retail selling prices and track net profit per laptop sold.
              </p>
            </Link>

            <Link
              href="/admin/products"
              className="p-4 border border-white/30 hover:border-white rounded-sm space-y-1.5 transition-colors"
            >
              <div className="flex items-center justify-between font-mono uppercase text-white/70">
                <span>02 / CATALOGUE AUTHORITY</span>
                <Boxes className="w-4 h-4 text-white" />
              </div>
              <p className="font-display font-bold text-base text-white">
                Pricing & Supplier Allocations
              </p>
              <p className="text-white/75 leading-relaxed">
                Publish new laptops, lock GH₵ prices, and manage Owned vs. Partner Allocation stock states.
              </p>
            </Link>

            <Link
              href="/admin/payments"
              className="p-4 border border-white/30 hover:border-white rounded-sm space-y-1.5 transition-colors"
            >
              <div className="flex items-center justify-between font-mono uppercase text-white/70">
                <span>03 / TREASURY & REFUNDS</span>
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <p className="font-display font-bold text-base text-white">
                Settlement Approval & Refunds
              </p>
              <p className="text-white/75 leading-relaxed">
                Approve WhatsApp DM / MoMo order settlements and authorize stock-restoring customer refunds.
              </p>
            </Link>

            <Link
              href="/admin/settings"
              className="p-4 border border-white/30 hover:border-white rounded-sm space-y-1.5 transition-colors"
            >
              <div className="flex items-center justify-between font-mono uppercase text-white/70">
                <span>04 / SECURITY & STAFF</span>
                <KeyRound className="w-4 h-4 text-white" />
              </div>
              <p className="font-display font-bold text-base text-white">
                Passphrases & Audit Trail
              </p>
              <p className="text-white/75 leading-relaxed">
                Rotate Admin Master Passwords, configure WhatsApp 050 946 1505, and audit every Staff action.
              </p>
            </Link>
          </div>
        </section>

        {/* 2. Executive Financial & Valuation KPIs (Owner-Only Numbers) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 border-2 border-black bg-white rounded-sm">
            <span className="text-xs font-mono uppercase text-black/60">
              Verified Realized Revenue
            </span>
            <p className="text-3xl font-display font-bold mt-1">
              {formatGhs(paidRevenueGhs)}
            </p>
            <p className="text-xs font-mono text-black/70 mt-1">
              From {paidOrders.length} settled order(s) • {pendingOrders.length} pending
            </p>
          </div>

          <div className="p-5 border-2 border-black bg-black text-white rounded-sm">
            <span className="text-xs font-mono uppercase text-white/70">
              Net Gross Profit Margin (Owner Only)
            </span>
            <p className="text-3xl font-display font-bold mt-1">
              {formatGhs(grossMarginGhs)} ({marginPercent}%)
            </p>
            <p className="text-xs font-mono text-white/80 mt-1">
              Landed Hardware Cost: {formatGhs(paidCostGhs)}
            </p>
          </div>

          <div className="p-5 border-2 border-black bg-white rounded-sm">
            <span className="text-xs font-mono uppercase text-black/60">
              Owned Stock Retail Valuation
            </span>
            <p className="text-3xl font-display font-bold mt-1">
              {formatGhs(ownedInventoryRetailValue)}
            </p>
            <p className="text-xs font-mono text-black/70 mt-1">
              Landed Cost Basis: {formatGhs(ownedInventoryCostValue)}
            </p>
          </div>

          <div className="p-5 border-2 border-black bg-white rounded-sm">
            <span className="text-xs font-mono uppercase text-black/60">
              Pending WhatsApp DM / MoMo Orders
            </span>
            <p className="text-3xl font-display font-bold mt-1">
              {pendingOrders.length} Order(s)
            </p>
            <Link
              href="/admin/payments"
              className="text-xs font-mono underline font-bold mt-1 inline-block"
            >
              Approve Settlements →
            </Link>
          </div>
        </section>

        {/* 3. Owner Unit-Economics & Margin-Per-Laptop Matrix + Settlement Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left 7 cols: Confidential Unit Profit & Cost Table + Order Approvals */}
          <div className="lg:col-span-7 space-y-8">
            <div className="border-2 border-black rounded-sm overflow-hidden bg-white">
              <div className="px-5 py-3.5 bg-black text-white flex items-center justify-between">
                <span className="font-mono text-xs uppercase font-bold inline-flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Confidential Unit Cost vs. Net Profit Ledger (Owner Only)</span>
                </span>
                <Link
                  href="/admin/products"
                  className="text-xs font-mono underline"
                >
                  Edit Prices & Costs →
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-black bg-black/[0.04] font-mono uppercase">
                      <th className="p-3">Laptop SKU</th>
                      <th className="p-3">Retail (GH₵)</th>
                      <th className="p-3">Landed Cost</th>
                      <th className="p-3">Net Margin / Unit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/15 font-mono">
                    {products.slice(0, 6).map((p) => {
                      const unitProfit = p.priceGhs - p.costPriceGhs;
                      const pct = Math.round((unitProfit / p.priceGhs) * 100);
                      return (
                        <tr key={p.id} className="hover:bg-black/[0.02]">
                          <td className="p-3 font-sans">
                            <p className="font-bold text-black">{p.shortTitle}</p>
                            <p className="font-mono text-[10px] text-black/60">
                              {p.sku} • Avail: {p.ownedQtyAvailable}
                            </p>
                          </td>
                          <td className="p-3 font-bold">{formatGhs(p.priceGhs)}</td>
                          <td className="p-3 text-black/70">
                            {formatGhs(p.costPriceGhs)}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-black text-white font-bold">
                              +{formatGhs(unitProfit)} ({pct}%)
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Owner Settlement Verification Queue */}
            <div className="border-2 border-black rounded-sm overflow-hidden bg-white">
              <div className="px-5 py-3.5 bg-black text-white flex items-center justify-between">
                <h2 className="font-mono text-xs uppercase font-bold">
                  WhatsApp DM & Manual Order Settlement Approval Queue
                </h2>
                <Link
                  href="/admin/orders"
                  className="text-xs font-mono underline"
                >
                  All Orders →
                </Link>
              </div>
              <div className="divide-y divide-black/15">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="font-bold text-sm">{ord.id}</span>
                        <span
                          className={`px-2 py-0.5 border border-black uppercase ${
                            ord.paymentStatus === "paid"
                              ? "bg-black text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          Pay: {ord.paymentStatus}
                        </span>
                        <span className="px-2 py-0.5 border border-black uppercase">
                          Stage: {ord.fulfilmentStatus}
                        </span>
                      </div>
                      <p className="text-black/80">
                        {ord.customerName} ({ord.customerPhone}) •{" "}
                        <strong>{formatGhs(ord.totalGhs)}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {ord.paymentStatus === "pending" && (
                        <button
                          type="button"
                          onClick={() =>
                            verifyOrderPayment(
                              ord.id,
                              "Approved by Owner in Executive Command Center"
                            )
                          }
                          className="px-3 py-1.5 bg-black text-white font-mono uppercase rounded-sm hover:bg-black/85 font-bold"
                        >
                          Approve Payment
                        </button>
                      )}
                      <Link
                        href="/admin/orders"
                        className="px-3 py-1.5 border border-black font-mono uppercase rounded-sm hover:bg-black hover:text-white"
                      >
                        Inspect
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 5 cols: Immutable Security & Staff Audit Log */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border-2 border-black rounded-sm overflow-hidden bg-white">
              <div className="px-5 py-3.5 bg-black text-white flex items-center justify-between">
                <h2 className="font-mono text-xs uppercase font-bold">
                  Immutable Security & Staff Audit Log ({auditLogs.length})
                </h2>
                <Link
                  href="/admin/staff"
                  className="text-[11px] font-mono underline"
                >
                  Full Log →
                </Link>
              </div>
              <div className="divide-y divide-black/15 max-h-[520px] overflow-y-auto text-xs">
                {auditLogs.map((log, idx) => (
                  <div key={`${log.id}-${idx}`} className="p-4 space-y-1">
                    <div className="flex items-center justify-between font-mono text-[11px] text-black/60">
                      <span>{log.timestamp}</span>
                      <span className="px-1.5 py-0.5 border border-black/30 text-black font-bold">
                        {log.actor}
                      </span>
                    </div>
                    <p className="font-mono font-bold uppercase text-black">
                      {log.action} — {log.entityRef}
                    </p>
                    <p className="text-black/80">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
