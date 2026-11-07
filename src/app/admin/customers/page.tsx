"use client";

import React from "react";
import { ShieldAlert } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { AdminNav } from "@/components/AdminNav";
import { formatGhs } from "@/lib/utils";

export default function AdminCustomersPage() {
  const { orders, currentUser, adminRole } = useStore();

  return (
    <div>
      <AdminNav />
      <div className="max-w-container mx-auto px-4 sm:px-6 pb-16 space-y-8">
        <div className="border-b border-black pb-5">
          <h1 className="text-h1">Customer Directory & Address Privacy</h1>
          <p className="text-sm text-black/75 mt-1">
            Customer profiles, order history, and role-controlled private address visibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="p-6 border border-black bg-white space-y-3 text-xs font-mono"
            >
              <div className="flex justify-between">
                <span className="font-bold text-sm">{ord.customerName}</span>
                <span className="px-2 py-0.5 bg-black text-white uppercase">
                  {ord.isGuest ? "Guest Buyer" : "Registered Member"}
                </span>
              </div>
              <p>
                Email: {ord.customerEmail} • Phone: {ord.customerPhone}
              </p>
              <p>
                Private Delivery Address:{" "}
                {adminRole === "Owner/Admin" ? (
                  <strong>{ord.deliveryAddress}</strong>
                ) : (
                  <span className="inline-flex items-center gap-1 text-black/60">
                    <ShieldAlert className="w-3.5 h-3.5" /> Masked for Staff Role (Zone: {ord.deliveryZone})
                  </span>
                )}
              </p>
              <p>
                Latest Order: <strong>{ord.id}</strong> ({formatGhs(ord.totalGhs)})
              </p>
              {!ord.isGuest && currentUser && (
                <p>Loyalty Points Balance: {currentUser.loyaltyPoints} PTS</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
