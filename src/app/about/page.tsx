"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, Truck, Lock } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-10">
      <div className="border-b border-black pb-6">
        <span className="px-2.5 py-1 bg-black text-white text-xs font-mono uppercase">
          100% ONLINE STORE • ACCRA, GHANA
        </span>
        <h1 className="text-h1 mt-2">About SAMCORE TECHNOLOGIES</h1>
        <p className="text-base text-black/80 mt-2 leading-relaxed">
          SAMCORE TECHNOLOGIES is a premium online tech storefront delivering certified laptops, desktops, and computing hardware across Ghana. We offer verified stock, rigorous hardware testing, and direct WhatsApp customer ordering.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border border-black space-y-2">
          <ShieldCheck className="w-6 h-6" />
          <h2 className="text-h3">Verified Stock</h2>
          <p className="text-sm text-black/75 leading-relaxed">
            Real-time stock indicators on every item so you know what is ready for immediate dispatch.
          </p>
        </div>

        <div className="p-6 border border-black space-y-2">
          <CheckCircle2 className="w-6 h-6" />
          <h2 className="text-h3">25-Point QA Bench</h2>
          <p className="text-sm text-black/75 leading-relaxed">
            Every machine undergoes rigorous diagnostics: battery health, SSD SMART tests, display, and ports.
          </p>
        </div>

        <div className="p-6 border border-black space-y-2">
          <Lock className="w-6 h-6" />
          <h2 className="text-h3">Direct WhatsApp Ordering</h2>
          <p className="text-sm text-black/75 leading-relaxed">
            Configure your specs online and order directly via WhatsApp (050 946 1505) with zero hassle.
          </p>
        </div>

        <div className="p-6 border border-black space-y-2">
          <Truck className="w-6 h-6" />
          <h2 className="text-h3">Nationwide Delivery</h2>
          <p className="text-sm text-black/75 leading-relaxed">
            Same-day delivery across Greater Accra & Tema, and fast, secure courier delivery to all regions in Ghana.
          </p>
        </div>
      </div>

      <div className="p-6 bg-black text-white rounded-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-lg">
            Ready to find your next machine?
          </h3>
          <p className="text-xs text-white/80 mt-1">
            Browse our catalogue or message our team directly on WhatsApp (050 946 1505).
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/shop"
            className="bg-white text-black px-5 py-2.5 text-xs font-mono uppercase font-bold rounded-sm"
          >
            Browse Catalogue
          </Link>
          <Link
            href="/contact"
            className="border border-white px-5 py-2.5 text-xs font-mono uppercase rounded-sm"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
