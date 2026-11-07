"use client";

import React from "react";
import Link from "next/link";
import {
  Scale,
  X,
  ShoppingBag,
  Plus,
  FileQuestion,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { SupplyStatusBadge } from "@/components/SupplyStatusBadge";
import { formatGhs, canImmediateCheckout } from "@/lib/utils";

export default function ComparePage() {
  const {
    products,
    compareIds,
    toggleCompare,
    clearCompare,
    addToCart,
  } = useStore();

  const comparedProducts = compareIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  const candidateToAdd = products.filter(
    (p) => p.published && !compareIds.includes(p.id)
  );

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-10 md:py-14">
      <nav aria-label="Breadcrumb" className="text-xs font-mono text-black/60 mb-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        / <span className="text-black font-semibold">Laptop Comparison</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black pb-6 mb-8">
        <div>
          <span className="px-2.5 py-1 bg-black text-white text-xs font-mono uppercase">
            SIDE-BY-SIDE BENCHMARK (MAX 3 UNITS)
          </span>
          <h1 className="text-h1 mt-2">Compare Laptops ({comparedProducts.length}/3)</h1>
          <p className="text-sm text-black/75 mt-1">
            Compare processors, memory bandwidth, display panels, weight, warranty, and live Ghana supply state.
          </p>
        </div>

        {comparedProducts.length > 0 && (
          <button
            type="button"
            onClick={clearCompare}
            className="text-xs font-mono uppercase underline self-start sm:self-auto"
          >
            Clear Comparison Tray
          </button>
        )}
      </div>

      {/* Quick Add selector if fewer than 3 */}
      {comparedProducts.length < 3 && (
        <div className="mb-8 p-4 border border-black bg-black/[0.02] flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-mono uppercase font-bold">
            Add another model to compare ({3 - comparedProducts.length} slot(s) open):
          </span>
          <div className="flex flex-wrap gap-2">
            {candidateToAdd.slice(0, 4).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCompare(c.id)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-black text-xs font-mono hover:bg-black hover:text-white rounded-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{c.shortTitle}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {comparedProducts.length === 0 ? (
        <div className="p-12 border border-dashed border-black text-center space-y-4">
          <Scale className="w-10 h-10 mx-auto" />
          <h2 className="text-h3">No Laptops Selected for Comparison</h2>
          <p className="text-sm text-black/75 max-w-md mx-auto">
            Select up to 3 laptops using the scale icon on any product card or click one of the models above.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-black text-white px-6 py-3 text-xs font-mono uppercase rounded-sm"
          >
            Browse Catalogue
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto border border-black rounded-sm">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead>
              <tr className="border-b border-black bg-black/[0.02]">
                <th className="w-48 p-4 font-mono text-xs uppercase text-black/70 border-r border-black/20 sticky left-0 bg-white z-10">
                  Specification
                </th>
                {comparedProducts.map((prod) => (
                  <th
                    key={prod.id}
                    className="p-4 border-r last:border-r-0 border-black/20 align-top w-72"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono uppercase text-black/60">
                        {prod.brand} • {prod.condition}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleCompare(prod.id)}
                        className="p-1 border border-black/30 hover:bg-black hover:text-white rounded-sm"
                        aria-label={`Remove ${prod.shortTitle}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-full h-36 object-cover border border-black/15 mb-3"
                    />
                    <Link
                      href={`/products/${prod.slug}`}
                      className="font-display font-bold text-base hover:underline block"
                    >
                      {prod.shortTitle}
                    </Link>
                    <p className="font-display font-bold text-xl mt-2">
                      {formatGhs(prod.priceGhs)}
                    </p>
                    <div className="mt-2">
                      <SupplyStatusBadge product={prod} size="sm" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-xs">
              {[
                {
                  label: "Processor (CPU)",
                  render: (p: (typeof products)[0]) => p.specs.processor,
                },
                {
                  label: "Memory (RAM)",
                  render: (p: (typeof products)[0]) => p.specs.ramText,
                },
                {
                  label: "Storage (SSD)",
                  render: (p: (typeof products)[0]) => p.specs.storageText,
                },
                {
                  label: "Display Panel",
                  render: (p: (typeof products)[0]) => p.specs.display,
                },
                {
                  label: "Graphics (GPU)",
                  render: (p: (typeof products)[0]) => p.specs.graphics,
                },
                {
                  label: "Battery Life",
                  render: (p: (typeof products)[0]) => p.specs.batteryLife,
                },
                {
                  label: "Chassis Weight",
                  render: (p: (typeof products)[0]) => `${p.specs.weightKg} kg`,
                },
                {
                  label: "Ports & I/O",
                  render: (p: (typeof products)[0]) => p.specs.ports,
                },
                {
                  label: "Operating System",
                  render: (p: (typeof products)[0]) => p.specs.os,
                },
                {
                  label: "Warranty Coverage",
                  render: (p: (typeof products)[0]) =>
                    `${p.specs.warrantyMonths} Months SAMCORE Warranty`,
                },
              ].map((row, idx) => (
                <tr
                  key={row.label}
                  className={`border-b border-black/15 ${
                    idx % 2 === 0 ? "bg-white" : "bg-black/[0.02]"
                  }`}
                >
                  <td className="p-4 font-mono uppercase font-semibold text-black/75 border-r border-black/20 sticky left-0 bg-inherit">
                    {row.label}
                  </td>
                  {comparedProducts.map((prod) => (
                    <td
                      key={prod.id}
                      className="p-4 border-r last:border-r-0 border-black/20 font-medium text-sm"
                    >
                      {row.render(prod)}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Action Row */}
              <tr>
                <td className="p-4 font-mono uppercase font-bold border-r border-black/20 sticky left-0 bg-white">
                  Action
                </td>
                {comparedProducts.map((prod) => (
                  <td
                    key={prod.id}
                    className="p-4 border-r last:border-r-0 border-black/20"
                  >
                    {canImmediateCheckout(prod) ? (
                      <button
                        type="button"
                        onClick={() => addToCart(prod.id, 1)}
                        className="w-full inline-flex items-center justify-center gap-1.5 bg-black text-white py-2.5 px-4 font-mono uppercase rounded-sm hover:bg-black/85"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    ) : (
                      <Link
                        href={`/request-device?product=${prod.slug}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 border border-black py-2.5 px-4 font-mono uppercase rounded-sm hover:bg-black hover:text-white"
                      >
                        <FileQuestion className="w-3.5 h-3.5" />
                        <span>Request Stock</span>
                      </Link>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
