"use client";

import React from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/mock-data";
import { useStore } from "@/context/StoreContext";
import { AdminNav } from "@/components/AdminNav";

export default function AdminCategoriesPage() {
  const { products } = useStore();

  return (
    <div>
      <AdminNav />
      <div className="max-w-container mx-auto px-4 sm:px-6 pb-16 space-y-6">
        <div className="border-b border-black pb-5">
          <h1 className="text-h1">Category Administration</h1>
          <p className="text-sm text-black/75 mt-1">
            Manage storefront category taxonomy and product assignments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => {
            const count = products.filter(
              (p) => p.categorySlug === cat.slug
            ).length;
            return (
              <div
                key={cat.slug}
                className="p-5 border border-black bg-white space-y-3"
              >
                <div className="flex justify-between text-xs font-mono uppercase">
                  <span>/{cat.slug}</span>
                  <span className="font-bold">{count} Products</span>
                </div>
                <h2 className="text-h3">{cat.name}</h2>
                <p className="text-xs text-black/75">{cat.shortDesc}</p>
                <Link
                  href={`/categories/${cat.slug}`}
                  className="inline-block text-xs font-mono underline pt-1"
                >
                  View Storefront Category →
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
