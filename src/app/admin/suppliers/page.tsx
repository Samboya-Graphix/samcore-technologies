"use client";

import React from "react";
import { ShieldAlert } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { AdminNav } from "@/components/AdminNav";
import { formatGhs } from "@/lib/utils";

export default function AdminSuppliersPage() {
  const { suppliers, products, adminRole } = useStore();

  return (
    <div>
      <AdminNav />
      <div className="max-w-container mx-auto px-4 sm:px-6 pb-16 space-y-8">
        <div className="border-b border-black pb-5">
          <h1 className="text-h1">Suppliers, Allocations & Cost Records</h1>
          <p className="text-sm text-black/75 mt-1">
            Partner warehouse contacts, active allocations, lead times, and confidential supplier cost records.
          </p>
        </div>

        {adminRole !== "Owner/Admin" ? (
          <div className="p-8 border-2 border-black bg-white flex items-center gap-3 text-sm font-mono">
            <ShieldAlert className="w-6 h-6 shrink-0" />
            <span>
              Access Restricted: Supplier cost offers and margin records are restricted to the Owner/Admin account.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {suppliers.map((sup) => {
              const linkedProducts = products.filter(
                (p) => p.supplierId === sup.id
              );
              return (
                <div
                  key={sup.id}
                  className="p-6 border border-black bg-white rounded-sm space-y-4"
                >
                  <div className="flex justify-between text-xs font-mono">
                    <span className="px-2 py-0.5 bg-black text-white font-bold">
                      {sup.id}
                    </span>
                    <span>{sup.reliabilityRating}</span>
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg">
                      {sup.name}
                    </h2>
                    <p className="text-xs font-mono text-black/65 mt-0.5">
                      {sup.location}
                    </p>
                  </div>

                  <div className="text-xs font-mono space-y-1 border-y border-black/15 py-3">
                    <p>Contact: {sup.contactPerson}</p>
                    <p>Phone: {sup.phone}</p>
                    <p>Email: {sup.email}</p>
                    <p>Avg Lead Time: {sup.averageLeadTimeDays} Business Day(s)</p>
                    <p>Last Verified: {sup.lastVerifiedAt}</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <p className="font-mono uppercase font-bold">
                      Linked Supplier Offers ({linkedProducts.length}):
                    </p>
                    {linkedProducts.map((lp) => (
                      <div
                        key={lp.id}
                        className="p-2.5 bg-black/[0.03] border border-black/20 font-mono"
                      >
                        <p className="font-bold">{lp.shortTitle}</p>
                        <p>
                          Cost: {formatGhs(lp.costPriceGhs)} → Retail:{" "}
                          {formatGhs(lp.priceGhs)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
