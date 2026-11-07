"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatGhs } from "@/lib/utils";

export default function AccountOrdersPage() {
  const { orders } = useStore();

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-10 md:py-14">
      <nav aria-label="Breadcrumb" className="text-xs font-mono text-black/60 mb-4">
        <Link href="/account" className="hover:underline">
          My Account
        </Link>{" "}
        / <span className="text-black font-semibold">Orders & Warranties</span>
      </nav>

      <div className="border-b border-black pb-6 mb-8">
        <h1 className="text-h1">Purchase & Warranty History</h1>
        <p className="text-sm text-black/75 mt-1">
          Every order preserves an immutable snapshot of specifications, condition, price, and warranty duration at purchase time.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-6 border border-black bg-white rounded-sm space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/15 pb-4">
              <div>
                <span className="font-mono font-bold text-base">{order.id}</span>
                <p className="text-xs font-mono text-black/65">
                  Placed: {order.createdAt.slice(0, 10)} • Zone:{" "}
                  {order.deliveryZone}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 border border-black uppercase">
                  Payment: {order.paymentStatus}
                </span>
                <span className="px-2.5 py-1 bg-black text-white uppercase">
                  Fulfilment: {order.fulfilmentStatus}
                </span>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="px-3 py-1 border border-black underline uppercase hover:bg-black hover:text-white"
                >
                  Full Details →
                </Link>
              </div>
            </div>

            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-sm">{item.name}</p>
                    <p className="font-mono text-black/65">
                      {item.specsSnapshot} • {item.warrantyMonths}-Month Warranty
                    </p>
                  </div>
                  <span className="font-mono font-bold">
                    {item.quantity} × {formatGhs(item.unitPriceGhs)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
