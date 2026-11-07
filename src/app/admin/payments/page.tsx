"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { AdminNav } from "@/components/AdminNav";
import { formatGhs } from "@/lib/utils";

export default function AdminPaymentsPage() {
  const { orders, verifyOrderPayment, refundOrder } = useStore();

  return (
    <div>
      <AdminNav />
      <div className="max-w-container mx-auto px-4 sm:px-6 pb-16 space-y-8">
        <div className="border-b border-black pb-5">
          <h1 className="text-h1">Payments, Manual Settlement & Refunds</h1>
          <p className="text-sm text-black/75 mt-1">
            Reconcile online gateway webhook references, verify manual MoMo/bank transfers, and audit refunds.
          </p>
        </div>

        <div className="overflow-x-auto border border-black rounded-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-black text-white font-mono uppercase">
                <th className="p-3.5">Order ID</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Method</th>
                <th className="p-3.5">Provider / Manual Ref</th>
                <th className="p-3.5">Amount (GH₵)</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Reconciliation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/15 font-mono">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="p-3.5 font-bold">{o.id}</td>
                  <td className="p-3.5">{o.customerName}</td>
                  <td className="p-3.5">{o.paymentMethod}</td>
                  <td className="p-3.5">
                    {o.paymentProviderRef ||
                      o.manualPaymentReferenceNote ||
                      "Pending Reference"}
                  </td>
                  <td className="p-3.5 font-bold">{formatGhs(o.totalGhs)}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 border border-black uppercase ${
                        o.paymentStatus === "paid"
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      }`}
                    >
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3.5 space-x-2">
                    {o.paymentStatus === "pending" && (
                      <button
                        type="button"
                        onClick={() =>
                          verifyOrderPayment(
                            o.id,
                            `MOMO_RECONCILED_${Date.now().toString().slice(-4)}`
                          )
                        }
                        className="px-3 py-1 bg-black text-white uppercase rounded-sm"
                      >
                        Verify Settlement
                      </button>
                    )}
                    {o.paymentStatus === "paid" && (
                      <button
                        type="button"
                        onClick={() =>
                          refundOrder(o.id, "Reconciliation Refund")
                        }
                        className="px-3 py-1 border border-black hover:bg-black hover:text-white uppercase rounded-sm"
                      >
                        Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
