"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Laptop,
  Boxes,
  Truck,
  ShoppingCart,
  CreditCard,
  FileQuestion,
  Users,
  Star,
  Tag,
  BarChart3,
  Settings,
  Shield,
  Lock,
  LogOut,
  ExternalLink,
  ClipboardCheck,
  Wrench,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";

const OWNER_ADMIN_LINKS = [
  { href: "/admin", label: "Executive Command", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Revenue & Margins", icon: BarChart3 },
  { href: "/admin/products", label: "Catalogue & Pricing", icon: Laptop },
  { href: "/admin/inventory", label: "Inventory Ledger", icon: Boxes },
  { href: "/admin/suppliers", label: "Suppliers & Costs", icon: Truck },
  { href: "/admin/orders", label: "Orders & Dispatch", icon: ShoppingCart },
  { href: "/admin/payments", label: "Settlements & Refunds", icon: CreditCard },
  { href: "/admin/requests", label: "Sourcing Desk", icon: FileQuestion },
  { href: "/admin/promotions", label: "Coupons & Loyalty", icon: Tag },
  { href: "/admin/customers", label: "Customer Directory", icon: Users },
  { href: "/admin/reviews", label: "Reviews Moderation", icon: Star },
  { href: "/admin/settings", label: "Security & Settings", icon: Settings },
];

const STAFF_OPERATIONAL_LINKS = [
  { href: "/admin", label: "Staff Task Workbench", icon: ClipboardCheck },
  { href: "/admin/orders", label: "1. Pack & Dispatch Orders", icon: ShoppingCart },
  { href: "/admin/requests", label: "2. Customer Sourcing Desk", icon: FileQuestion },
  { href: "/admin/inventory", label: "3. Physical Stock Count", icon: Boxes },
  { href: "/admin/reviews", label: "4. Moderate Reviews", icon: Star },
];

export function AdminNav() {
  const pathname = usePathname();
  const {
    adminRole,
    adminAuthEmail,
    setAdminRole,
    lockAdminPortal,
    orders,
    requests,
    reviews,
  } = useStore();

  const pendingOrdersCount = orders.filter(
    (o) => o.fulfilmentStatus === "placed" || o.fulfilmentStatus === "confirmed"
  ).length;
  const openRequestsCount = requests.filter(
    (r) => r.status === "New Enquiry" || r.status === "Sourcing with Supplier"
  ).length;
  const pendingReviewsCount = reviews.filter(
    (r) => r.status === "pending"
  ).length;

  // ============================================================================
  // LAYOUT A: OWNER / EXECUTIVE ADMIN COMMAND HEADER (INVERTED BLACK TERMINAL)
  // ============================================================================
  if (adminRole === "Owner/Admin") {
    return (
      <header className="bg-black text-white border-b-2 border-black mb-8">
        <div className="max-w-container mx-auto px-4 sm:px-6 py-4 space-y-4">
          {/* Top Executive Telemetry Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/20 pb-3.5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-display font-bold text-sm tracking-tighter">
                SC
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-sm sm:text-base tracking-tight uppercase text-white">
                    SAMCORE EXECUTIVE ADMIN VAULT
                  </span>
                  <span className="px-2 py-0.5 bg-white text-black text-[10px] font-mono uppercase font-bold">
                    FULL OWNER AUTHORITY
                  </span>
                </div>
                <p className="text-[11px] font-mono text-white/70">
                  Identity: {adminAuthEmail || "samuel@samcore.gh"} • Financial Margins, Supplier Costs, Pricing & Security Controls Active
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/40 hover:border-white text-white rounded-sm transition-colors"
              >
                <span>Live Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => setAdminRole("Staff")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/40 hover:bg-white hover:text-black text-white uppercase rounded-sm transition-colors"
                title="Switch to the Staff Fulfilment Workbench view"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Switch to Staff Workbench View</span>
              </button>

              <button
                type="button"
                onClick={lockAdminPortal}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-black hover:bg-white/90 uppercase font-bold rounded-sm transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out & Lock</span>
              </button>
            </div>
          </div>

          {/* Owner 12-Module Command Matrix Navigation */}
          <nav
            aria-label="Owner Executive Navigation"
            className="flex flex-wrap items-center gap-1.5"
          >
            {OWNER_ADMIN_LINKS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase border rounded-sm transition-colors ${
                    isActive
                      ? "bg-white text-black border-white font-bold"
                      : "bg-black text-white/85 border-white/25 hover:border-white hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
    );
  }

  // ============================================================================
  // LAYOUT B: STAFF FULFILMENT & QA WORKBENCH HEADER (TACTICAL DISPATCH DESK)
  // ============================================================================
  return (
    <header className="bg-white text-black border-b-4 border-black mb-8">
      {/* Top Restricted Staff Notice Strip */}
      <div className="bg-black text-white px-4 sm:px-6 py-2 text-[11px] font-mono">
        <div className="max-w-container mx-auto flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 uppercase font-bold">
            <Wrench className="w-3.5 h-3.5" />
            <span>
              SAMCORE STAFF OPERATIONS WORKBENCH • DISPATCH, 25-POINT QA & SOURCING DESK
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-white/80">
            <Lock className="w-3 h-3" />
            <span>
              RESTRICTED SESSION: Supplier Costs, Profit Margins, Refunds & Store Settings Hidden
            </span>
          </span>
        </div>
      </div>

      <div className="max-w-container mx-auto px-4 sm:px-6 py-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/15 pb-3.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 border-2 border-black font-mono text-xs uppercase font-bold">
                STAFF DUTY TERMINAL
              </span>
              <span className="text-xs font-mono text-black/70">
                Operator: <strong>{adminAuthEmail || "staff@samcore.gh"}</strong>
              </span>
            </div>
            <p className="text-xs text-black/75 mt-1">
              Your daily shift tasks: Pack & dispatch customer orders, run 25-point laptop QA checks, answer device availability requests, and update physical stock counts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* Quick Shift Task Counters */}
            <span className="px-2.5 py-1.5 bg-black/[0.04] border border-black">
              To Dispatch: <strong>{pendingOrdersCount}</strong>
            </span>
            <span className="px-2.5 py-1.5 bg-black/[0.04] border border-black">
              Sourcing Quotes: <strong>{openRequestsCount}</strong>
            </span>
            <span className="px-2.5 py-1.5 bg-black/[0.04] border border-black">
              Reviews: <strong>{pendingReviewsCount}</strong>
            </span>

            {adminAuthEmail === "samuel@samcore.gh" && (
              <button
                type="button"
                onClick={() => setAdminRole("Owner/Admin")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white uppercase font-bold rounded-sm"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Return to Owner Vault</span>
              </button>
            )}

            <Link
              href="/"
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-black hover:bg-black hover:text-white uppercase rounded-sm transition-colors"
            >
              <span>Storefront</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              type="button"
              onClick={lockAdminPortal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-black text-white hover:bg-black/85 uppercase font-bold rounded-sm transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>End Shift / Sign Out</span>
            </button>
          </div>
        </div>

        {/* Staff 5-Tab Operational Workbench Bar */}
        <nav
          aria-label="Staff Operational Navigation"
          className="flex flex-wrap items-center gap-2"
        >
          {STAFF_OPERATIONAL_LINKS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase border-2 rounded-sm transition-colors ${
                  isActive
                    ? "bg-black text-white border-black font-bold"
                    : "bg-white text-black border-black hover:bg-black/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
