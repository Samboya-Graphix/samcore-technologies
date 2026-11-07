"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Search,
  Lock,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { formatGhs, getWhatsAppEnquiryUrl } from "@/lib/utils";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const { orders, settings } = useStore();

  const [orderIdInput, setOrderIdInput] = useState(
    searchParams.get("orderId") || ""
  );
  const [verifyInput, setVerifyInput] = useState(
    searchParams.get("phone") || ""
  );
  const [submitted, setSubmitted] = useState(
    Boolean(searchParams.get("orderId"))
  );

  const matchedOrder = submitted
    ? orders.find((o) => {
        const idMatch =
          o.id.toUpperCase() === orderIdInput.trim().toUpperCase();
        const cleanVerify = verifyInput.trim().toLowerCase();
        const phoneMatch =
          o.customerPhone.replace(/\s+/g, "") ===
          cleanVerify.replace(/\s+/g, "");
        const emailMatch = o.customerEmail.toLowerCase() === cleanVerify;
        return idMatch && (phoneMatch || emailMatch);
      })
    : null;

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <nav aria-label="Breadcrumb" className="text-xs font-mono text-black/60 mb-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        / <span className="text-black font-semibold">Verified Order Tracking</span>
      </nav>

      <div className="border-b border-black pb-6 mb-8">
        <h1 className="text-h1">Track Your Order</h1>
        <p className="text-sm text-black/75 mt-1">
          Enter your Order Reference ID and registered phone number or email to view real-time status.
        </p>
      </div>

      {/* Verification Form */}
      <form
        onSubmit={handleLookup}
        className="p-6 border-2 border-black bg-white rounded-sm space-y-4 mb-8"
      >
        <div className="flex items-center justify-between text-xs font-mono text-black/70">
          <span className="inline-flex items-center gap-1.5 font-bold uppercase text-black">
            <Lock className="w-3.5 h-3.5" />
            <span>Identity Verification Required</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5">
            <label className="block text-xs font-mono uppercase mb-1">
              Order Reference ID *
            </label>
            <input
              type="text"
              required
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              placeholder="Enter Order ID"
              className="w-full border border-black px-3.5 py-2.5 text-sm font-mono uppercase bg-white"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="block text-xs font-mono uppercase mb-1">
              Registered Phone or Email *
            </label>
            <input
              type="text"
              required
              value={verifyInput}
              onChange={(e) => setVerifyInput(e.target.value)}
              placeholder="Enter phone number or email"
              className="w-full border border-black px-3.5 py-2.5 text-sm bg-white"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full bg-black text-white py-2.5 px-4 text-xs font-mono uppercase tracking-wider rounded-sm hover:bg-black/85 inline-flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Verify</span>
            </button>
          </div>
        </div>
      </form>

      {/* Lookup Result */}
      {submitted && !matchedOrder && (
        <div
          role="alert"
          className="p-8 border border-dashed border-black text-center space-y-3 bg-white"
        >
          <AlertTriangle className="w-8 h-8 mx-auto" />
          <h2 className="text-h3">Verification Mismatch or Order Not Found</h2>
          <p className="text-xs text-black/75 max-w-md mx-auto">
            We could not verify an order matching both{" "}
            <strong>{orderIdInput}</strong> and <strong>{verifyInput}</strong>. Please double-check your Order Reference and registered phone number or email.
          </p>
        </div>
      )}

      {matchedOrder && (
        <div className="border border-black bg-white rounded-sm p-6 sm:p-8 space-y-8">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black pb-5">
            <div>
              <span className="text-xs font-mono uppercase px-2 py-0.5 bg-black text-white">
                Verified Order Record
              </span>
              <h2 className="text-h2 mt-2">{matchedOrder.id}</h2>
              <p className="text-xs font-mono text-black/70 mt-1">
                Recipient: {matchedOrder.customerName} • Zone:{" "}
                {matchedOrder.deliveryZone}
              </p>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs uppercase text-black/60 block">
                Total Amount
              </span>
              <span className="text-2xl font-display font-bold">
                {formatGhs(matchedOrder.totalGhs)}
              </span>
              <span className="text-[11px] text-black/60 block">
                Method: {matchedOrder.paymentMethod.replace(/_/g, " ")}
              </span>
            </div>
          </div>

          {/* 3 Independent Status Dimensions (Section 6.3) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 border border-black bg-black/[0.02]">
              <span className="text-[10px] font-mono uppercase text-black/60 block">
                Payment Status
              </span>
              <div className="flex items-center gap-1.5 mt-1 font-mono font-bold text-sm uppercase">
                {matchedOrder.paymentStatus === "paid" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
                <span>{matchedOrder.paymentStatus}</span>
              </div>
              {matchedOrder.paymentProviderRef && (
                <p className="text-[11px] font-mono text-black/60 mt-1 truncate">
                  Ref: {matchedOrder.paymentProviderRef}
                </p>
              )}
            </div>

            <div className="p-4 border border-black bg-black/[0.02]">
              <span className="text-[10px] font-mono uppercase text-black/60 block">
                Fulfilment Stage
              </span>
              <p className="font-mono font-bold text-sm uppercase mt-1">
                {matchedOrder.fulfilmentStatus}
              </p>
              <p className="text-[11px] font-mono text-black/60 mt-1">
                Placed → Confirmed → Processing → Dispatched → Delivered
              </p>
            </div>

            <div className="p-4 border border-black bg-black/[0.02]">
              <span className="text-[10px] font-mono uppercase text-black/60 block">
                Inventory Allocation
              </span>
              <p className="font-mono font-bold text-sm uppercase mt-1">
                {matchedOrder.availabilityStatus.replace(/_/g, " ")}
              </p>
              <p className="text-[11px] font-mono text-black/60 mt-1">
                Stock locked in ledger
              </p>
            </div>
          </div>

          {/* Vertical Status Timeline (Section 7.06) */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-base uppercase tracking-wider">
              Audit & Fulfilment Timeline
            </h3>
            <div className="border-l-2 border-black pl-5 space-y-5">
              {matchedOrder.events.map((evt) => (
                <div key={evt.id} className="relative">
                  <div className="w-3 h-3 bg-black border-2 border-white absolute -left-[27px] top-1" />
                  <p className="text-xs font-mono text-black/60">
                    {evt.timestamp} • {evt.actor}
                  </p>
                  <p className="font-display font-bold text-sm mt-0.5">
                    {evt.title}
                  </p>
                  <p className="text-xs text-black/80 mt-0.5">{evt.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Support Footer */}
          <div className="pt-4 border-t border-black/15 flex flex-wrap items-center justify-between gap-4 text-xs">
            <span className="font-mono text-black/70">
              Need delivery rider coordination or VAT invoice?
            </span>
            <a
              href={getWhatsAppEnquiryUrl(
                settings,
                undefined,
                `Hello SAMCORE, I am following up on Verified Order ${matchedOrder.id} (${matchedOrder.customerName}).`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-black font-mono uppercase hover:bg-black hover:text-white rounded-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Dispatch Desk</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-container mx-auto px-4 py-16 text-center font-mono text-sm">
          Loading Order Lookup...
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
