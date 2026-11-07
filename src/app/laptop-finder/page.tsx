"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Compass, CheckCircle2, RotateCcw } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/ProductCard";
import { formatGhs } from "@/lib/utils";

export default function LaptopFinderPage() {
  const { products } = useStore();

  const [useCase, setUseCase] = useState<
    "student" | "office" | "programming" | "design" | "gaming" | "executive"
  >("programming");
  const [maxBudget, setMaxBudget] = useState<number>(25000);
  const [requireImmediateStock, setRequireImmediateStock] =
    useState<boolean>(true);
  const [preferBattery, setPreferBattery] = useState<boolean>(true);

  const recommendations = products
    .filter((p) => p.published && p.categorySlug !== "monitors-accessories")
    .map((p) => {
      let score = 0;
      const reasons: string[] = [];

      if (p.useCases.includes(useCase)) {
        score += 40;
        reasons.push(`Engineered for ${useCase.toUpperCase()} workloads`);
      }
      if (p.priceGhs <= maxBudget) {
        score += 30;
        reasons.push(
          `Within your ${formatGhs(maxBudget)} budget (${formatGhs(p.priceGhs)})`
        );
      } else {
        score -= 25;
      }

      if (requireImmediateStock) {
        if (
          p.supplyState === "OWNED_IN_STOCK" ||
          p.supplyState === "SUPPLIER_CONFIRMED"
        ) {
          score += 20;
          reasons.push("Ready for immediate reservation in Ghana");
        } else {
          score -= 30;
        }
      }

      if (preferBattery && p.specs.weightKg <= 1.65) {
        score += 10;
        reasons.push(
          `Portable (${p.specs.weightKg} kg) with ${p.specs.batteryLife} battery`
        );
      }

      return { product: p, score, reasons };
    })
    .filter((item) => item.score > 20)
    .sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-10 md:py-14">
      <nav aria-label="Breadcrumb" className="text-xs font-mono text-black/60 mb-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        / <span className="text-black font-semibold">Guided Laptop Finder</span>
      </nav>

      <div className="border-b border-black pb-6 mb-8">
        <span className="px-2.5 py-1 bg-black text-white text-xs font-mono uppercase">
          LAPTOP FINDER
        </span>
        <h1 className="text-h1 mt-2">Find Your Ideal Laptop</h1>
        <p className="text-sm text-black/75 mt-1 max-w-2xl">
          Answer 3 quick questions to match your workload and budget with verified devices.
        </p>
      </div>

      {/* Questionnaire Panel */}
      <div className="p-6 sm:p-8 border-2 border-black bg-white rounded-sm space-y-6 mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 1. Primary Use Case */}
          <div className="lg:col-span-6 space-y-2.5">
            <label className="block text-xs font-mono uppercase font-bold">
              1. What is your primary daily workload?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: "student", label: "University / Campus" },
                { id: "office", label: "Business / Accounting" },
                { id: "programming", label: "Software Dev / DevOps" },
                { id: "design", label: "3D CAD / Video / Creative" },
                { id: "gaming", label: "Gaming & AI / RTX" },
                { id: "executive", label: "Executive Travel" },
              ].map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setUseCase(u.id as typeof useCase)}
                  className={`p-3 border text-left text-xs font-mono rounded-sm transition-colors ${
                    useCase === u.id
                      ? "bg-black text-white border-black font-bold"
                      : "bg-white text-black border-black/30 hover:border-black"
                  }`}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Budget & Preferences */}
          <div className="lg:col-span-6 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono uppercase mb-1.5">
                <label htmlFor="finder-budget" className="font-bold">
                  2. Maximum Target Budget (GH₵)
                </label>
                <span className="font-bold text-sm">{formatGhs(maxBudget)}</span>
              </div>
              <input
                id="finder-budget"
                type="range"
                min={7000}
                max={36000}
                step={500}
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-black/60 mt-1">
                <span>GH₵ 7,000</span>
                <span>GH₵ 20,000</span>
                <span>GH₵ 36,000</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-start gap-2.5 p-3 border border-black/30 rounded-sm cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={requireImmediateStock}
                  onChange={(e) => setRequireImmediateStock(e.target.checked)}
                  className="mt-0.5 accent-black"
                />
                <span>
                  <strong>Immediate Dispatch Only</strong> (Verified in-stock)
                </span>
              </label>

              <label className="flex items-start gap-2.5 p-3 border border-black/30 rounded-sm cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={preferBattery}
                  onChange={(e) => setPreferBattery(e.target.checked)}
                  className="mt-0.5 accent-black"
                />
                <span>
                  <strong>Prioritize Long Battery</strong>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-h2">
            Top Matched Recommendations ({recommendations.length})
          </h2>
          <button
            type="button"
            onClick={() => {
              setMaxBudget(35000);
              setRequireImmediateStock(false);
            }}
            className="inline-flex items-center gap-1 text-xs font-mono uppercase underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Expand Criteria</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map(({ product, score, reasons }, idx) => (
            <div key={product.id} className="flex flex-col space-y-2">
              <div className="p-3 bg-black text-white rounded-sm text-xs space-y-1">
                <div className="flex items-center justify-between font-mono uppercase">
                  <span className="font-bold">
                    #{idx + 1} Match ({Math.min(99, score)}% Fit)
                  </span>
                  <span>Why It Matches</span>
                </div>
                <ul className="space-y-0.5 text-[11px] text-white/85">
                  {reasons.map((r, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
