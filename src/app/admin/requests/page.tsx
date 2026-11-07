"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { AdminNav } from "@/components/AdminNav";
import { formatGhs } from "@/lib/utils";
import { AvailabilityRequestRecord } from "@/lib/types";

export default function AdminRequestsPage() {
  const { requests, suppliers, updateAvailabilityRequest } = useStore();

  return (
    <div>
      <AdminNav />
      <div className="max-w-container mx-auto px-4 sm:px-6 pb-16 space-y-8">
        <div className="border-b border-black pb-5">
          <h1 className="text-h1">Availability Enquiries & Supplier Sourcing</h1>
          <p className="text-sm text-black/75 mt-1">
            Review customer requests for unconfirmed supplier items or custom devices, assign suppliers, and issue GH₵ quotes.
          </p>
        </div>

        <div className="space-y-5">
          {requests.map((req) => (
            <div
              key={req.id}
              className="p-6 border border-black bg-white rounded-sm space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/15 pb-4">
                <div>
                  <span className="px-2 py-0.5 bg-black text-white text-xs font-mono uppercase">
                    {req.id} • {req.status}
                  </span>
                  <h2 className="font-display font-bold text-lg mt-1.5">
                    {req.productName}
                  </h2>
                  <p className="text-xs font-mono text-black/75">
                    Specs: {req.desiredSpecs} • Condition:{" "}
                    {req.conditionPreference}
                  </p>
                </div>
                <div className="text-right font-mono text-xs">
                  <span className="block text-black/60 uppercase">
                    Customer Budget
                  </span>
                  <span className="text-xl font-display font-bold">
                    {formatGhs(req.budgetGhs)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <span className="text-black/60 block uppercase">
                    Customer Contact
                  </span>
                  <p className="font-bold">{req.customerName}</p>
                  <p>
                    {req.customerPhone} • {req.customerEmail}
                  </p>
                  <p className="text-black/70 mt-1">{req.notes}</p>
                </div>

                <div>
                  <label className="block text-black/60 uppercase mb-1">
                    Assign Partner Supplier
                  </label>
                  <select
                    value={req.assignedSupplierId || ""}
                    onChange={(e) =>
                      updateAvailabilityRequest(req.id, {
                        assignedSupplierId: e.target.value,
                      })
                    }
                    className="w-full border border-black px-3 py-2 bg-white"
                  >
                    <option value="">-- Select Supplier --</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-black/60 uppercase mb-1">
                    Workflow Status
                  </label>
                  <select
                    value={req.status}
                    onChange={(e) =>
                      updateAvailabilityRequest(req.id, {
                        status: e.target
                          .value as AvailabilityRequestRecord["status"],
                      })
                    }
                    className="w-full border border-black px-3 py-2 bg-white font-bold"
                  >
                    {[
                      "New Enquiry",
                      "Sourcing with Supplier",
                      "Quoted to Customer",
                      "Converted to Order",
                      "Closed",
                    ].map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
