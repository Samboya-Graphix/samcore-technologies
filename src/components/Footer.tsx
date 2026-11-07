"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  FileCheck2,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { triggerAnnouncementFlyer } from "@/components/FlyerModal";

export function Footer() {
  const pathname = usePathname();
  const { settings } = useStore();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-black text-white border-t border-black mt-20">
      {/* Top Monochrome Trust Banner */}
      <div className="border-b border-white/15">
        <div className="max-w-container mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xs uppercase tracking-wider">
                Verified Hardware
              </h3>
              <p className="text-[11px] text-white/70 mt-0.5">
                Every unit tested &amp; backed by warranty.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-white flex items-center justify-center shrink-0">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xs uppercase tracking-wider">
                Direct WhatsApp Ordering
              </h3>
              <p className="text-[11px] text-white/70 mt-0.5">
                Select specs and order directly via 050 946 1505.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-white flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xs uppercase tracking-wider">
                Nationwide Delivery
              </h3>
              <p className="text-[11px] text-white/70 mt-0.5">
                Fast, insured courier dispatch across Ghana.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-container mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-sm">
        {/* Col 1-2: Brand & Online Platform Contact */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-display font-bold text-base">
              SC
            </div>
            <div>
              <span className="font-display font-bold text-base tracking-tight block leading-none">
                {settings.storeName}
              </span>
              <span className="font-mono text-[10px] tracking-[0.2em] text-white/70 uppercase">
                {settings.tagline}
              </span>
            </div>
          </div>
          <p className="text-xs text-white/75 max-w-sm leading-relaxed">
            100% online platform for enterprise laptops, Apple MacBooks, and creator workstations in Ghana.
          </p>
          <div className="space-y-2 text-xs text-white/85 font-mono pt-1">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{settings.showroomAddress}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 shrink-0" />
              <span>050 946 1505 / {settings.supportPhone} (WhatsApp & Voice)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 shrink-0" />
              <span>{settings.supportEmail}</span>
            </div>
          </div>
        </div>

        {/* Col 3: Storefront & Shopping */}
        <div className="space-y-3">
          <h4 className="font-mono text-xs uppercase tracking-widest text-white/60">
            Storefront
          </h4>
          <ul className="space-y-2 text-xs text-white/85">
            <li>
              <Link href="/shop" className="hover:underline">
                Full Product Catalogue
              </Link>
            </li>
            <li>
              <Link href="/categories" className="hover:underline">
                Browse Categories
              </Link>
            </li>
            <li>
              <Link href="/laptop-finder" className="hover:underline">
                Guided Laptop Finder
              </Link>
            </li>
            <li>
              <Link href="/compare" className="hover:underline">
                Compare Laptops (Up to 3)
              </Link>
            </li>
            <li>
              <Link href="/deals" className="hover:underline">
                Promotions & Discount Coupons
              </Link>
            </li>
            <li>
              <Link href="/request-device" className="hover:underline">
                Request Unlisted Device
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={triggerAnnouncementFlyer}
                className="inline-flex items-center gap-1.5 hover:underline text-left text-white/70 hover:text-white transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>View Campus Notice & Flyer</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Customer Account & Orders */}
        <div className="space-y-3">
          <h4 className="font-mono text-xs uppercase tracking-widest text-white/60">
            Account & Orders
          </h4>
          <ul className="space-y-2 text-xs text-white/85">
            <li>
              <Link href="/track-order" className="hover:underline">
                Verified Order Lookup
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:underline">
                Customer Account Overview
              </Link>
            </li>
            <li>
              <Link href="/account/orders" className="hover:underline">
                Purchase & Warranty History
              </Link>
            </li>
            <li>
              <Link href="/account/wishlist" className="hover:underline">
                Saved Wishlist & Restock Alerts
              </Link>
            </li>
            <li>
              <Link href="/account/rewards" className="hover:underline">
                SAMCORE Loyalty Ledger & Reviews
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:underline">
                Sign In / Register
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 5: Policies, Support & Admin */}
        <div className="space-y-3">
          <h4 className="font-mono text-xs uppercase tracking-widest text-white/60">
            Governance & Policies
          </h4>
          <ul className="space-y-2 text-xs text-white/85">
            <li>
              <Link href="/about" className="hover:underline">
                About SAMCORE Technologies
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact & WhatsApp Support Desk
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:underline">
                Frequently Asked Questions
              </Link>
            </li>
            <li>
              <Link href="/policies/warranty" className="hover:underline">
                Hardware Warranty & Returns Policy
              </Link>
            </li>
            <li>
              <Link href="/policies/delivery" className="hover:underline">
                Ghana Delivery Zones & Fees
              </Link>
            </li>
            <li>
              <Link href="/policies/privacy" className="hover:underline">
                Privacy & Terms of Sale
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-white/15">
        <div className="max-w-container mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-white/60">
          <p>
            © {new Date().getFullYear()} SAMCORE TECHNOLOGIES LTD (GHANA). ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
