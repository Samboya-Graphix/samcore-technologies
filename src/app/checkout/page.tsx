"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { formatGhs, getWhatsAppOrderSubmissionUrl } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    products,
    settings,
    coupons,
    currentUser,
    placeOrder,
    showToast,
  } = useStore();

  const [customerName, setCustomerName] = useState(currentUser?.name || "");
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || "");
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || "");
  const [deliveryZoneId, setDeliveryZoneId] = useState(
    currentUser?.defaultZoneId || settings.deliveryZones[0].id
  );
  const [deliveryAddress, setDeliveryAddress] = useState(
    currentUser?.defaultAddress || ""
  );

  const [couponInput, setCouponInput] = useState("SAMCORE250");
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | undefined>(
    "SAMCORE250"
  );
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const cartLines = cart
    .map((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (!prod) return null;
      return {
        product: prod,
        quantity: item.quantity,
        selectedRam: item.selectedRam || prod.specs.ramText,
        selectedStorage: item.selectedStorage || prod.specs.storageText,
        unitPriceGhs: item.customUnitPriceGhs ?? prod.priceGhs,
      };
    })
    .filter(Boolean) as {
    product: (typeof products)[0];
    quantity: number;
    selectedRam: string;
    selectedStorage: string;
    unitPriceGhs: number;
  }[];

  const subtotalGhs = cartLines.reduce(
    (sum, line) => sum + line.unitPriceGhs * line.quantity,
    0
  );

  const selectedZone =
    settings.deliveryZones.find((z) => z.id === deliveryZoneId) ||
    settings.deliveryZones[0];

  const matchedCoupon = coupons.find(
    (c) =>
      c.active &&
      appliedCouponCode &&
      c.code.toUpperCase() === appliedCouponCode.toUpperCase()
  );

  const couponDiscount =
    matchedCoupon && subtotalGhs >= matchedCoupon.minOrderGhs
      ? matchedCoupon.discountType === "FIXED_GHS"
        ? matchedCoupon.value
        : Math.min(
            matchedCoupon.maxDiscountGhs,
            Math.round((subtotalGhs * matchedCoupon.value) / 100)
          )
      : 0;

  const loyaltyDiscount =
    redeemPoints * settings.loyaltyRedeemValueGhsPerPoint;
  const totalDiscount = couponDiscount + loyaltyDiscount;
  const finalTotalGhs = Math.max(
    0,
    subtotalGhs - totalDiscount + selectedZone.feeGhs
  );

  if (cartLines.length === 0) {
    return (
      <div className="max-w-container mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-h2">No Items in Order List</h1>
        <Link
          href="/shop"
          className="inline-block bg-black text-white px-6 py-3 text-xs font-mono uppercase"
        >
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const handleApplyCoupon = () => {
    const found = coupons.find(
      (c) => c.active && c.code.toUpperCase() === couponInput.trim().toUpperCase()
    );
    if (!found) {
      setErrorMsg("Invalid or expired coupon code.");
      setAppliedCouponCode(undefined);
      return;
    }
    if (subtotalGhs < found.minOrderGhs) {
      setErrorMsg(
        `Coupon ${found.code} requires a minimum subtotal of ${formatGhs(
          found.minOrderGhs
        )}.`
      );
      setAppliedCouponCode(undefined);
      return;
    }
    setErrorMsg(null);
    setAppliedCouponCode(found.code);
  };

  const handleSubmitWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) {
      setErrorMsg("Please acknowledge the SAMCORE Warranty & Terms of Sale.");
      return;
    }
    setErrorMsg(null);
    setIsProcessing(true);

    const result = placeOrder({
      customerName,
      customerEmail,
      customerPhone,
      deliveryZoneId,
      deliveryAddress,
      paymentMethod: "WHATSAPP_DM_ORDER",
      couponCode: appliedCouponCode,
      redeemPoints,
    });

    setIsProcessing(false);
    if (!result.ok || !result.order) {
      setErrorMsg(result.error || "Order validation failed.");
      return;
    }

    // Automatically open WhatsApp DM with full order and specification details
    const waUrl = getWhatsAppOrderSubmissionUrl(settings, result.order);
    showToast("Opening WhatsApp DM with your complete order & specification details...");
    window.open(waUrl, "_blank", "noopener,noreferrer");

    router.push(
      `/order/success?orderId=${encodeURIComponent(
        result.order.id
      )}&phone=${encodeURIComponent(result.order.customerPhone)}`
    );
  };

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="border-b border-black pb-5 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase text-black/60">
            DIRECT WHATSAPP DM ORDER SUBMISSION • 100% ONLINE PLATFORM
          </p>
          <h1 className="text-h1 mt-1">Complete Order via WhatsApp DM</h1>
        </div>
        <div className="text-xs font-mono">
          {currentUser ? (
            <span className="px-3 py-1.5 border border-black bg-black text-white">
              Signed In: {currentUser.name} ({currentUser.loyaltyPoints} pts)
            </span>
          ) : (
            <span className="px-3 py-1.5 border border-black">
              Ordering as Guest •{" "}
              <Link href="/login" className="underline font-bold">
                Sign In
              </Link>
            </span>
          )}
        </div>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="mb-6 p-4 border-2 border-black bg-white flex items-center gap-3 text-xs font-mono"
        >
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmitWhatsAppOrder}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* Left Form Steps (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Step 1: Customer Contact Details */}
          <section className="p-6 border border-black bg-white rounded-sm space-y-4">
            <h2 className="font-display font-bold text-lg uppercase tracking-wider border-b border-black/15 pb-2.5">
              1. Customer & Verification Contact
            </h2>
            <p className="text-xs text-black/70">
              Your details will be included automatically in the WhatsApp DM sent to our sales desk and used to generate your Order Reference ID.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase mb-1">
                  Full Name / Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g., Kofi Asante-Boateng"
                  className="w-full border border-black px-3.5 py-2.5 text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase mb-1">
                  Ghana Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g., 0244112233"
                  className="w-full border border-black px-3.5 py-2.5 text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase mb-1">
                  Email Address (For Warranty PDF) *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g., kofi@domain.com"
                  className="w-full border border-black px-3.5 py-2.5 text-sm bg-white"
                />
              </div>
            </div>
          </section>

          {/* Step 2: Nationwide Delivery Zone */}
          <section className="p-6 border border-black bg-white rounded-sm space-y-4">
            <h2 className="font-display font-bold text-lg uppercase tracking-wider border-b border-black/15 pb-2.5">
              2. Nationwide Delivery Zone & Address
            </h2>

            <div className="space-y-2.5">
              {settings.deliveryZones.map((zone) => (
                <label
                  key={zone.id}
                  className={`flex items-start justify-between gap-4 p-3.5 border rounded-sm cursor-pointer transition-colors ${
                    deliveryZoneId === zone.id
                      ? "border-2 border-black bg-black/[0.03]"
                      : "border-black/25 hover:border-black"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="deliveryZone"
                      checked={deliveryZoneId === zone.id}
                      onChange={() => setDeliveryZoneId(zone.id)}
                      className="mt-1 accent-black"
                    />
                    <div>
                      <span className="font-semibold text-sm block">
                        {zone.name}
                      </span>
                      <span className="text-xs text-black/65 font-mono">
                        Estimated Timing: {zone.eta}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-sm shrink-0">
                    {zone.feeGhs === 0 ? "FREE" : formatGhs(zone.feeGhs)}
                  </span>
                </label>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-mono uppercase mb-1">
                Detailed Delivery Address / Digital Address (GhanaPostGPS) *
              </label>
              <textarea
                rows={2}
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="e.g., GA-184-9021, House 14 Labone Crescent, Accra"
                className="w-full border border-black px-3.5 py-2 text-sm bg-white"
              />
            </div>
          </section>

          {/* Step 3: Automatic WhatsApp DM Submission Notice */}
          <section className="p-6 border-2 border-black bg-black text-white rounded-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 font-mono text-xs uppercase font-bold">
                <MessageSquare className="w-4 h-4" />
                <span>3. Automatic WhatsApp DM Order Submission</span>
              </span>
              <span className="px-2 py-0.5 bg-white text-black text-[10px] font-mono uppercase font-bold">
                Active Workflow
              </span>
            </div>
            <p className="text-xs text-white/85 leading-relaxed">
              On-site payment processing is turned off. When you click{" "}
              <strong>Submit Order & Open WhatsApp DM</strong>, your selected device(s), customized specifications (CPU, RAM, Storage), delivery address, and Order Reference ID will automatically open in a direct WhatsApp message to{" "}
              <strong>050 946 1505 (+{settings.whatsappNumber})</strong> so we can finalize payment and dispatch directly with you.
            </p>
            <div className="pt-2 flex flex-wrap gap-3 text-[11px] font-mono text-white/80">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Generates Tracking ID (#SMC-2026-XXXX)
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Sends Full Specs to WhatsApp DM
              </span>
            </div>
          </section>
        </div>

        {/* Right Order Review & Discounts (5 cols) */}
        <div className="lg:col-span-5">
          <div className="p-6 border-2 border-black bg-white rounded-sm space-y-5 sticky top-28">
            <h2 className="font-display font-bold text-lg uppercase tracking-wider border-b border-black pb-3">
              Selected Devices & Specifications
            </h2>

            {/* Line Item Snapshots with Selected Specs */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cartLines.map(
                ({
                  product,
                  quantity,
                  selectedRam,
                  selectedStorage,
                  unitPriceGhs,
                }) => (
                  <div
                    key={product.id}
                    className="flex items-start justify-between gap-3 text-xs border-b border-black/10 pb-2.5"
                  >
                    <div className="space-y-0.5">
                      <p className="font-bold text-black">{product.shortTitle}</p>
                      <p className="font-mono text-[11px] text-black/75">
                        Specs: {selectedRam} • {selectedStorage}
                      </p>
                      <p className="font-mono text-black/60">
                        Qty: {quantity} × {formatGhs(unitPriceGhs)} •{" "}
                        {product.condition}
                      </p>
                    </div>
                    <span className="font-mono font-bold shrink-0">
                      {formatGhs(unitPriceGhs * quantity)}
                    </span>
                  </div>
                )
              )}
            </div>

            {/* Coupon Input */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-mono uppercase">
                Discount Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter code (e.g. SAMCORE250)"
                  className="flex-1 border border-black px-3 py-2 text-xs font-mono uppercase bg-white"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-black text-white text-xs font-mono uppercase rounded-sm"
                >
                  Apply
                </button>
              </div>
              {appliedCouponCode && couponDiscount > 0 && (
                <p className="text-[11px] font-mono text-black flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                  <span>
                    Applied <strong>{appliedCouponCode}</strong> (-
                    {formatGhs(couponDiscount)})
                  </span>
                </p>
              )}
            </div>

            {/* Loyalty Points Redemption */}
            {currentUser && currentUser.loyaltyPoints > 0 && (
              <div className="p-3 border border-black/25 bg-black/[0.02] space-y-2 text-xs">
                <div className="flex items-center justify-between font-mono">
                  <span>
                    Redeem Loyalty Points (Max {currentUser.loyaltyPoints} pts)
                  </span>
                  <span className="font-bold">
                    -{formatGhs(loyaltyDiscount)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={currentUser.loyaltyPoints}
                  step={10}
                  value={redeemPoints}
                  onChange={(e) => setRedeemPoints(Number(e.target.value))}
                  className="w-full accent-black"
                />
              </div>
            )}

            {/* Totals Breakdown */}
            <div className="space-y-2 text-sm border-t border-black/15 pt-3">
              <div className="flex justify-between">
                <span className="text-black/75">Hardware Subtotal</span>
                <span className="font-mono">{formatGhs(subtotalGhs)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between font-semibold">
                  <span>Total Discounts (Coupon + Loyalty)</span>
                  <span className="font-mono">-{formatGhs(totalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-black/75">Delivery Fee</span>
                <span className="font-mono">
                  {selectedZone.feeGhs === 0
                    ? "FREE (Pickup)"
                    : formatGhs(selectedZone.feeGhs)}
                </span>
              </div>
              <div className="flex justify-between items-baseline border-t border-black pt-3">
                <span className="font-display font-bold text-base">
                  Total Estimate (GH₵)
                </span>
                <span className="font-display font-bold text-2xl">
                  {formatGhs(finalTotalGhs)}
                </span>
              </div>
            </div>

            {/* Consent Checkbox */}
            <label className="flex items-start gap-2.5 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 accent-black"
              />
              <span className="text-black/80">
                I confirm my selected specifications and accept SAMCORE TECHNOLOGIES&apos;{" "}
                <Link href="/policies/warranty" className="underline">
                  Warranty & Terms of Sale
                </Link>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full inline-flex items-center justify-center gap-2 bg-black text-white hover:bg-black/85 py-4 px-5 text-sm font-mono uppercase tracking-wider font-bold rounded-sm transition-colors disabled:opacity-50"
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>
                {isProcessing
                  ? "Preparing WhatsApp DM..."
                  : `Submit Order & Open WhatsApp DM (${formatGhs(finalTotalGhs)})`}
              </span>
              <ArrowUpRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
