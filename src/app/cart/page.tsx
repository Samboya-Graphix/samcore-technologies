"use client";

import React from "react";
import Link from "next/link";
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { SupplyStatusBadge } from "@/components/SupplyStatusBadge";
import { formatGhs, getMaxReservableQty } from "@/lib/utils";

export default function CartPage() {
  const { cart, products, updateCartQty, removeFromCart, clearCart, coupons } =
    useStore();

  const cartLines = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return {
        product,
        quantity: item.quantity,
        selectedRam: item.selectedRam || product.specs.ramText,
        selectedStorage: item.selectedStorage || product.specs.storageText,
        unitPriceGhs: item.customUnitPriceGhs ?? product.priceGhs,
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

  if (cartLines.length === 0) {
    return (
      <div className="max-w-container mx-auto px-4 sm:px-6 py-16 text-center space-y-5">
        <div className="w-14 h-14 border-2 border-black mx-auto flex items-center justify-center">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h1 className="text-h2">Your SAMCORE Order List is Empty</h1>
        <p className="text-sm text-black/75 max-w-md mx-auto">
          Select a laptop, choose your preferred RAM & Storage specifications, and submit your order directly to our WhatsApp DM.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/shop"
            className="px-6 py-3 bg-black text-white text-xs font-mono uppercase tracking-wider rounded-sm"
          >
            Browse Catalogue
          </Link>
          <Link
            href="/laptop-finder"
            className="px-6 py-3 bg-white text-black border border-black text-xs font-mono uppercase tracking-wider rounded-sm"
          >
            Guided Laptop Finder
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-8 md:py-12">
      <nav aria-label="Breadcrumb" className="text-xs font-mono text-black/60 mb-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        / <span className="text-black font-semibold">Order List & Cart</span>
      </nav>

      <div className="flex items-center justify-between border-b border-black pb-5 mb-8">
        <div>
          <h1 className="text-h1">Selected Devices & Specs ({cartLines.length})</h1>
          <p className="text-xs font-mono text-black/70 mt-1">
            Review your selected specifications below before sending your order to our official WhatsApp DM.
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-mono uppercase underline hover:text-black/70"
        >
          Clear List
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Line Items (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-3.5 border border-black bg-black/[0.02] flex items-start gap-3 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-mono font-bold uppercase">
                Direct WhatsApp DM Order Workflow:
              </span>{" "}
              On-site payment gateways are currently turned off. Proceeding to checkout automatically formats your selected devices and specifications and sends them directly to our WhatsApp DM.
            </div>
          </div>

          {cartLines.map(
            ({
              product,
              quantity,
              selectedRam,
              selectedStorage,
              unitPriceGhs,
            }) => {
              const maxQty = getMaxReservableQty(product);
              return (
                <div
                  key={product.id}
                  className="p-4 sm:p-5 border border-black bg-white rounded-sm flex flex-col sm:flex-row gap-4 justify-between"
                >
                  <div className="flex gap-4">
                    <Link
                      href={`/products/${product.slug}`}
                      className="w-24 h-20 bg-black/[0.03] border border-black/20 shrink-0 overflow-hidden"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="space-y-1.5">
                      <SupplyStatusBadge product={product} size="sm" />
                      <Link
                        href={`/products/${product.slug}`}
                        className="font-display font-bold text-base hover:underline block"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs font-mono font-semibold text-black">
                        Selected Specs: {selectedRam} • {selectedStorage}
                      </p>
                      <p className="text-xs font-mono text-black/65">
                        Condition: {product.condition} • SKU: {product.sku} •{" "}
                        {product.specs.warrantyMonths}M Warranty
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-black/10 shrink-0">
                    <div className="text-right">
                      <span className="font-display font-bold text-lg block">
                        {formatGhs(unitPriceGhs * quantity)}
                      </span>
                      {quantity > 1 && (
                        <span className="text-[11px] font-mono text-black/60">
                          {formatGhs(unitPriceGhs)} each
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-black rounded-sm">
                        <button
                          type="button"
                          onClick={() => updateCartQty(product.id, quantity - 1)}
                          className="px-2.5 py-1 text-xs font-mono hover:bg-black/5"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-mono font-bold border-x border-black">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQty(product.id, quantity + 1)}
                          disabled={quantity >= maxQty}
                          className="px-2.5 py-1 text-xs font-mono hover:bg-black/5 disabled:opacity-30"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="p-1.5 border border-black/30 hover:border-black rounded-sm"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* Order Summary Panel (4 cols) */}
        <div className="lg:col-span-4">
          <div className="p-6 border-2 border-black bg-white rounded-sm space-y-5 sticky top-28">
            <h2 className="font-display font-bold text-lg uppercase tracking-wider border-b border-black pb-3">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-black/75">Hardware Subtotal</span>
                <span className="font-mono font-bold">
                  {formatGhs(subtotalGhs)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/75">Nationwide Doorstep Delivery</span>
                <span className="font-mono text-xs">
                  Selected on Next Step (GH₵ 50 – 280)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/75">Eligible Loyalty Points</span>
                <span className="font-mono font-semibold">
                  +{Math.floor(subtotalGhs / 100)} pts
                </span>
              </div>
            </div>

            <div className="p-3 bg-black/[0.03] border border-black/15 text-xs space-y-1.5">
              <p className="font-mono font-bold uppercase">
                Available Promo Codes:
              </p>
              {coupons
                .filter((c) => c.active)
                .map((c) => (
                  <p key={c.code} className="font-mono text-[11px]">
                    • <strong>{c.code}</strong>: {c.description}
                  </p>
                ))}
            </div>

            <div className="border-t border-black pt-4 flex items-baseline justify-between">
              <span className="font-display font-bold text-base">
                Estimated Total
              </span>
              <span className="font-display font-bold text-2xl">
                {formatGhs(subtotalGhs)}
              </span>
            </div>

            <Link
              href="/checkout"
              className="w-full inline-flex items-center justify-center gap-2 bg-black text-white hover:bg-black/85 py-3.5 px-5 text-sm font-mono uppercase tracking-wider rounded-sm transition-colors"
            >
              <span>Proceed to WhatsApp DM Order</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-black/70">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                Automatically sends selected device & specifications to our WhatsApp DM
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
