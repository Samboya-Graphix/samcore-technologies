"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  Search,
  X,
  RotateCcw,
  FileQuestion,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Calendar,
  XCircle,
  Layers,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { CATEGORIES } from "@/lib/mock-data";
import { ProductCard } from "@/components/ProductCard";
import { formatGhs } from "@/lib/utils";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "ALL";

  const { products } = useStore();

  const [search, setSearch] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCondition, setSelectedCondition] = useState<string>("ALL");
  const [selectedSupply, setSelectedSupply] = useState<string>("ALL");
  const [selectedBrand, setSelectedBrand] = useState<string>("ALL");
  const [minRam, setMinRam] = useState<number>(0);
  const [gpuFilter, setGpuFilter] = useState<string>("ALL");
  const [maxPrice, setMaxPrice] = useState<number>(40000);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.published)
      .filter((p) => {
        if (search.trim()) {
          const q = search.toLowerCase();
          const match =
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.specs.processor.toLowerCase().includes(q) ||
            p.specs.graphics.toLowerCase().includes(q);
          if (!match) return false;
        }
        if (
          selectedCategory !== "ALL" &&
          p.categorySlug !== selectedCategory
        ) {
          return false;
        }
        if (
          selectedCondition !== "ALL" &&
          p.condition !== selectedCondition
        ) {
          return false;
        }
        if (selectedSupply !== "ALL" && p.supplyState !== selectedSupply) {
          return false;
        }
        if (selectedBrand !== "ALL" && p.brand !== selectedBrand) {
          return false;
        }
        if (minRam > 0 && p.specs.ramGb < minRam) {
          return false;
        }
        if (gpuFilter !== "ALL" && p.specs.gpuType !== gpuFilter) {
          return false;
        }
        if (p.priceGhs > maxPrice) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.priceGhs - b.priceGhs;
        if (sortBy === "price-desc") return b.priceGhs - a.priceGhs;
        if (sortBy === "rating") return b.rating - a.rating;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [
    products,
    search,
    selectedCategory,
    selectedCondition,
    selectedSupply,
    selectedBrand,
    minRam,
    gpuFilter,
    maxPrice,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("ALL");
    setSelectedCondition("ALL");
    setSelectedSupply("ALL");
    setSelectedBrand("ALL");
    setMinRam(0);
    setGpuFilter("ALL");
    setMaxPrice(40000);
    setSortBy("featured");
  };

  const activeFilterCount = [
    search.trim() !== "",
    selectedCategory !== "ALL",
    selectedCondition !== "ALL",
    selectedSupply !== "ALL",
    selectedBrand !== "ALL",
    minRam > 0,
    gpuFilter !== "ALL",
    maxPrice < 40000,
  ].filter(Boolean).length;

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Breadcrumb & Header */}
      <nav aria-label="Breadcrumb" className="text-xs font-mono text-black/60 mb-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        / <span className="text-black font-semibold">Hardware Catalogue</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-black">
        <div>
          <h1 className="text-h1">All Products</h1>
          <p className="text-sm text-black/75 mt-1">
            Filter by brand, condition, specs, and budget.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Mobile Filter Drawer Trigger */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 border border-black bg-white text-black text-xs font-mono uppercase rounded-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters ({activeFilterCount})</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="sort-select"
              className="text-xs font-mono uppercase text-black/70"
            >
              Sort:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white text-black border border-black px-3 py-2 text-xs font-mono rounded-sm"
            >
              <option value="featured">Featured & Stock Priority</option>
              <option value="price-asc">Price: Low to High (GH₵)</option>
              <option value="price-desc">Price: High to Low (GH₵)</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Filter Sidebar (3 cols) + Product Grid (9 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Left Filter Sidebar */}
        <aside
          aria-label="Technical Filters"
          className={`lg:col-span-3 space-y-6 ${
            mobileFiltersOpen
              ? "block p-5 border-2 border-black bg-white rounded-sm"
              : "hidden lg:block"
          }`}
        >
          <div className="flex items-center justify-between border-b border-black/15 pb-3">
            <h2 className="font-display font-bold text-sm uppercase tracking-wider">
              Filters ({activeFilterCount})
            </h2>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs font-mono underline hover:text-black/70"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Keyword Filter */}
          <div className="space-y-1.5">
            <label
              htmlFor="shop-keyword"
              className="block text-xs font-mono uppercase text-black/80"
            >
              Search
            </label>
            <div className="relative">
              <input
                id="shop-keyword"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Model, brand, or specs..."
                className="w-full bg-white text-black border border-black px-3 py-2 text-xs rounded-sm"
              />
            </div>
          </div>

          {/* Supply State Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase text-black/80">
              Availability
            </label>
            {[
              { id: "ALL", label: "All Availability", icon: Layers },
              { id: "OWNED_IN_STOCK", label: "In-Stock (Accra)", icon: CheckCircle2 },
              { id: "SUPPLIER_CONFIRMED", label: "Partner Stock", icon: ShieldCheck },
              { id: "SUPPLIER_UNKNOWN", label: "Confirm Availability", icon: Clock },
              { id: "PRE_ORDER", label: "Pre-Order", icon: Calendar },
              { id: "OUT_OF_STOCK", label: "Out of Stock", icon: XCircle },
            ].map((st) => {
              const IconComp = st.icon;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSelectedSupply(st.id)}
                  className={`w-full flex items-center gap-2 text-left px-3 py-2 text-xs font-mono border rounded-sm transition-colors ${
                    selectedSupply === st.id
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-black/20 hover:border-black"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5 shrink-0" />
                  <span>{st.label}</span>
                </button>
              );
            })}
          </div>

          {/* Category Filter */}
          <div className="space-y-1.5">
            <label
              htmlFor="cat-select"
              className="block text-xs font-mono uppercase text-black/80"
            >
              Category
            </label>
            <select
              id="cat-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-white text-black border border-black px-3 py-2 text-xs rounded-sm"
            >
              <option value="ALL">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Condition Filter */}
          <div className="space-y-1.5">
            <label
              htmlFor="cond-select"
              className="block text-xs font-mono uppercase text-black/80"
            >
              Hardware Condition
            </label>
            <select
              id="cond-select"
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full bg-white text-black border border-black px-3 py-2 text-xs rounded-sm"
            >
              <option value="ALL">All Conditions</option>
              <option value="Brand New">Brand New (Sealed)</option>
              <option value="UK Used (Grade A)">UK Used (Grade A)</option>
              <option value="Factory Refurbished">Factory Refurbished</option>
            </select>
          </div>

          {/* Brand Filter */}
          <div className="space-y-1.5">
            <label
              htmlFor="brand-select"
              className="block text-xs font-mono uppercase text-black/80"
            >
              Manufacturer Brand
            </label>
            <select
              id="brand-select"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-white text-black border border-black px-3 py-2 text-xs rounded-sm"
            >
              <option value="ALL">All Brands</option>
              {["Apple", "Lenovo", "Dell", "HP", "ASUS", "Logitech"].map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* RAM Capacity Filter */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase text-black/80">
              Minimum Memory (RAM)
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { val: 0, label: "Any" },
                { val: 16, label: "16GB+" },
                { val: 32, label: "32GB+" },
                { val: 64, label: "64GB" },
              ].map((r) => (
                <button
                  key={r.val}
                  type="button"
                  onClick={() => setMinRam(r.val)}
                  className={`py-1.5 text-xs font-mono border rounded-sm ${
                    minRam === r.val
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-black/25 hover:border-black"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Graphics Type Filter */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase text-black/80">
              Graphics Architecture
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                { id: "ALL", label: "All Graphics" },
                { id: "Dedicated RTX / Pro", label: "Dedicated NVIDIA RTX" },
                { id: "Integrated", label: "Apple Silicon / Iris Xe / Radeon" },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGpuFilter(g.id)}
                  className={`text-left px-3 py-1.5 text-xs font-mono border rounded-sm ${
                    gpuFilter === g.id
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-black/25 hover:border-black"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Max Budget Slider */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <label htmlFor="budget-range" className="uppercase text-black/80">
                Max Price Ceiling
              </label>
              <span className="font-bold">{formatGhs(maxPrice)}</span>
            </div>
            <input
              id="budget-range"
              type="range"
              min={2000}
              max={40000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>
        </aside>

        {/* Right Product Grid (9 cols) */}
        <div className="lg:col-span-9">
          {/* Persistent Selection Count Bar */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-black/[0.03] border border-black/15 text-xs font-mono">
            <span>
              Showing <strong>{filteredProducts.length}</strong> product(s)
            </span>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="underline hover:text-black/70"
              >
                Clear filters ({activeFilterCount})
              </button>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="p-12 border border-dashed border-black text-center space-y-4 bg-white">
              <FileQuestion className="w-10 h-10 mx-auto text-black/70" />
              <h2 className="text-h3">No Products Found</h2>
              <p className="text-sm text-black/75 max-w-md mx-auto">
                No items match your selected filters. Try resetting filters or request a custom device.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-black text-white text-xs font-mono uppercase rounded-sm"
                >
                  Reset Filters
                </button>
                <Link
                  href="/request-device"
                  className="px-5 py-2.5 bg-white text-black border border-black text-xs font-mono uppercase rounded-sm hover:bg-black hover:text-white"
                >
                  Request Device →
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-container mx-auto px-4 py-16 text-center font-mono text-sm">
          Loading SAMCORE Hardware Catalogue...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
