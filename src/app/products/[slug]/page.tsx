"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ShoppingBag,
  MessageSquare,
  Heart,
  Scale,
  CheckCircle2,
  FileQuestion,
  Bell,
  Star,
  Cpu,
  HardDrive,
  Truck,
  ArrowUpRight,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { SupplyStatusBadge } from "@/components/SupplyStatusBadge";
import {
  formatGhs,
  canImmediateCheckout,
  getMaxReservableQty,
  getWhatsAppEnquiryUrl,
  isProductOutOfStock,
} from "@/lib/utils";
import { ProductCard } from "@/components/ProductCard";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const {
    products,
    addToCart,
    compareIds,
    toggleCompare,
    wishlistIds,
    toggleWishlist,
    subscribeRestockAlert,
    reviews,
    submitCustomerReview,
    settings,
    showToast,
  } = useStore();

  const product = products.find((p) => p.slug === params?.slug);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [qty, setQty] = useState(1);

  // Interactive Specification Selectors (RAM, Storage, Delivery Preference)
  const isAccessory = product?.categorySlug === "monitors-accessories";

  const ramOptions = product
    ? isAccessory
      ? [{ label: product.specs.ramText, priceDeltaGhs: 0 }]
      : product.brand === "Apple"
      ? [
          { label: `${product.specs.ramText} (Factory Config)`, priceDeltaGhs: 0 },
          { label: "36GB / 32GB Unified Memory Config", priceDeltaGhs: 3200 },
        ]
      : [
          { label: `${product.specs.ramText} (Standard)`, priceDeltaGhs: 0 },
          ...(product.specs.ramGb < 32
            ? [{ label: "32GB Dual-Channel RAM Upgrade", priceDeltaGhs: 950 }]
            : []),
          ...(product.specs.ramGb < 64
            ? [{ label: "64GB Workstation RAM Upgrade", priceDeltaGhs: 2200 }]
            : []),
        ]
    : [];

  const storageOptions = product
    ? isAccessory
      ? [{ label: product.specs.storageText, priceDeltaGhs: 0 }]
      : [
          { label: `${product.specs.storageText} (Standard)`, priceDeltaGhs: 0 },
          ...(product.specs.storageGb < 1000
            ? [{ label: "1TB PCIe Gen4 NVMe SSD Upgrade", priceDeltaGhs: 850 }]
            : []),
          ...(product.specs.storageGb < 2000
            ? [{ label: "2TB PCIe Gen4 NVMe SSD Upgrade", priceDeltaGhs: 1950 }]
            : []),
        ]
    : [];

  const [selectedRamIdx, setSelectedRamIdx] = useState(0);
  const [selectedStorageIdx, setSelectedStorageIdx] = useState(0);
  const [selectedZoneId, setSelectedZoneId] = useState(
    settings.deliveryZones[0]?.id || "accra-metro"
  );
  const [customNote, setCustomNote] = useState("");

  const [alertContact, setAlertContact] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  if (!product) {
    return (
      <div className="max-w-container mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-h2">Product Listing Not Found</h1>
        <Link
          href="/shop"
          className="inline-block bg-black text-white px-5 py-2.5 text-xs font-mono uppercase"
        >
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const outOfStock = isProductOutOfStock(product);
  const eligible = canImmediateCheckout(product);
  const maxQty = Math.max(1, getMaxReservableQty(product));
  const isCompared = compareIds.includes(product.id);
  const isWishlisted = wishlistIds.includes(product.id);

  const chosenRam = ramOptions[selectedRamIdx] || ramOptions[0];
  const chosenStorage = storageOptions[selectedStorageIdx] || storageOptions[0];
  const chosenZone =
    settings.deliveryZones.find((z) => z.id === selectedZoneId) ||
    settings.deliveryZones[0];

  const computedUnitPriceGhs =
    product.priceGhs +
    (chosenRam?.priceDeltaGhs ?? 0) +
    (chosenStorage?.priceDeltaGhs ?? 0);
  const totalEstimatedGhs = computedUnitPriceGhs * qty;

  // Build automatic WhatsApp DM URL with exact selected specifications
  const whatsappOrderUrl = getWhatsAppEnquiryUrl(
    settings,
    product,
    undefined,
    {
      selectedRam: chosenRam?.label,
      selectedStorage: chosenStorage?.label,
      selectedDeliveryZone: `${chosenZone.name} (${
        chosenZone.feeGhs === 0 ? "FREE" : formatGhs(chosenZone.feeGhs)
      })`,
      quantity: qty,
      computedUnitPriceGhs,
      customerNote: customNote.trim() || undefined,
    }
  );

  const productReviews = reviews.filter(
    (r) => r.productId === product.id && r.status === "published"
  );

  const relatedProducts = products
    .filter(
      (p) =>
        p.published &&
        p.id !== product.id &&
        (p.categorySlug === product.categorySlug || p.brand === product.brand)
    )
    .slice(0, 3);

  const handleOrderViaWhatsApp = () => {
    showToast("Opening WhatsApp DM with your selected device & specifications...");
    window.open(whatsappOrderUrl, "_blank", "noopener,noreferrer");
  };

  const handleAddToCartWithSpecs = () => {
    addToCart(product.id, qty, {
      selectedRam: chosenRam?.label,
      selectedStorage: chosenStorage?.label,
      customUnitPriceGhs: computedUnitPriceGhs,
    });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) return;
    submitCustomerReview(product.id, reviewRating, reviewTitle, reviewComment);
    setReviewTitle("");
    setReviewComment("");
  };

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs font-mono text-black/60 mb-6">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/shop" className="hover:underline">
          Catalogue
        </Link>{" "}
        /{" "}
        <Link
          href={`/categories/${product.categorySlug}`}
          className="hover:underline"
        >
          {product.categoryName}
        </Link>{" "}
        / <span className="text-black font-semibold">{product.shortTitle}</span>
      </nav>

      {/* Top 2-Column Product Hero (Section 7.03) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-black">
        {/* Left: Image Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[16/11] w-full border border-black bg-black/[0.02] rounded-sm overflow-hidden">
            <img
              src={product.images[selectedImageIdx] || product.images[0]}
              alt={product.name}
              className={`w-full h-full object-cover ${
                outOfStock ? "opacity-65 grayscale" : ""
              }`}
            />
            {outOfStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="bg-black text-white border-2 border-white px-6 py-3 text-center shadow-sm">
                  <p className="font-mono text-sm font-bold uppercase tracking-widest">
                    OUT OF STOCK
                  </p>
                  <p className="font-mono text-[11px] text-white/80 uppercase mt-0.5">
                    Currently Unavailable — Restock Pending
                  </p>
                </div>
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex items-center gap-3 flex-wrap">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-24 aspect-[16/10] border rounded-sm overflow-hidden ${
                    selectedImageIdx === idx
                      ? "border-2 border-black"
                      : "border-black/25 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.shortTitle} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Key Highlights */}
          <div className="p-4 border border-black/20 bg-white space-y-2">
            <p className="text-xs font-mono uppercase font-bold">
              Key Hardware Highlights
            </p>
            <ul className="space-y-1.5 text-xs">
              {product.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Model, Specification Configurator & Automatic WhatsApp DM Submit (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 border border-black uppercase font-bold">
                  {product.condition}
                </span>
                {outOfStock && (
                  <span className="px-2.5 py-1 bg-black text-white uppercase font-bold">
                    OUT OF STOCK
                  </span>
                )}
              </div>
              <span className="text-black/60">SKU: {product.sku}</span>
            </div>

            <h1 className="text-h2 leading-tight">{product.name}</h1>

            <div className="pt-1">
              <SupplyStatusBadge product={product} size="md" />
            </div>
          </div>

          {/* Live Configured Price Panel */}
          <div className="p-4 border-2 border-black bg-white rounded-sm flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase text-black/60 block">
                Total ({qty > 1 ? `${qty} Units` : "1 Unit"})
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl font-display font-bold">
                  {formatGhs(totalEstimatedGhs)}
                </span>
                {product.compareAtPriceGhs && qty === 1 && (
                  <span className="text-sm text-black/50 line-through font-mono">
                    {formatGhs(product.compareAtPriceGhs)}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right font-mono text-xs">
              <span className="block font-semibold">
                {product.specs.warrantyMonths}-Month Warranty
              </span>
              <span className="text-black/60">
                Direct WhatsApp Order
              </span>
            </div>
          </div>

          {/* INTERACTIVE SPECIFICATION SELECTOR */}
          <div className="p-5 border border-black bg-black/[0.02] rounded-sm space-y-4">
            <div className="border-b border-black/15 pb-2 flex items-center justify-between">
              <h2 className="font-mono text-xs uppercase font-bold tracking-wider">
                Configure Specifications
              </h2>
            </div>

            {/* Processor (Fixed per model) */}
            <div className="text-xs">
              <span className="font-mono uppercase text-black/60 block mb-1">
                Processor
              </span>
              <div className="px-3 py-2 border border-black bg-white font-mono font-semibold flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 shrink-0" />
                <span>{product.specs.processor}</span>
              </div>
            </div>

            {/* Memory (RAM) Selector */}
            {!isAccessory && (
              <div className="text-xs space-y-1.5">
                <label className="font-mono uppercase text-black/80 block font-semibold">
                  Memory (RAM)
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {ramOptions.map((opt, idx) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setSelectedRamIdx(idx)}
                      className={`px-3.5 py-2.5 border text-left font-mono rounded-sm flex items-center justify-between transition-colors ${
                        selectedRamIdx === idx
                          ? "bg-black text-white border-black font-bold"
                          : "bg-white text-black border-black/30 hover:border-black"
                      }`}
                    >
                      <span>{opt.label}</span>
                      <span>
                        {opt.priceDeltaGhs === 0
                          ? "Included"
                          : `+${formatGhs(opt.priceDeltaGhs)}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Storage (SSD) Selector */}
            {!isAccessory && (
              <div className="text-xs space-y-1.5">
                <label className="font-mono uppercase text-black/80 block font-semibold">
                  Storage (SSD)
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {storageOptions.map((opt, idx) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setSelectedStorageIdx(idx)}
                      className={`px-3.5 py-2.5 border text-left font-mono rounded-sm flex items-center justify-between transition-colors ${
                        selectedStorageIdx === idx
                          ? "bg-black text-white border-black font-bold"
                          : "bg-white text-black border-black/30 hover:border-black"
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <HardDrive className="w-3.5 h-3.5 shrink-0" />
                        <span>{opt.label}</span>
                      </span>
                      <span>
                        {opt.priceDeltaGhs === 0
                          ? "Included"
                          : `+${formatGhs(opt.priceDeltaGhs)}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Zone Selector */}
            <div className="text-xs space-y-1.5">
              <label
                htmlFor="spec-delivery-zone"
                className="font-mono uppercase text-black/80 block font-semibold"
              >
                Delivery Region
              </label>
              <div className="relative">
                <select
                  id="spec-delivery-zone"
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(e.target.value)}
                  className="w-full border border-black px-3 py-2.5 bg-white font-mono text-xs rounded-sm"
                >
                  {settings.deliveryZones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} —{" "}
                      {z.feeGhs === 0 ? "FREE" : formatGhs(z.feeGhs)} ({z.eta})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quantity & Optional Custom Note */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
              <div className="sm:col-span-4">
                <label className="font-mono text-xs uppercase text-black/80 block mb-1 font-semibold">
                  Quantity
                </label>
                <div className="flex items-center border border-black bg-white rounded-sm">
                  <button
                    type="button"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-3 py-2 text-xs font-mono hover:bg-black/5"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center py-2 text-xs font-mono font-bold border-x border-black">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(Math.min(maxQty, qty + 1))}
                    className="px-3 py-2 text-xs font-mono hover:bg-black/5"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="sm:col-span-8">
                <label className="font-mono text-xs uppercase text-black/80 block mb-1 font-semibold">
                  Optional Note (e.g. Location / Software)
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="e.g. Delivering to East Legon / Install Office"
                  className="w-full border border-black px-3 py-2 text-xs bg-white rounded-sm"
                />
              </div>
            </div>
          </div>

          {/* PRIMARY ACTION: SEND SELECTED DEVICE & SPECS TO WHATSAPP DM */}
          {!outOfStock ? (
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={handleOrderViaWhatsApp}
                className="w-full inline-flex items-center justify-center gap-2.5 bg-black text-white hover:bg-black/85 py-4 px-6 text-sm font-mono uppercase tracking-wider font-bold rounded-sm transition-colors"
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>
                  Order Selected Specs via WhatsApp DM ({formatGhs(totalEstimatedGhs)})
                </span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </button>

              {eligible && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleAddToCartWithSpecs}
                    className="w-full inline-flex items-center justify-center gap-2 bg-white text-black border border-black hover:bg-black hover:text-white py-2.5 px-4 text-xs font-mono uppercase rounded-sm transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add Specs to Multi-Item Cart</span>
                  </button>

                  <Link
                    href={`/request-device?product=${product.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-white text-black border border-black/40 hover:border-black py-2.5 px-4 text-xs font-mono uppercase rounded-sm transition-colors"
                  >
                    <FileQuestion className="w-3.5 h-3.5" />
                    <span>Request Custom Invoice</span>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="p-5 border-2 border-black bg-black/[0.03] space-y-3 rounded-sm">
              <div className="flex items-center justify-between gap-2 border-b border-black/20 pb-2">
                <span className="px-2.5 py-1 bg-black text-white text-xs font-mono uppercase font-bold tracking-wider">
                  OUT OF STOCK
                </span>
                <span className="text-[11px] font-mono uppercase text-black/70">
                  0 Units Available
                </span>
              </div>
              <p className="text-xs font-mono uppercase font-bold">
                This gadget is currently Out of Stock — Get Priority Restock Alert or Enquire on WhatsApp
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={alertContact}
                  onChange={(e) => setAlertContact(e.target.value)}
                  placeholder="Enter WhatsApp number or Email..."
                  className="flex-1 border border-black px-3 py-2 text-xs bg-white rounded-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    subscribeRestockAlert(
                      product.id,
                      alertContact || "Customer Alert",
                      "WhatsApp"
                    );
                    setAlertContact("");
                  }}
                  className="bg-black text-white px-4 py-2 text-xs font-mono uppercase font-bold rounded-sm inline-flex items-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Notify Me</span>
                </button>
              </div>
              <button
                type="button"
                onClick={handleOrderViaWhatsApp}
                className="w-full inline-flex items-center justify-center gap-2 border border-black bg-white py-2.5 text-xs font-mono uppercase font-semibold hover:bg-black hover:text-white rounded-sm transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask About Restock or Similar Models on WhatsApp DM</span>
              </button>
            </div>
          )}

          {/* Secondary Utility Actions: Compare & Wishlist */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-black/15">
            <button
              type="button"
              onClick={() => toggleCompare(product.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 border border-black text-xs font-mono uppercase rounded-sm transition-colors ${
                isCompared
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-black hover:text-white"
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isCompared ? "In Compare Tray" : "Compare Specs"}</span>
            </button>

            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 border border-black text-xs font-mono uppercase rounded-sm transition-colors ${
                isWishlisted
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-black hover:text-white"
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>{isWishlisted ? "Saved in Wishlist" : "Save to Wishlist"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Technical Specifications Table */}
      <section className="py-12 border-b border-black/15">
        <h2 className="text-h2 mb-6">Full Technical Specifications</h2>
        <div className="border border-black rounded-sm overflow-hidden">
          {[
            { label: "Model Name", value: product.name },
            { label: "SAMCORE SKU", value: product.sku },
            { label: "Condition", value: product.condition },
            { label: "Processor (CPU)", value: product.specs.processor },
            { label: "Selected Memory (RAM)", value: chosenRam?.label || product.specs.ramText },
            { label: "Selected Storage (SSD)", value: chosenStorage?.label || product.specs.storageText },
            { label: "Display Panel", value: product.specs.display },
            { label: "Graphics (GPU)", value: product.specs.graphics },
            { label: "Battery Endurance", value: product.specs.batteryLife },
            { label: "Ports & Connectivity", value: product.specs.ports },
            { label: "Operating System", value: product.specs.os },
            { label: "Weight", value: `${product.specs.weightKg} kg` },
            {
              label: "Hardware Warranty",
              value: `${product.specs.warrantyMonths} Months SAMCORE Warranty`,
            },
          ].map((row, idx) => (
            <div
              key={row.label}
              className={`grid grid-cols-1 sm:grid-cols-12 px-4 py-3 text-sm ${
                idx % 2 === 0 ? "bg-black/[0.02]" : "bg-white"
              } border-b last:border-b-0 border-black/15`}
            >
              <div className="sm:col-span-4 font-mono text-xs uppercase text-black/70 font-semibold">
                {row.label}
              </div>
              <div className="sm:col-span-8 font-medium text-black mt-1 sm:mt-0">
                {row.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Verified Customer Reviews & Moderation Section */}
      <section className="py-12 border-b border-black/15">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-h2">
              Verified Reviews ({productReviews.length})
            </h2>
            {productReviews.length === 0 ? (
              <div className="p-6 border border-black/25 text-sm text-black/70">
                No published reviews for this specific SKU yet. Purchased this unit? Submit your verified review on the right.
              </div>
            ) : (
              <div className="space-y-4">
                {productReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 border border-black/25 rounded-sm space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-black text-black"
                          />
                        ))}
                      </div>
                      {rev.verifiedPurchase && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black text-white text-[10px] font-mono uppercase">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                          <span>Verified Purchase</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-base">
                      {rev.title}
                    </h3>
                    <p className="text-sm text-black/80">{rev.comment}</p>
                    <p className="text-xs font-mono text-black/60 pt-1">
                      By {rev.customerName} • {rev.createdAt}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <form
              onSubmit={handleReviewSubmit}
              className="p-6 border border-black rounded-sm bg-white space-y-4"
            >
              <h3 className="text-h3">Write a Customer Review</h3>
              <p className="text-xs text-black/70">
                Reviews are checked against order records for Verified Purchase labels and moderated before publication.
              </p>

              <div>
                <label className="block text-xs font-mono uppercase mb-1">
                  Rating (1–5)
                </label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full border border-black px-3 py-2 text-sm bg-white"
                >
                  <option value={5}>5 Stars — Excellent</option>
                  <option value={4}>4 Stars — Very Good</option>
                  <option value={3}>3 Stars — Satisfactory</option>
                  <option value={2}>2 Stars — Subpar</option>
                  <option value={1}>1 Star — Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g., Great battery life for coding in Accra"
                  className="w-full border border-black px-3 py-2 text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase mb-1">
                  Detailed Experience
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share hardware condition, battery performance, and delivery experience..."
                  className="w-full border border-black px-3 py-2 text-sm bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-2.5 text-xs font-mono uppercase tracking-wider rounded-sm hover:bg-black/85"
              >
                Submit Review for Moderation
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-12">
          <h2 className="text-h2 mb-6">Comparable Alternatives</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
