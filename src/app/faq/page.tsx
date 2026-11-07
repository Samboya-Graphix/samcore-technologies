"use client";

import React from "react";
import Link from "next/link";

const FAQS = [
  {
    q: "How do stock statuses work?",
    a: "In-Stock items are verified and ready for immediate dispatch. Sourced On-Demand items are confirmed with partner inventory before any payment is requested.",
  },
  {
    q: "How do I place an order?",
    a: "Select your device, choose your RAM/SSD specs, and tap 'Order via WhatsApp DM'. Your exact configuration is sent directly to our team at 050 946 1505 to finalize delivery.",
  },
  {
    q: "What does UK Used (Grade A) mean?",
    a: "Premium corporate laptops in excellent condition with genuine chargers, 85%+ verified battery health, and a 6-month SAMCORE warranty.",
  },
  {
    q: "Can I track my order?",
    a: "Yes. Go to the Track Order page and enter your Order ID and phone number or email to see real-time dispatch progress.",
  },
  {
    q: "Do you deliver outside Accra?",
    a: "Yes. We offer same-day delivery across Greater Accra & Tema, and secure courier delivery to Kumasi, Takoradi, Tamale, and all regions in Ghana.",
  },
];

export default function FaqPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <div className="border-b border-black pb-6 mb-8">
        <h1 className="text-h1">Frequently Asked Questions</h1>
        <p className="text-sm text-black/75 mt-1">
          Quick answers to common questions about ordering, delivery, and warranties.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((item, idx) => (
          <div key={idx} className="p-6 border border-black bg-white space-y-2">
            <h2 className="font-display font-bold text-base">
              0{idx + 1}. {item.q}
            </h2>
            <p className="text-sm text-black/80 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 p-5 border border-black bg-black/[0.02] flex items-center justify-between text-xs font-mono">
        <span>Need a custom laptop quote?</span>
        <Link href="/request-device" className="underline font-bold uppercase">
          Request Device Availability →
        </Link>
      </div>
    </div>
  );
}
