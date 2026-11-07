"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { formatGhs } from "@/lib/utils";

export default function AccountOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { orders } = useStore();
  const order = orders.find((o) => o.id === params?.id) || orders[0];

  if (!order) {
    return (
      <div className="max-w-container mx-auto px-4 py-16 text-center">
        <h1 className="text-h2">Order Not Found</h1>
        <Link href="/account/orders" className="underline text-xs font-mono">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <nav aria-label="Breadcrumb" className="text-xs font-mono text-black/60 mb-4">
        <Link href="/account" className="hover:underline">
          My Account
        </Link>{" "}
        /{" "}
        <Link href="/account/orders" className="hover:underline">
          Orders
        </Link>{" "}
        / <span className="text-black font-semibold">{order.id}</span>
      </nav>

      <div className="p-6 sm:p-8 border-2 border-black bg-white rounded-sm space-y-6">
        <div className="flex flex-wrap justify-between gap-4 border-b border-black pb-5">
          <div>
            <h1 className="text-h2">Order {order.id}</h1>
            <p className="text-xs font-mono text-black/70 mt-1">
              Recipient: {order.customerName} ({order.customerPhone})
            </p>
            <p className="text-xs font-mono text-black/70">
              Delivery Address: {order.deliveryAddress}
            </p>
          </div>
          <div className="text-right font-mono">
            <span className="text-xs uppercase text-black/60 block">Total</span>
            <span className="text-2xl font-display font-bold">
              {formatGhs(order.totalGhs)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 border border-black">
            <span className="text-black/60 block uppercase">Payment</span>
            <strong className="uppercase">{order.paymentStatus}</strong>
          </div>
          <div className="p-3 border border-black">
            <span className="text-black/60 block uppercase">Fulfilment</span>
            <strong className="uppercase">{order.fulfilmentStatus}</strong>
          </div>
          <div className="p-3 border border-black">
            <span className="text-black/60 block uppercase">Availability</span>
            <strong className="uppercase">{order.availabilityStatus}</strong>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-mono text-xs uppercase font-bold">
            Purchased Items Snapshot
          </h2>
          {order.items.map((item, i) => (
            <div
              key={i}
              className="p-4 border border-black/25 flex justify-between text-xs"
            >
              <div>
                <p className="font-bold text-sm">{item.name}</p>
                <p className="font-mono text-black/70 mt-0.5">
                  SKU: {item.sku} • {item.condition} • {item.warrantyMonths}M Warranty
                </p>
                <p className="font-mono text-black/60">{item.specsSnapshot}</p>
              </div>
              <span className="font-mono font-bold">
                {item.quantity} × {formatGhs(item.unitPriceGhs)}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h2 className="font-mono text-xs uppercase font-bold">
            Audit & Fulfilment Events
          </h2>
          <div className="border-l-2 border-black pl-4 space-y-3 text-xs">
            {order.events.map((evt) => (
              <div key={evt.id}>
                <p className="font-mono text-black/60">
                  {evt.timestamp} • {evt.actor}
                </p>
                <p className="font-bold">{evt.title}</p>
                <p className="text-black/80">{evt.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
