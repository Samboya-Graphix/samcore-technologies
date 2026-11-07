"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { AdminNav } from "@/components/AdminNav";
import { FulfilmentStatus } from "@/lib/types";
import { formatGhs } from "@/lib/utils";

export default function AdminOrdersPage() {
  const {
    orders,
    verifyOrderPayment,
    updateOrderFulfilment,
    refundOrder,
  } = useStore();
  const [search, setSearch] = useState("");

  const filtered = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search)
  );

  return (
    <div>
      <AdminNav />
      <div className="max-w-container mx-auto px-4 sm:px-6 pb-16 space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black pb-5">
          <div>
            <h1 className="text-h1">Orders & Fulfilment Management</h1>
            <p className="text-sm text-black/75 mt-1">
              Payment, Fulfilment, and Availability statuses are tracked as independent fields for every order.
            </p>
          </div>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order ID, Customer, Phone..."
            className="border border-black px-3.5 py-2 text-xs font-mono bg-white w-64"
          />
        </div>

        <div className="space-y-5">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="p-6 border border-black bg-white rounded-sm space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/15 pb-4">
                <div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-base">{order.id}</span>
                    <span className="px-2 py-0.5 bg-black text-white text-[11px] uppercase">
                      {order.paymentMethod.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-black/75 mt-1">
                    Customer: <strong>{order.customerName}</strong> • Phone:{" "}
                    {order.customerPhone} • {order.customerEmail}
                  </p>
                  <p className="text-xs font-mono text-black/65">
                    Zone: {order.deliveryZone} • Address: {order.deliveryAddress}
                  </p>
                </div>

                <div className="text-right font-mono">
                  <span className="text-2xl font-display font-bold block">
                    {formatGhs(order.totalGhs)}
                  </span>
                  {order.paymentProviderRef && (
                    <span className="text-[11px] text-black/60">
                      Ref: {order.paymentProviderRef}
                    </span>
                  )}
                  {order.manualPaymentReferenceNote && (
                    <span className="text-[11px] text-black/80 block">
                      Manual Ref: {order.manualPaymentReferenceNote}
                    </span>
                  )}
                </div>
              </div>

              {/* Controls for 3 Independent Statuses */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3.5 border border-black space-y-2">
                  <div className="flex justify-between">
                    <span className="text-black/60 uppercase">
                      1. Payment Status
                    </span>
                    <strong className="uppercase">{order.paymentStatus}</strong>
                  </div>
                  {order.paymentStatus === "pending" && (
                    <button
                      type="button"
                      onClick={() =>
                        verifyOrderPayment(
                          order.id,
                          "Manual Settlement Approved by Admin"
                        )
                      }
                      className="w-full py-1.5 bg-black text-white uppercase rounded-sm"
                    >
                      Approve Manual Settlement
                    </button>
                  )}
                </div>

                <div className="p-3.5 border border-black space-y-2">
                  <label className="block text-black/60 uppercase">
                    2. Fulfilment Stage
                  </label>
                  <select
                    value={order.fulfilmentStatus}
                    onChange={(e) =>
                      updateOrderFulfilment(
                        order.id,
                        e.target.value as FulfilmentStatus
                      )
                    }
                    className="w-full border border-black px-2.5 py-1.5 bg-white uppercase font-bold"
                  >
                    {[
                      "placed",
                      "confirmed",
                      "processing",
                      "dispatched",
                      "delivered",
                      "on_hold",
                      "cancelled",
                      "returned",
                    ].map((st) => (
                      <option key={st} value={st}>
                        {st.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3.5 border border-black flex flex-col justify-between">
                  <div className="flex justify-between">
                    <span className="text-black/60 uppercase">
                      3. Stock Ledger
                    </span>
                    <strong className="uppercase">
                      {order.availabilityStatus}
                    </strong>
                  </div>
                  {order.paymentStatus !== "refunded" && (
                    <button
                      type="button"
                      onClick={() =>
                        refundOrder(
                          order.id,
                          "Customer Return / Admin Audited Refund"
                        )
                      }
                      className="mt-2 py-1.5 border border-black hover:bg-black hover:text-white uppercase rounded-sm"
                    >
                      Issue Refund & Restore Stock
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
