"use client";

import React from "react";
import Link from "next/link";
import {
  MessageSquare,
  Heart,
  Scale,
  Bell,
  Check,
  Star,
  Sliders,
} from "lucide-react";
import { Product } from "@/lib/types";
import {
  formatGhs,
  getWhatsAppEnquiryUrl,
  isProductOutOfStock,
} from "@/lib/utils";
import { SupplyStatusBadge } from "./SupplyStatusBadge";
import { useStore } from "@/context/StoreContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const {
    compareIds,
    toggleCompare,
    wishlistIds,
    toggleWishlist,
    subscribeRestockAlert,
    settings,
  } = useStore();

  const isCompared = compareIds.includes(product.id);
  const isWishlisted = wishlistIds.includes(product.id);
  const outOfStock = isProductOutOfStock(product);
  const whatsappUrl = getWhatsAppEnquiryUrl(settings, product);

  return (
    <article
      className={`group flex flex-col justify-between bg-white border transition-colors rounded-sm overflow-hidden ${
        outOfStock
          ? "border-black/40"
          : "border-black/20 hover:border-black"
      }`}
      aria-label={product.name}
    >
      <div>
        {/* Top bar: Condition & Stock / Deal Badge */}
        <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-black/10 bg-black/[0.02] text-[11px] font-medium">
          <span className="uppercase tracking-wider font-mono text-black/80">
            {product.condition}
          </span>
          {outOfStock ? (
            <span className="px-2 py-0.5 bg-black text-white font-mono text-[10px] font-bold uppercase tracking-wider">
              OUT OF STOCK
            </span>
          ) : product.dealBadge ? (
            <span className="px-1.5 py-0.5 bg-black text-white font-mono text-[10px] uppercase tracking-wider">
              {product.dealBadge}
            </span>
          ) : (
            <span className="text-black/60 font-mono">{product.brand}</span>
          )}
        </div>

        {/* Product Image Container */}
        <div className="relative aspect-[16/10] w-full bg-black/[0.03] border-b border-black/10 overflow-hidden">
          <Link href={`/products/${product.slug}`} className="block w-full h-full">
            <img
              src={product.images[0]}
              alt={product.name}
              className={`w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-300 ${
                outOfStock ? "opacity-65 grayscale" : ""
              }`}
              loading="lazy"
            />
            {outOfStock && (
              <div className="absolute inset-0 bg-black/35 flex items-center justify-center pointer-events-none">
                <div className="bg-black text-white border-2 border-white px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest shadow-sm">
                  OUT OF STOCK
                </div>
              </div>
            )}
          </Link>

          {/* Quick Actions Overlay: Wishlist & Compare */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-label={
                isWishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
              title={isWishlisted ? "Saved in Wishlist" : "Save to Wishlist"}
              className={`w-8 h-8 flex items-center justify-center border border-black rounded-sm transition-colors ${
                isWishlisted
                  ? "bg-black text-white"
                  : "bg-white/95 text-black hover:bg-black hover:text-white"
              }`}
            >
              <Heart
                className="w-4 h-4"
                fill={isWishlisted ? "currentColor" : "none"}
              />
            </button>
            <button
              type="button"
              onClick={() => toggleCompare(product.id)}
              aria-label={
                isCompared ? "Remove from comparison" : "Add to laptop comparison"
              }
              title={isCompared ? "In Compare Tray" : "Compare Specs (Max 3)"}
              className={`w-8 h-8 flex items-center justify-center border border-black rounded-sm transition-colors ${
                isCompared
                  ? "bg-black text-white"
                  : "bg-white/95 text-black hover:bg-black hover:text-white"
              }`}
            >
              {isCompared ? (
                <Check className="w-4 h-4" />
              ) : (
                <Scale className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3">
          <div>
            <SupplyStatusBadge product={product} size="sm" />
          </div>

          <div>
            <p className="text-xs text-black/60 font-mono uppercase">
              {product.categoryName} • SKU: {product.sku}
            </p>
            <Link
              href={`/products/${product.slug}`}
              className="mt-1 block font-display font-bold text-base leading-snug text-black hover:underline line-clamp-2"
            >
              {product.name}
            </Link>
          </div>

          {/* Technical Spec Pills */}
          <div className="grid grid-cols-2 gap-1.5 text-xs border-y border-black/10 py-2.5 text-black/80">
            <div className="truncate">
              <span className="text-black/50 block text-[10px] uppercase font-mono">
                Processor
              </span>
              <span className="font-medium">
                {product.specs.processor.split("(")[0].trim()}
              </span>
            </div>
            <div className="truncate">
              <span className="text-black/50 block text-[10px] uppercase font-mono">
                Memory / Storage
              </span>
              <span className="font-medium">
                {product.specs.ramGb > 0
                  ? `${product.specs.ramGb}GB • ${
                      product.specs.storageGb >= 1000
                        ? `${product.specs.storageGb / 1000}TB`
                        : `${product.specs.storageGb}GB`
                    }`
                  : product.specs.storageText}
              </span>
            </div>
            <div className="truncate">
              <span className="text-black/50 block text-[10px] uppercase font-mono">
                Display
              </span>
              <span className="font-medium">
                {product.specs.screenSizeInches}&quot; •{" "}
                {product.specs.gpuType === "Dedicated RTX / Pro"
                  ? "RTX Graphics"
                  : "Pro Display"}
              </span>
            </div>
            <div className="truncate">
              <span className="text-black/50 block text-[10px] uppercase font-mono">
                Warranty & Rating
              </span>
              <span className="font-medium inline-flex items-center gap-1">
                {product.specs.warrantyMonths}M • <Star className="w-3 h-3 fill-black" />{" "}
                {product.rating} ({product.reviewCount})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Pricing & Select Specs / WhatsApp DM CTAs */}
      <div className="px-4 pb-4 pt-1 space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xl font-display font-bold text-black">
              {formatGhs(product.priceGhs)}
            </span>
            {product.compareAtPriceGhs && (
              <span className="ml-2 text-xs text-black/50 line-through font-mono">
                {formatGhs(product.compareAtPriceGhs)}
              </span>
            )}
          </div>
          <span
            className={`text-[11px] font-mono uppercase ${
              outOfStock ? "font-bold text-black" : "text-black/60"
            }`}
          >
            {outOfStock ? "Out of Stock" : "WhatsApp DM Order"}
          </span>
        </div>

        {!outOfStock ? (
          <div className="grid grid-cols-5 gap-2">
            <Link
              href={`/products/${product.slug}`}
              className="col-span-3 inline-flex items-center justify-center gap-1.5 bg-black text-white hover:bg-black/85 font-medium text-xs py-2.5 px-3 rounded-sm transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Select Specs</span>
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-2 inline-flex items-center justify-center gap-1 bg-white text-black border border-black hover:bg-black hover:text-white font-medium text-xs py-2.5 px-2 rounded-sm transition-colors"
              title="Send device & specs directly to WhatsApp DM"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Order DM</span>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-2">
            <button
              type="button"
              onClick={() =>
                subscribeRestockAlert(
                  product.id,
                  "WhatsApp / Email Subscriber",
                  "WhatsApp"
                )
              }
              className="col-span-3 inline-flex items-center justify-center gap-1.5 bg-white text-black border border-black hover:bg-black hover:text-white font-medium text-xs py-2.5 px-3 rounded-sm transition-colors"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Notify Restock</span>
            </button>
            <Link
              href={`/products/${product.slug}`}
              className="col-span-2 inline-flex items-center justify-center bg-white text-black border border-black/40 hover:border-black font-medium text-xs py-2.5 px-2 rounded-sm transition-colors"
            >
              <span>View Specs</span>
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
