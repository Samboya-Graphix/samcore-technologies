"use client";

import React from "react";
import { Shield } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { AdminNav } from "@/components/AdminNav";

export default function AdminStaffPage() {
  const { adminRole, setAdminRole, auditLogs } = useStore();

  return (
    <div>
      <AdminNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16 space-y-8">
        <div className="border-b border-black pb-5">
          <h1 className="text-h1">Staff Access Control & Role Permissions</h1>
          <p className="text-sm text-black/75 mt-1">
            Role permissions separate Owner/Admin from Staff. High-impact actions are logged to the security audit trail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
          <div className="p-6 border-2 border-black bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 bg-black text-white font-bold uppercase">
                Owner / Administrator
              </span>
              <Shield className="w-4 h-4" />
            </div>
            <p className="font-sans text-sm text-black/80">
              Full access to supplier costs, gross margin calculations, private customer addresses, payment verification, refunds, and staff permissions.
            </p>
            <button
              type="button"
              onClick={() => setAdminRole("Owner/Admin")}
              className={`w-full py-2 border border-black uppercase ${
                adminRole === "Owner/Admin"
                  ? "bg-black text-white font-bold"
                  : "bg-white text-black"
              }`}
            >
              {adminRole === "Owner/Admin" ? "Active Session Role" : "Switch to Owner/Admin"}
            </button>
          </div>

          <div className="p-6 border border-black bg-white space-y-3">
            <span className="px-2 py-0.5 border border-black font-bold uppercase inline-block">
              Storefront / Fulfilment Staff
            </span>
            <p className="font-sans text-sm text-black/80">
              Can manage product descriptions, update order fulfilment status, and handle availability enquiries. Supplier costs, gross margins, and private addresses are masked.
            </p>
            <button
              type="button"
              onClick={() => setAdminRole("Staff")}
              className={`w-full py-2 border border-black uppercase ${
                adminRole === "Staff"
                  ? "bg-black text-white font-bold"
                  : "bg-white text-black"
              }`}
            >
              {adminRole === "Staff" ? "Active Session Role" : "Switch to Staff Role"}
            </button>
          </div>
        </div>

        <div className="border border-black rounded-sm overflow-hidden text-xs font-mono">
          <div className="p-4 bg-black text-white uppercase font-bold">
            Recent Staff & Admin Audit Trail ({auditLogs.length})
          </div>
          <div className="divide-y divide-black/15">
            {auditLogs.map((l, idx) => (
              <div key={`${l.id}-${idx}`} className="p-4">
                <p className="text-black/60">
                  {l.timestamp} • {l.actor} ({l.role})
                </p>
                <p className="font-bold">
                  {l.action} [{l.entityRef}]
                </p>
                <p>{l.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
