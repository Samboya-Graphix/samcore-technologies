"use client";

import React, { useState } from "react";
import { MapPin, Phone, Mail, MessageSquare, CheckCircle2 } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { getWhatsAppEnquiryUrl } from "@/lib/utils";

export default function ContactPage() {
  const { settings } = useStore();
  const [sent, setSent] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <div className="border-b border-black pb-6 mb-8">
        <h1 className="text-h1">Contact & Support</h1>
        <p className="text-sm text-black/75 mt-1">
          Reach our team directly via WhatsApp (050 946 1505), phone, or send an enquiry below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-5">
          <div className="p-5 border border-black space-y-3 text-xs font-mono">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong className="block uppercase">Operating Model</strong>
                <span className="text-black/75">{settings.showroomAddress}</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong className="block uppercase">WhatsApp & Direct Support Line</strong>
                <span className="text-black/75">050 946 1505 ({settings.supportPhone})</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong className="block uppercase">Email Desk</strong>
                <span className="text-black/75">{settings.supportEmail}</span>
              </div>
            </div>
          </div>

          <a
            href={getWhatsAppEnquiryUrl(settings)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-black text-white py-3.5 px-5 text-xs font-mono uppercase tracking-wider rounded-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp DM (050 946 1505)</span>
          </a>
        </div>

        <div className="md:col-span-7">
          {sent ? (
            <div className="p-8 border-2 border-black space-y-3">
              <CheckCircle2 className="w-7 h-7" />
              <h2 className="text-h3">Message Logged with SAMCORE Support</h2>
              <p className="text-xs text-black/75">
                Our support desk responds within 2 business hours Monday–Saturday (08:30 – 18:00 GMT).
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="p-6 border border-black bg-white space-y-4"
            >
              <h2 className="text-h3">Send Direct Enquiry</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-mono uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-black px-3 py-2 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-mono uppercase mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full border border-black px-3 py-2 bg-white"
                  />
                </div>
              </div>
              <div className="text-xs">
                <label className="block font-mono uppercase mb-1">
                  Subject / Order ID
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-black px-3 py-2 bg-white"
                />
              </div>
              <div className="text-xs">
                <label className="block font-mono uppercase mb-1">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  className="w-full border border-black px-3 py-2 bg-white"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-3 text-xs font-mono uppercase rounded-sm"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
