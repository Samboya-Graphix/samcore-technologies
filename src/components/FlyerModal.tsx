"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, MessageSquare, ArrowRight, Sparkles, MapPin, Phone } from "lucide-react";
import Image from "next/image";

export function triggerAnnouncementFlyer() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("samcore_open_flyer"));
  }
}

export function FlyerModal() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isHovered, setIsHovered] = useState(false);

  // Disable in admin or staff management views
  const isAdminOrStaff =
    pathname?.startsWith("/admin") || pathname?.startsWith("/staff");

  useEffect(() => {
    if (isAdminOrStaff) return;

    // Check if user has already seen the announcement in this session
    const hasSeen = sessionStorage.getItem("samcore_announcement_seen");
    if (!hasSeen) {
      // Pop up after 700ms for a cool entrance after initial page load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [isAdminOrStaff]);

  // Listen for manual trigger events (e.g. from footer or promo bar)
  useEffect(() => {
    const handleOpenCustom = () => {
      setProgress(100);
      setIsOpen(true);
    };
    window.addEventListener("samcore_open_flyer", handleOpenCustom);
    return () => window.removeEventListener("samcore_open_flyer", handleOpenCustom);
  }, []);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Auto-dismiss countdown (12 seconds)
  useEffect(() => {
    if (!isOpen || isHovered) return;

    const interval = 100;
    const totalDuration = 12000;
    const decrement = (interval / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= decrement) {
          clearInterval(timer);
          handleClose();
          return 0;
        }
        return prev - decrement;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isOpen, isHovered]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("samcore_announcement_seen", "true");
  };

  if (!isOpen || isAdminOrStaff) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="SAMCORE Announcement"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-sm sm:max-w-md bg-white border-2 border-black rounded-sm shadow-2xl overflow-hidden flex flex-col transition-all transform scale-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-black text-white border-b border-black">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Special Announcement</span>
            </span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close Announcement"
            className="p-1 text-white hover:bg-white hover:text-black rounded-sm transition-colors border border-white/30"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Flyer Image Container */}
        <div className="relative w-full bg-black/[0.02] flex items-center justify-center p-1 sm:p-2 overflow-hidden">
          <img
            src="/images/announcement-flyer.jpg"
            alt="SAMCORE TECHNOLOGIES - Quality Laptops for Every Need"
            className="w-full max-h-[65vh] sm:max-h-[70vh] object-contain rounded-sm"
          />
        </div>

        {/* Auto-dismiss progress bar */}
        <div className="w-full h-1 bg-black/10">
          <div
            className="h-full bg-black transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Action Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-black/15 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-black/70">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-black" />
              <span>UENR Campus Desk</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-black" />
              <span>050 946 1505</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a
              href="https://wa.me/233509461505?text=Hello%20SAMCORE%2C%20I%20saw%20your%20announcement%20flyer%20and%20would%20like%20to%20order%20or%20inquire%20about%20your%20laptops!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-black text-white text-xs font-mono uppercase font-bold rounded-sm hover:bg-black/85 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp DM</span>
            </a>

            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center justify-center gap-1 px-3 py-2.5 border border-black text-black text-xs font-mono uppercase font-bold rounded-sm hover:bg-black hover:text-white transition-colors"
            >
              <span>View Store</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
