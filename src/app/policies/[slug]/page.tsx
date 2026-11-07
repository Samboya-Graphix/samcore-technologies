"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { formatGhs } from "@/lib/utils";

export default function PolicyDetailPage() {
  const params = useParams<{ slug: string }>();
  const { settings } = useStore();
  const slug = params?.slug || "warranty";

  const policyMap: Record<
    string,
    { title: string; subtitle: string; sections: { h: string; p: string }[] }
  > = {
    warranty: {
      title: "Hardware Warranty & Returns Policy",
      subtitle: "Effective 16 October 2026 • SAMCORE TECHNOLOGIES GHANA",
      sections: [
        {
          h: "1. Coverage Period",
          p: "Brand New laptops carry a 12-Month SAMCORE + Manufacturer Hardware Warranty. UK Used (Grade A) and Factory Refurbished units carry a 6-Month SAMCORE Hardware Warranty covering motherboard, RAM, SSD, and display panel defects under normal usage.",
        },
        {
          h: "2. 7-Day Diagnostic Inspection Guarantee",
          p: "If a delivered laptop fails to match its published technical specifications or exhibits a verified hardware fault within 7 days of delivery, SAMCORE provides a priority replacement or full refund.",
        },
        {
          h: "3. Exclusions",
          p: "Physical screen breakage, liquid spills, unauthorized BIOS modification, or power surge damage from ungrounded generators without surge protection are excluded from standard warranty coverage.",
        },
      ],
    },
    delivery: {
      title: "Ghana Delivery Zones, Timelines & Insured Courier Policy",
      subtitle: "Same-Day Accra Dispatch & Nationwide Insured Shipping",
      sections: settings.deliveryZones.map((z) => ({
        h: `${z.name} — ${z.feeGhs === 0 ? "FREE" : formatGhs(z.feeGhs)}`,
        p: `Estimated delivery window: ${z.eta}. Dispatched with tamper-evident security seal and diagnostic sheet.`,
      })),
    },
    privacy: {
      title: "Privacy, Data Protection & Terms of Sale",
      subtitle: "Ghana Data Protection Act Compliance & Customer Security",
      sections: [
        {
          h: "1. Direct Order & Payment Security",
          p: "SAMCORE TECHNOLOGIES protects your personal and payment details. Orders are confirmed directly with our official sales desk via WhatsApp DM (050 946 1505) before any payment is settled.",
        },
        {
          h: "2. Order Lookup Privacy",
          p: "Customer names, delivery addresses, and phone numbers are protected behind dual verification (Order Reference + Registered Phone/Email).",
        },
        {
          h: "3. Data Confidentiality",
          p: "Customer delivery records and contact information are used strictly for order fulfilment, warranty support, and insured courier dispatch across Ghana.",
        },
      ],
    },
  };

  const activePolicy = policyMap[slug] || policyMap.warranty;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <div className="flex flex-wrap gap-2 mb-6 text-xs font-mono">
        {["warranty", "delivery", "privacy"].map((k) => (
          <Link
            key={k}
            href={`/policies/${k}`}
            className={`px-3 py-1.5 border border-black uppercase rounded-sm ${
              slug === k ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            {k} Policy
          </Link>
        ))}
      </div>

      <div className="border-b border-black pb-6 mb-8">
        <p className="text-xs font-mono uppercase text-black/60">
          {activePolicy.subtitle}
        </p>
        <h1 className="text-h1 mt-1">{activePolicy.title}</h1>
      </div>

      <div className="space-y-6">
        {activePolicy.sections.map((s, i) => (
          <div key={i} className="p-6 border border-black bg-white space-y-2">
            <h2 className="font-display font-bold text-lg">{s.h}</h2>
            <p className="text-sm text-black/80 leading-relaxed">{s.p}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
