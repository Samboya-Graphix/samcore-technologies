"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Heart,
  Scale,
  User,
  Menu,
  X,
  Shield,
  Compass,
  Truck,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    cart,
    compareIds,
    wishlistIds,
    currentUser,
    isAdminAuthenticated,
    toastMessage,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    } else {
      router.push("/shop");
    }
  };

  const navItems = [
    { href: "/shop", label: "Catalogue" },
    { href: "/categories", label: "Categories" },
    { href: "/laptop-finder", label: "Laptop Finder" },
    { href: "/compare", label: `Compare (${compareIds.length}/3)` },
    { href: "/deals", label: "Deals & Coupons" },
    { href: "/request-device", label: "Request Device" },
    { href: "/track-order", label: "Track Order" },
  ];

  if (pathname?.startsWith("/admin")) {
    return (
      <>
        {toastMessage && (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-5 right-5 z-50 max-w-sm bg-black text-white border-2 border-white shadow-xl px-4 py-3 rounded-sm flex items-center gap-3 text-xs font-mono"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {/* Main Monochrome Storefront Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-black">
        <div className="max-w-container mx-auto px-4 sm:px-6 py-3.5">
          <div className="flex items-center justify-between gap-4">
            {/* Brand Wordmark (Two-Color Approved Monochrome Identity) */}
            <Link
              href="/"
              className="flex items-center gap-2.5 shrink-0 group"
              aria-label="SAMCORE TECHNOLOGIES Home"
            >
              <div className="w-9 h-9 bg-black text-white flex items-center justify-center font-display font-bold text-lg tracking-tighter border border-black group-hover:bg-white group-hover:text-black transition-colors">
                SC
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-base sm:text-lg tracking-tight leading-none text-black">
                  SAMCORE
                </span>
                <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/70 mt-0.5">
                  TECHNOLOGIES • GH
                </span>
              </div>
            </Link>

            {/* Desktop Search Bar */}
            <form
              onSubmit={handleSearch}
              role="search"
              className="hidden md:flex flex-1 max-w-md mx-4"
            >
              <div className="relative flex w-full">
                <label htmlFor="header-search" className="sr-only">
                  Search laptops by model, processor, RAM or SKU
                </label>
                <input
                  id="header-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search laptops, MacBooks, specs..."
                  className="w-full bg-white text-black placeholder:text-black/50 text-sm px-3.5 py-2 border border-black rounded-l-sm focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="bg-black text-white px-4 py-2 text-xs font-mono uppercase tracking-wider border border-black rounded-r-sm hover:bg-black/85 flex items-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  <span>Find</span>
                </button>
              </div>
            </form>

            {/* Right Utility Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/compare"
                className="relative inline-flex items-center gap-1.5 px-2.5 py-2 border border-black/25 hover:border-black rounded-sm text-xs font-medium text-black transition-colors"
                title="Compare Laptops"
              >
                <Scale className="w-4 h-4" />
                <span className="hidden xl:inline">Compare</span>
                {compareIds.length > 0 && (
                  <span className="bg-black text-white text-[10px] font-mono px-1.5 py-0.2 rounded-sm">
                    {compareIds.length}
                  </span>
                )}
              </Link>

              <Link
                href="/account/wishlist"
                className="relative inline-flex items-center gap-1.5 px-2.5 py-2 border border-black/25 hover:border-black rounded-sm text-xs font-medium text-black transition-colors"
                title="Wishlist & Restock Alerts"
              >
                <Heart className="w-4 h-4" />
                <span className="hidden xl:inline">Saved</span>
                {wishlistIds.length > 0 && (
                  <span className="bg-black text-white text-[10px] font-mono px-1.5 py-0.2 rounded-sm">
                    {wishlistIds.length}
                  </span>
                )}
              </Link>

              <Link
                href={
                  isAdminAuthenticated
                    ? "/admin"
                    : currentUser
                    ? "/account"
                    : "/login"
                }
                className="inline-flex items-center gap-1.5 px-2.5 py-2 border border-black/25 hover:border-black rounded-sm text-xs font-medium text-black transition-colors"
                title={
                  isAdminAuthenticated
                    ? "Admin Portal"
                    : currentUser
                    ? "Customer Account"
                    : "Sign In"
                }
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isAdminAuthenticated
                    ? "Admin Portal"
                    : currentUser
                    ? currentUser.name.split(" ")[0]
                    : "Sign In"}
                </span>
              </Link>

              <Link
                href="/cart"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-black text-white hover:bg-black/85 rounded-sm text-xs font-mono uppercase tracking-wider transition-colors"
                aria-label={`Shopping cart with ${totalCartItems} items`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Cart ({totalCartItems})</span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 border border-black rounded-sm text-black"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search-First Bar (Section 7.01) */}
          <form onSubmit={handleSearch} className="mt-3 flex md:hidden">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search laptops, specs, RAM, SKU..."
              className="w-full bg-white text-black placeholder:text-black/50 text-sm px-3 py-2 border border-black rounded-l-sm"
            />
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 text-xs font-mono uppercase border border-black rounded-r-sm"
            >
              Search
            </button>
          </form>

          {/* Desktop Navigation Bar */}
          <nav
            aria-label="Main storefront navigation"
            className="hidden md:flex items-center justify-between pt-3 mt-3 border-t border-black/15 text-xs font-medium"
          >
            <div className="flex items-center gap-6">
              {navItems.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`py-1 transition-colors ${
                      active
                        ? "font-bold text-black underline underline-offset-4 decoration-2"
                        : "text-black/80 hover:text-black hover:underline underline-offset-4"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono">
              <Link
                href="/account/rewards"
                className="text-black/80 hover:text-black underline-offset-4 hover:underline"
              >
                Loyalty: {currentUser ? `${currentUser.loyaltyPoints} pts` : "Earn Points"}
              </Link>
              <span className="text-black/30">|</span>
              <Link
                href="/about"
                className="text-black/80 hover:text-black underline-offset-4 hover:underline"
              >
                About
              </Link>
              <span className="text-black/30">|</span>
              <Link
                href="/contact"
                className="text-black/80 hover:text-black underline-offset-4 hover:underline"
              >
                Contact
              </Link>
            </div>
          </nav>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-black px-4 py-4 space-y-3">
            <div className="grid grid-cols-1 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-3 border border-black/15 rounded-sm font-medium text-sm text-black hover:bg-black hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 border border-black/15 rounded-sm font-medium text-sm text-black"
              >
                My Account & Order History
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Monochrome Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-sm bg-black text-white border-2 border-white shadow-xl px-4 py-3 rounded-sm flex items-center gap-3 text-xs font-mono"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}
