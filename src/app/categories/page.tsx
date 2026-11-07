"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/lib/mock-data";
import { useStore } from "@/context/StoreContext";

export default function CategoriesIndexPage() {
  const { products } = useStore();
  const published = products.filter((p) => p.published);

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-10 md:py-14">
      <nav aria-label="Breadcrumb" className="text-xs font-mono text-black/60 mb-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        / <span className="text-black font-semibold">Categories</span>
      </nav>

      <div className="border-b border-black pb-6 mb-8">
        <h1 className="text-h1">Categories</h1>
        <p className="text-sm text-black/75 mt-2 max-w-2xl">
          Browse laptops, workstations, and computing gear by category.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CATEGORIES.map((cat) => {
          const catProducts = published.filter((p) => p.categorySlug === cat.slug);
          const inStockCount = catProducts.filter(
            (p) =>
              p.supplyState === "OWNED_IN_STOCK" ||
              p.supplyState === "SUPPLIER_CONFIRMED"
          ).length;

          return (
            <div
              key={cat.slug}
              className="p-6 border border-black bg-white rounded-sm flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono uppercase">
                  <span className="px-2 py-0.5 bg-black text-white">
                    {cat.countLabel}
                  </span>
                  <span>
                    {catProducts.length} Items • {inStockCount} In Stock
                  </span>
                </div>
                <h2 className="text-h2">{cat.name}</h2>
                <p className="text-sm text-black/80 leading-relaxed">
                  {cat.shortDesc}
                </p>
                <p className="text-xs font-mono text-black/65">
                  For: {cat.audience}
                </p>
              </div>

              <div className="pt-4 border-t border-black/15 flex items-center justify-between">
                <Link
                  href={`/categories/${cat.slug}`}
                  className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 text-xs font-mono uppercase tracking-wider rounded-sm hover:bg-black/85"
                >
                  <span>Browse {cat.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={`/shop?category=${cat.slug}`}
                  className="text-xs font-mono underline hover:text-black/70"
                >
                  Open in Advanced Filter →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
