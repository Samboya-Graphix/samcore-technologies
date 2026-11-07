"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PackageCheck, PackageX, Edit3 } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { AdminNav } from "@/components/AdminNav";
import { SupplyState } from "@/lib/types";
import { SupplyStatusBadge } from "@/components/SupplyStatusBadge";
import { isProductOutOfStock } from "@/lib/utils";

export default function AdminInventoryPage() {
  const { products, adjustProductInventory } = useStore();
  const [tab, setTab] = useState<"ALL" | "OWNED" | "SUPPLIER" | "OUT_OF_STOCK">("ALL");

  const filtered = products.filter((p) => {
    const out = isProductOutOfStock(p);
    if (tab === "OUT_OF_STOCK") return out;
    if (tab === "OWNED") return !out && (p.supplyState === "OWNED_IN_STOCK" || p.ownedQtyAvailable > 0);
    if (tab === "SUPPLIER")
      return (
        p.supplyState === "SUPPLIER_CONFIRMED" ||
        p.supplyState === "SUPPLIER_UNKNOWN" ||
        p.supplyState === "PRE_ORDER"
      );
    return true;
  });

  return (
    <div>
      <AdminNav />
      <div className="max-w-container mx-auto px-4 sm:px-6 pb-16 space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black pb-5">
          <div>
            <h1 className="text-h1">Inventory &amp; Restocking Ledger</h1>
            <p className="text-sm text-black/75 mt-1">
              Update which gadgets are available or Out of Stock, restock owned quantities, and manage partner allocations. To upload device photos or edit specs, open{" "}
              <Link href="/admin/products" className="underline font-bold">
                Products &amp; Specs
              </Link>
              .
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: "ALL", label: "All Inventory" },
              { id: "OWNED", label: "Available In-Stock" },
              { id: "SUPPLIER", label: "Supplier / Pre-Order" },
              { id: "OUT_OF_STOCK", label: "Out of Stock" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id as typeof tab)}
                className={`px-3.5 py-2 text-xs font-mono uppercase border border-black rounded-sm ${
                  tab === t.id
                    ? "bg-black text-white font-bold"
                    : "bg-white text-black"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto border border-black rounded-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-black text-white font-mono uppercase">
                <th className="p-3.5">Device / Specs</th>
                <th className="p-3.5">Current Supply State</th>
                <th className="p-3.5">Owned Avail</th>
                <th className="p-3.5">Reserved</th>
                <th className="p-3.5">Supplier Allocation</th>
                <th className="p-3.5">Quick Restock / Out of Stock</th>
                <th className="p-3.5">Change State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/15">
              {filtered.map((p) => {
                const out = isProductOutOfStock(p);
                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-black/[0.02] ${
                      out ? "bg-black/[0.03]" : ""
                    }`}
                  >
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-10 border border-black bg-black/5 shrink-0 overflow-hidden rounded-sm">
                          <img
                            src={p.images[0]}
                            alt={p.shortTitle}
                            className={`w-full h-full object-cover ${
                              out ? "grayscale opacity-60" : ""
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{p.shortTitle}</p>
                          <p className="font-mono text-black/60">
                            {p.sku} • {p.specs.ramText} / {p.specs.storageText}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <SupplyStatusBadge product={p} size="sm" />
                    </td>
                    <td className="p-3.5 font-mono">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            adjustProductInventory(p.id, {
                              ownedQtyAvailable: Math.max(
                                0,
                                p.ownedQtyAvailable - 1
                              ),
                            })
                          }
                          className="px-2 py-0.5 border border-black bg-white hover:bg-black hover:text-white"
                        >
                          -
                        </button>
                        <span className="font-bold px-2">
                          {p.ownedQtyAvailable}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            adjustProductInventory(p.id, {
                              ownedQtyAvailable: p.ownedQtyAvailable + 1,
                              supplyState: "OWNED_IN_STOCK",
                            })
                          }
                          className="px-2 py-0.5 border border-black bg-white hover:bg-black hover:text-white"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono font-bold">
                      {p.ownedQtyReserved}
                    </td>
                    <td className="p-3.5 font-mono">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            adjustProductInventory(p.id, {
                              supplierAllocationQty: Math.max(
                                0,
                                (p.supplierAllocationQty ?? 0) - 1
                              ),
                            })
                          }
                          className="px-2 py-0.5 border border-black bg-white hover:bg-black hover:text-white"
                        >
                          -
                        </button>
                        <span className="font-bold px-2">
                          {p.supplierAllocationQty ?? 0}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            adjustProductInventory(p.id, {
                              supplierAllocationQty:
                                (p.supplierAllocationQty ?? 0) + 1,
                              supplyState: "SUPPLIER_CONFIRMED",
                            })
                          }
                          className="px-2 py-0.5 border border-black bg-white hover:bg-black hover:text-white"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {out ? (
                          <button
                            type="button"
                            onClick={() =>
                              adjustProductInventory(p.id, {
                                supplyState: "OWNED_IN_STOCK",
                                ownedQtyAvailable: Math.max(3, p.ownedQtyAvailable || 3),
                              })
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-black text-white text-[11px] uppercase font-bold rounded-sm"
                          >
                            <PackageCheck className="w-3.5 h-3.5" />
                            <span>Restock (+3)</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              adjustProductInventory(p.id, {
                                supplyState: "OUT_OF_STOCK",
                                ownedQtyAvailable: 0,
                              })
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-black bg-white text-black text-[11px] uppercase font-semibold rounded-sm hover:bg-black hover:text-white"
                          >
                            <PackageX className="w-3.5 h-3.5" />
                            <span>Mark Out of Stock</span>
                          </button>
                        )}
                        <Link
                          href="/admin/products"
                          className="inline-flex items-center gap-1 px-2 py-1.5 border border-black/30 hover:border-black text-[11px] uppercase rounded-sm"
                          title="Edit Device Picture & Specs"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Specs/Photo</span>
                        </Link>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono">
                      <select
                        value={p.supplyState}
                        onChange={(e) =>
                          adjustProductInventory(p.id, {
                            supplyState: e.target.value as SupplyState,
                          })
                        }
                        className="border border-black px-2.5 py-1.5 bg-white"
                      >
                        <option value="OWNED_IN_STOCK">IN STOCK (OWNED)</option>
                        <option value="OUT_OF_STOCK">OUT OF STOCK</option>
                        <option value="SUPPLIER_CONFIRMED">
                          PARTNER ALLOCATION
                        </option>
                        <option value="SUPPLIER_UNKNOWN">
                          CONFIRM AVAILABILITY
                        </option>
                        <option value="PRE_ORDER">PRE-ORDER</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
