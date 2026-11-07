"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  MessageSquare,
  ArrowRight,
  FileText,
  ArrowUpRight,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { formatGhs, getWhatsAppOrderSubmissionUrl } from "@/lib/utils";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const { orders, settings } = useStore();

  const order = orders.find((o) => o.id === orderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-container mx-auto px-4 py-16 text-center">
        <h1 className="text-h2">Order Reference Not Found</h1>
        <Link
          href="/track-order"
          className="mt-4 inline-block bg-black text-white px-5 py-2.5 text-xs font-mono uppercase"
        >
          Go to Order Lookup
        </Link>
      </div>
    );
  }

  const whatsappDmUrl = getWhatsAppOrderSubmissionUrl(settings, order);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="border-2 border-black bg-white p-6 sm:p-8 rounded-sm space-y-6">
        <div className="flex items-start justify-between gap-4 border-b border-black pb-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white text-xs font-mono uppercase">
              <CheckCircle2 className="w-4 h-4" />
              <span>Order Logged & Sent to WhatsApp DM</span>
            </span>
            <h1 className="text-h2">Order {order.id} Submitted</h1>
            <p className="text-xs font-mono text-black/70">
              Customer: {order.customerName} • Verification Phone:{" "}
              <strong>{order.customerPhone}</strong>
            </p>
          </div>
          <div className="text-right font-mono">
            <span className="text-xs uppercase text-black/60 block">
              Order Total
            </span>
            <span className="text-2xl font-display font-bold">
              {formatGhs(order.totalGhs)}
            </span>
          </div>
        </div>

        {/* Direct WhatsApp Action Banner */}
        <div className="p-5 bg-black text-white rounded-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs uppercase font-bold">
              Finalize Order in WhatsApp DM (+{settings.whatsappNumber})
            </h2>
            <span className="text-[11px] font-mono text-white/70">
              Auto-Formatted Message Ready
            </span>
          </div>
          <p className="text-xs text-white/85 leading-relaxed">
            If WhatsApp did not open automatically in a new tab, click the button below to launch your WhatsApp DM with all your selected device specifications and Order ID pre-filled.
          </p>
          <a
            href={whatsappDmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-white/90 py-3.5 px-5 text-xs font-mono uppercase font-bold tracking-wider rounded-sm transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open WhatsApp DM & Send Order Details Now</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Purchased Item & Specification Snapshots */}
        <div className="space-y-3">
          <h2 className="font-mono text-xs uppercase font-bold">
            Selected Device & Specification Snapshot
          </h2>
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 border border-black/25 flex items-center justify-between text-xs"
            >
              <div>
                <p className="font-bold text-sm">{item.name}</p>
                <p className="font-mono text-black/65 mt-0.5">
                  SKU: {item.sku} • Condition: {item.condition} • Warranty:{" "}
                  {item.warrantyMonths}M
                </p>
                <p className="font-mono text-black font-semibold mt-0.5">
                  Selected Specs: {item.specsSnapshot}
                </p>
              </div>
              <div className="text-right font-mono font-bold shrink-0">
                {item.quantity} × {formatGhs(item.unitPriceGhs)}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-black/15">
          <Link
            href={`/track-order?orderId=${encodeURIComponent(
              order.id
            )}&phone=${encodeURIComponent(order.customerPhone)}`}
            className="inline-flex items-center gap-2 bg-black text-white px-5 py-3 text-xs font-mono uppercase tracking-wider rounded-sm"
          >
            <span>Track Order Status</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white text-black border border-black px-5 py-3 text-xs font-mono uppercase tracking-wider rounded-sm hover:bg-black hover:text-white"
          >
            <FileText className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-container mx-auto px-4 py-16 text-center font-mono text-sm">
          Loading Order Confirmation...
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
