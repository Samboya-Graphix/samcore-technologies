"use client";

import React from "react";
import { Star, CheckCircle2 } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { AdminNav } from "@/components/AdminNav";

export default function AdminReviewsPage() {
  const { reviews, moderateReview } = useStore();

  return (
    <div>
      <AdminNav />
      <div className="max-w-container mx-auto px-4 sm:px-6 pb-16 space-y-8">
        <div className="border-b border-black pb-5">
          <h1 className="text-h1">Review Moderation & Verified Buyer Queue</h1>
          <p className="text-sm text-black/75 mt-1">
            Approve or hide customer reviews after checking verified purchase records.
          </p>
        </div>

        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 border border-black bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-sm">{rev.productName}</span>
                  <span
                    className={`px-2 py-0.5 border border-black uppercase ${
                      rev.status === "published"
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {rev.status}
                  </span>
                  {rev.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified Buyer (
                      {rev.orderId || "Order Matched"})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-black" />
                  ))}
                  <span className="font-bold ml-1">{rev.title}</span>
                </div>
                <p className="text-black/80">{rev.comment}</p>
                <p className="font-mono text-black/60">
                  Reviewer: {rev.customerName} • Date: {rev.createdAt}
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono shrink-0">
                <button
                  type="button"
                  onClick={() => moderateReview(rev.id, "published")}
                  className="px-3.5 py-2 bg-black text-white uppercase rounded-sm"
                >
                  Publish
                </button>
                <button
                  type="button"
                  onClick={() => moderateReview(rev.id, "hidden")}
                  className="px-3.5 py-2 border border-black hover:bg-black hover:text-white uppercase rounded-sm"
                >
                  Hide
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
