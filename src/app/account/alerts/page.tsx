"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, Trash2 } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function AccountAlertsPage() {
  const { alerts, products, subscribeRestockAlert, removeRestockAlert } =
    useStore();
  const [selectedProdId, setSelectedProdId] = useState(products[8]?.id || "PRD-009");
  const [contact, setContact] = useState("+233 24 411 2233");
  const [channel, setChannel] = useState<"WhatsApp" | "Email" | "SMS">(
    "WhatsApp"
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <nav aria-label="Breadcrumb" className="text-xs font-mono text-black/60 mb-4">
        <Link href="/account" className="hover:underline">
          My Account
        </Link>{" "}
        / <span className="text-black font-semibold">Restock Alerts</span>
      </nav>

      <div className="border-b border-black pb-6 mb-8">
        <h1 className="text-h1">Restock & Price Alert Subscriptions</h1>
        <p className="text-sm text-black/75 mt-1">
          Receive priority notifications via WhatsApp, SMS, or Email when UK Used Grade-A or new shipments arrive in Accra.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          subscribeRestockAlert(selectedProdId, contact, channel);
        }}
        className="p-6 border border-black bg-white rounded-sm space-y-4 mb-8"
      >
        <h2 className="font-display font-bold text-base uppercase">
          Add New Restock Alert
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-mono uppercase mb-1">Model</label>
            <select
              value={selectedProdId}
              onChange={(e) => setSelectedProdId(e.target.value)}
              className="w-full border border-black px-3 py-2 bg-white"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.shortTitle} ({p.supplyState})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-mono uppercase mb-1">Channel</label>
            <select
              value={channel}
              onChange={(e) =>
                setChannel(e.target.value as "WhatsApp" | "Email" | "SMS")
              }
              className="w-full border border-black px-3 py-2 bg-white"
            >
              <option value="WhatsApp">WhatsApp</option>
              <option value="Email">Email</option>
              <option value="SMS">SMS</option>
            </select>
          </div>
          <div>
            <label className="block font-mono uppercase mb-1">
              Number / Email
            </label>
            <input
              type="text"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full border border-black px-3 py-2 bg-white"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-black text-white px-5 py-2.5 text-xs font-mono uppercase rounded-sm"
        >
          Subscribe to Alert
        </button>
      </form>

      <div className="space-y-3">
        {alerts.map((a) => (
          <div
            key={a.id}
            className="p-4 border border-black flex items-center justify-between text-xs"
          >
            <div>
              <p className="font-bold text-sm">{a.productName}</p>
              <p className="font-mono text-black/65">
                {a.channel}: {a.emailOrPhone} • Added {a.createdAt}
              </p>
            </div>
            <button
              type="button"
              onClick={() => removeRestockAlert(a.id)}
              className="px-3 py-1.5 border border-black font-mono uppercase hover:bg-black hover:text-white inline-flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
