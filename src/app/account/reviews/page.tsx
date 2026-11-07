"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, CheckCircle2 } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function AccountReviewsPage() {
  const { reviews, products, submitCustomerReview } = useStore();
  const [selectedProdId, setSelectedProdId] = useState(products[1]?.id || "PRD-002");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitCustomerReview(selectedProdId, rating, title, comment);
    setTitle("");
    setComment("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <nav aria-label="Breadcrumb" className="text-xs font-mono text-black/60 mb-4">
        <Link href="/account" className="hover:underline">
          My Account
        </Link>{" "}
        / <span className="text-black font-semibold">Verified Product Reviews</span>
      </nav>

      <div className="border-b border-black pb-6 mb-8">
        <h1 className="text-h1">Product Reviews & Ratings</h1>
        <p className="text-sm text-black/75 mt-1">
          Submit feedback on your purchased hardware. All reviews undergo moderation and verified-buyer validation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <form
            onSubmit={handleSubmit}
            className="p-6 border border-black bg-white space-y-4"
          >
            <h2 className="font-display font-bold text-base uppercase">
              Submit Verified Purchase Review
            </h2>

            <div>
              <label className="block text-xs font-mono uppercase mb-1">
                Purchased Model
              </label>
              <select
                value={selectedProdId}
                onChange={(e) => setSelectedProdId(e.target.value)}
                className="w-full border border-black px-3 py-2 text-xs bg-white"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.shortTitle}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase mb-1">
                Star Rating
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full border border-black px-3 py-2 text-xs bg-white"
              >
                <option value={5}>5 Stars — Excellent</option>
                <option value={4}>4 Stars — Very Good</option>
                <option value={3}>3 Stars — Good</option>
                <option value={2}>2 Stars — Fair</option>
                <option value={1}>1 Star — Poor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase mb-1">
                Review Headline *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Reliable battery & clean chassis"
                className="w-full border border-black px-3 py-2 text-xs bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase mb-1">
                Review Comment *
              </label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-black px-3 py-2 text-xs bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2.5 text-xs font-mono uppercase rounded-sm"
            >
              Submit Review
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-display font-bold text-base uppercase">
            Submitted Reviews ({reviews.length})
          </h2>
          {reviews.map((r) => (
            <div key={r.id} className="p-4 border border-black space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold">{r.productName}</span>
                <span className="px-2 py-0.5 border border-black font-mono uppercase text-[10px]">
                  Status: {r.status}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-black" />
                ))}
                {r.verifiedPurchase && (
                  <span className="ml-2 inline-flex items-center gap-1 font-mono text-[10px] uppercase">
                    <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                  </span>
                )}
              </div>
              <p className="font-bold text-sm">{r.title}</p>
              <p className="text-black/80">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
