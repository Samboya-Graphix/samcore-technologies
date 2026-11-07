"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Compass,
  Scale,
  MessageSquare,
  FileQuestion,
  Truck,
  Award,
  Sparkles,
  Laptop,
  Search,
  Star,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { CATEGORIES } from "@/lib/mock-data";
import { ProductCard } from "@/components/ProductCard";
import { formatGhs, getWhatsAppEnquiryUrl } from "@/lib/utils";

export default function HomePage() {
  const { products, coupons, reviews, settings } = useStore();
  const [selectedSupplyFilter, setSelectedSupplyFilter] = useState<string>("ALL");

  const publishedProducts = products.filter((p) => p.published);
  const featuredProducts = publishedProducts
    .filter((p) => {
      if (!p.featured) return false;
      if (selectedSupplyFilter === "IN_STOCK") {
        return p.supplyState === "OWNED_IN_STOCK";
      }
      if (selectedSupplyFilter === "PARTNER") {
        return p.supplyState === "SUPPLIER_CONFIRMED";
      }
      return true;
    })
    .slice(0, 6);

  const latestArrivals = publishedProducts
    .filter((p) => p.latestArrival)
    .slice(0, 4);

  const publishedReviews = reviews
    .filter((r) => r.status === "published")
    .slice(0, 3);

  const activeCoupons = coupons.filter((c) => c.active);

  return (
    <div className="bg-white text-black">
      {/* 1. HERO SECTION — Authoritative White Canvas & High-Contrast Black Architecture */}
      <section className="border-b border-black">
        <div className="max-w-container mx-auto px-4 sm:px-6 py-10 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column (7 cols on 12-col desktop grid) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-black bg-white text-xs font-mono uppercase tracking-wider">
                <span className="w-2 h-2 bg-black inline-block" />
                <span>SAMCORE TECHNOLOGIES • 100% ONLINE PLATFORM • NATIONWIDE GHANA</span>
              </div>

              <h1 className="text-h1 tracking-tight text-black">
                Verified Enterprise Laptops &amp; Workstations.
              </h1>

              <p className="text-base md:text-lg text-black/80 max-w-xl leading-relaxed">
                Premium Apple MacBooks, ThinkPads, and creator workstations in Ghana. Configure your specs and order directly via WhatsApp DM (050 946 1505).
              </p>

              {/* Clean Key Highlights Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs font-mono">
                <div className="flex items-center gap-2 p-2.5 border border-black bg-black text-white rounded-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-bold">Verified In-Stock</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 border border-black bg-white text-black rounded-sm">
                  <Truck className="w-4 h-4 shrink-0" />
                  <span>Nationwide Delivery</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 border border-black bg-white text-black rounded-sm">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Warranty Included</span>
                </div>
              </div>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-black text-white hover:bg-black/85 px-6 py-3.5 text-sm font-medium rounded-sm transition-colors"
                >
                  <span>Browse Catalogue</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/laptop-finder"
                  className="inline-flex items-center gap-2 bg-white text-black border border-black hover:bg-black hover:text-white px-5 py-3.5 text-sm font-medium rounded-sm transition-colors"
                >
                  <Compass className="w-4 h-4" />
                  <span>Laptop Finder</span>
                </Link>

                <a
                  href={getWhatsAppEnquiryUrl(settings)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-black border border-black/40 hover:border-black px-4 py-3.5 text-sm font-medium rounded-sm transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Desk</span>
                </a>
              </div>
            </div>

            {/* Right Column: Featured Flagship Spotlight Card (5 cols) */}
            <div className="lg:col-span-5">
              <div className="border-2 border-black bg-white rounded-sm overflow-hidden">
                <div className="bg-black text-white px-4 py-2.5 flex items-center justify-between text-xs font-mono uppercase tracking-wider">
                  <span>FLAGSHIP CATALOGUE UNIT</span>
                  <span>IN STOCK • FAST DISPATCH</span>
                </div>
                <div className="relative aspect-[16/10] bg-black/[0.03] border-b border-black/15">
                  <img
                    src={products[0].images[0]}
                    alt={products[0].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-black text-white px-2.5 py-1 text-xs font-mono uppercase">
                    {products[0].condition} • {products[0].specs.warrantyMonths}M Warranty
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-xs font-mono text-black/60 uppercase">
                      SKU: {products[0].sku}
                    </p>
                    <h2 className="font-display font-bold text-xl mt-0.5">
                      {products[0].name}
                    </h2>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-black/15 text-xs">
                    <div>
                      <span className="text-black/50 block font-mono text-[10px] uppercase">
                        Chip
                      </span>
                      <span className="font-semibold">M3 Pro 11-Core</span>
                    </div>
                    <div>
                      <span className="text-black/50 block font-mono text-[10px] uppercase">
                        Memory
                      </span>
                      <span className="font-semibold">18GB Unified</span>
                    </div>
                    <div>
                      <span className="text-black/50 block font-mono text-[10px] uppercase">
                        Battery
                      </span>
                      <span className="font-semibold">Up to 18 Hrs</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-display font-bold">
                        {formatGhs(products[0].priceGhs)}
                      </span>
                      {products[0].compareAtPriceGhs && (
                        <span className="ml-2 text-xs text-black/50 line-through font-mono">
                          {formatGhs(products[0].compareAtPriceGhs)}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/products/${products[0].slug}`}
                      className="inline-flex items-center gap-1.5 bg-black text-white px-4 py-2.5 text-xs font-mono uppercase tracking-wider rounded-sm hover:bg-black/85"
                    >
                      <span>Inspect Unit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ACTIVE PROMOTIONS & COUPON STRIP */}
      <section className="border-b border-black/15 bg-black/[0.02]">
        <div className="max-w-container mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span className="font-bold">Active Store Coupons:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {activeCoupons.map((c) => (
              <div
                key={c.code}
                className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-black rounded-sm text-xs"
              >
                <span className="font-mono font-bold bg-black text-white px-1.5 py-0.5">
                  {c.code}
                </span>
                <span className="text-black/80">{c.description}</span>
              </div>
            ))}
          </div>
          <Link
            href="/deals"
            className="text-xs font-mono uppercase underline underline-offset-4 hover:text-black/70"
          >
            View All Deals & Loyalty Rules →
          </Link>
        </div>
      </section>

      {/* 3. BROWSE BY CATEGORY (Swipeable on mobile, 6-card grid on desktop) */}
      <section className="max-w-container mx-auto px-4 sm:px-6 py-12 md:py-16 border-b border-black/15">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-black/60">
              01 / CURATED HARDWARE LINES
            </p>
            <h2 className="text-h2 mt-1">Shop by Category & Workload</h2>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-sm font-medium underline underline-offset-4"
          >
            <span>Explore All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => {
            const count = publishedProducts.filter(
              (p) => p.categorySlug === cat.slug
            ).length;
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group p-5 border border-black/25 hover:border-black bg-white rounded-sm flex flex-col justify-between transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono uppercase text-black/60">
                    <span>{cat.countLabel}</span>
                    <span className="px-2 py-0.5 border border-black/30 text-black font-semibold">
                      {count} {count === 1 ? "Model" : "Models"}
                    </span>
                  </div>
                  <h3 className="text-h3 mt-3 group-hover:underline">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-black/70 mt-2 leading-relaxed">
                    {cat.shortDesc}
                  </p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-black/10 flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold group-hover:underline">Browse Category</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS WITH SUPPLY-STATE FILTER */}
      <section className="max-w-container mx-auto px-4 sm:px-6 py-12 md:py-16 border-b border-black/15">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-black/60">
              02 / VERIFIED CATALOGUE
            </p>
            <h2 className="text-h2 mt-1">Featured Laptops & Workstations</h2>
          </div>

          {/* Quick Supply State Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "ALL", label: "All Featured" },
              { id: "IN_STOCK", label: "In-Stock Only" },
              { id: "PARTNER", label: "Partner Stock" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedSupplyFilter(tab.id)}
                className={`px-3.5 py-2 text-xs font-mono uppercase border border-black rounded-sm transition-colors ${
                  selectedSupplyFilter === tab.id
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white text-black border-2 border-black hover:bg-black hover:text-white px-7 py-3.5 text-sm font-mono uppercase tracking-wider rounded-sm transition-colors"
          >
            <span>View All {publishedProducts.length} Catalogue Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. GUIDED LAPTOP FINDER & COMPARISON CTA BANNER (High-Emphasis Black Surface) */}
      <section className="bg-black text-white border-b border-black">
        <div className="max-w-container mx-auto px-4 sm:px-6 py-12 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <span className="inline-block px-2.5 py-1 border border-white/40 text-xs font-mono uppercase tracking-widest">
                03 / DECISION TOOLS
              </span>
              <h2 className="text-h2 text-white">
                Need Help Choosing the Right Machine?
              </h2>
              <p className="text-sm text-white/80 max-w-xl leading-relaxed">
                Compare models side-by-side or use our quick laptop finder to match your daily workload and Ghana Cedi budget.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/laptop-finder"
                  className="inline-flex items-center gap-2 bg-white text-black hover:bg-white/90 px-5 py-3 text-xs font-mono uppercase font-bold rounded-sm transition-colors"
                >
                  <Compass className="w-4 h-4" />
                  <span>Launch Laptop Finder</span>
                </Link>
                <Link
                  href="/compare"
                  className="inline-flex items-center gap-2 bg-black text-white border border-white hover:bg-white hover:text-black px-5 py-3 text-xs font-mono uppercase rounded-sm transition-colors"
                >
                  <Scale className="w-4 h-4" />
                  <span>Compare Models</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border border-white/25 rounded-sm space-y-1.5">
                <Laptop className="w-5 h-5" />
                <h3 className="font-display font-bold text-sm">
                  Custom Sourcing
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Looking for a specific model not listed? Send us your requirements.
                </p>
                <Link
                  href="/request-device"
                  className="inline-flex items-center gap-1 text-xs font-mono uppercase underline underline-offset-4 pt-1"
                >
                  <span>Request Device</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-4 border border-white/25 rounded-sm space-y-1.5">
                <Award className="w-5 h-5" />
                <h3 className="font-display font-bold text-sm">
                  Loyalty Points
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Earn points on every verified order to redeem on future purchases.
                </p>
                <Link
                  href="/account/rewards"
                  className="inline-flex items-center gap-1 text-xs font-mono uppercase underline underline-offset-4 pt-1"
                >
                  <span>View Rewards</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LATEST ARRIVALS & DUMSOR POWER ESSENTIALS */}
      <section className="max-w-container mx-auto px-4 sm:px-6 py-12 md:py-16 border-b border-black/15">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-black/60">
              04 / NEW ARRIVALS
            </p>
            <h2 className="text-h2 mt-1">Latest Arrivals & Power Backup</h2>
          </div>
          <Link
            href="/shop?sort=newest"
            className="inline-flex items-center gap-1.5 text-sm font-medium underline underline-offset-4"
          >
            <span>See All New Arrivals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {latestArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. VERIFIED CUSTOMER REVIEWS & TRUST GUARANTEES */}
      <section className="max-w-container mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-black/60">
              05 / VERIFIED CUSTOMER REVIEWS
            </p>
            <h2 className="text-h2 mt-1">Trusted by Professionals Across Ghana</h2>
          </div>
          <Link
            href="/account/reviews"
            className="inline-flex items-center gap-1.5 text-sm font-medium underline underline-offset-4"
          >
            <span>Submit a Verified Purchase Review</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {publishedReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 border border-black/25 rounded-sm bg-white flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: rev.rating }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-black text-black" />
                    ))}
                  </div>
                  {rev.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black text-white text-[10px] font-mono uppercase">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Buyer</span>
                    </span>
                  )}
                </div>
                <h3 className="font-display font-bold text-base">
                  &ldquo;{rev.title}&rdquo;
                </h3>
                <p className="text-sm text-black/80 leading-relaxed">
                  {rev.comment}
                </p>
              </div>
              <div className="pt-3 border-t border-black/10 text-xs font-mono text-black/70">
                <p className="font-bold text-black">{rev.customerName}</p>
                <p>
                  Model: {rev.productName} • Order {rev.orderId}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
