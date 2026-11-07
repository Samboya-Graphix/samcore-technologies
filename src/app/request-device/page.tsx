"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FileQuestion,
  CheckCircle2,
  MessageSquare,
  Clock,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { ProductCondition } from "@/lib/types";
import { formatGhs, getWhatsAppEnquiryUrl } from "@/lib/utils";

function RequestDeviceContent() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product") || "";
  const { products, submitAvailabilityRequest, settings } = useStore();

  const preselectedProduct = products.find((p) => p.slug === productSlug);

  const [productName, setProductName] = useState(
    preselectedProduct?.name || ""
  );
  const [desiredSpecs, setDesiredSpecs] = useState(
    preselectedProduct
      ? `${preselectedProduct.specs.processor}, ${preselectedProduct.specs.ramText}, ${preselectedProduct.specs.storageText}`
      : ""
  );
  const [conditionPreference, setConditionPreference] = useState<
    ProductCondition | "Any"
  >(preselectedProduct?.condition || "Any");
  const [budgetGhs, setBudgetGhs] = useState<number>(
    preselectedProduct?.priceGhs || 15000
  );
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [createdRecordId, setCreatedRecordId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record = submitAvailabilityRequest({
      productId: preselectedProduct?.id,
      productName,
      desiredSpecs,
      conditionPreference,
      budgetGhs,
      customerName,
      customerPhone,
      customerEmail,
      notes,
    });
    setCreatedRecordId(record.id);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <nav aria-label="Breadcrumb" className="text-xs font-mono text-black/60 mb-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        /{" "}
        <span className="text-black font-semibold">
          Supplier Availability & Custom Device Request
        </span>
      </nav>

      <div className="border-b border-black pb-6 mb-8">
        <span className="px-2.5 py-1 bg-black text-white text-xs font-mono uppercase">
          DEVICE SOURCING
        </span>
        <h1 className="text-h1 mt-2">Request Device Availability</h1>
        <p className="text-sm text-black/80 mt-1">
          Looking for a specific model or custom specs not in our catalogue? Submit your request below and our Accra desk will confirm price and availability.
        </p>
      </div>

      {createdRecordId ? (
        <div className="p-8 border-2 border-black bg-white rounded-sm space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-xs font-mono uppercase">
            <CheckCircle2 className="w-4 h-4" />
            <span>Request Logged: {createdRecordId}</span>
          </div>
          <h2 className="text-h2">Request Received</h2>
          <p className="text-sm text-black/80 leading-relaxed">
            We are checking stock manifests for <strong>{productName}</strong>. You will receive a verified quotation and availability update directly on WhatsApp or Email.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={getWhatsAppEnquiryUrl(
                settings,
                undefined,
                `Hello SAMCORE, I just submitted Availability Request ${createdRecordId} for ${productName} (Budget: ${formatGhs(
                  budgetGhs
                )}).`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-black text-white px-5 py-3 text-xs font-mono uppercase rounded-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send Reference on WhatsApp</span>
            </a>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-white text-black border border-black px-5 py-3 text-xs font-mono uppercase rounded-sm"
            >
              <span>Browse Full Catalogue →</span>
            </Link>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-8 border border-black bg-white rounded-sm space-y-5"
        >
          <div>
            <label className="block text-xs font-mono uppercase mb-1">
              Laptop / Device Model Name *
            </label>
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g., ASUS ROG Zephyrus G16 or MacBook Pro 16 M3 Max"
              className="w-full border border-black px-3.5 py-2.5 text-sm bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase mb-1">
              Required Technical Specifications (CPU, RAM, Storage, GPU) *
            </label>
            <input
              type="text"
              required
              value={desiredSpecs}
              onChange={(e) => setDesiredSpecs(e.target.value)}
              placeholder="e.g., Minimum 32GB RAM, 1TB NVMe SSD, Dedicated RTX 4070"
              className="w-full border border-black px-3.5 py-2.5 text-sm bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase mb-1">
                Condition Preference
              </label>
              <select
                value={conditionPreference}
                onChange={(e) =>
                  setConditionPreference(
                    e.target.value as ProductCondition | "Any"
                  )
                }
                className="w-full border border-black px-3.5 py-2.5 text-sm bg-white"
              >
                <option value="Any">Any Verified Grade</option>
                <option value="Brand New">Brand New (Factory Sealed)</option>
                <option value="UK Used (Grade A)">UK Used (Grade A)</option>
                <option value="Factory Refurbished">Factory Refurbished</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase mb-1">
                Target Budget in Ghana Cedi (GH₵) *
              </label>
              <input
                type="number"
                required
                min={1000}
                step={100}
                value={budgetGhs}
                onChange={(e) => setBudgetGhs(Number(e.target.value))}
                className="w-full border border-black px-3.5 py-2.5 text-sm font-mono bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-black/15">
            <div>
              <label className="block text-xs font-mono uppercase mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full Name / Organization"
                className="w-full border border-black px-3 py-2 text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase mb-1">
                WhatsApp / Phone *
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="024 XXX XXXX"
                className="w-full border border-black px-3 py-2 text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full border border-black px-3 py-2 text-sm bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase mb-1">
              Additional Sourcing Notes / Urgency / Quantity
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Let us know your timeline, software requirements (e.g., AutoCAD, Lumion, Xcode), or corporate bulk quantity..."
              className="w-full border border-black px-3.5 py-2 text-sm bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white hover:bg-black/85 py-3.5 px-6 text-xs font-mono uppercase tracking-wider rounded-sm"
          >
            Submit Availability & Quote Request
          </button>
        </form>
      )}
    </div>
  );
}

export default function RequestDevicePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-container mx-auto px-4 py-16 text-center font-mono text-sm">
          Loading Sourcing Request Form...
        </div>
      }
    >
      <RequestDeviceContent />
    </Suspense>
  );
}
