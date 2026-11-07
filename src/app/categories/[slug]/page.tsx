"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CATEGORIES } from "@/lib/mock-data";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/ProductCard";

export default function CategoryDetailPage() {
  const params = useParams<{ slug: string }>();
  const { products } = useStore();

  const category = CATEGORIES.find((c) => c.slug === params?.slug);
  const matchingProducts = products.filter(
    (p) => p.published && p.categorySlug === params?.slug
  );

  if (!category) {
    return (
      <div className="max-w-container mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-h2">Category Not Found</h1>
        <Link
          href="/categories"
          className="inline-block bg-black text-white px-5 py-2.5 text-xs font-mono uppercase"
        >
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-10 md:py-14">
      <nav aria-label="Breadcrumb" className="text-xs font-mono text-black/60 mb-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/categories" className="hover:underline">
          Categories
        </Link>{" "}
        / <span className="text-black font-semibold">{category.name}</span>
      </nav>

      <div className="border-b border-black pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase px-2 py-0.5 bg-black text-white">
            {category.countLabel}
          </span>
          <h1 className="text-h1 mt-2">{category.name}</h1>
          <p className="text-sm text-black/80 mt-1 max-w-2xl">
            {category.shortDesc}
          </p>
        </div>
        <Link
          href={`/shop?category=${category.slug}`}
          className="px-4 py-2.5 border border-black text-xs font-mono uppercase rounded-sm hover:bg-black hover:text-white self-start md:self-auto"
        >
          Filter by RAM / CPU / Stock →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {matchingProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
