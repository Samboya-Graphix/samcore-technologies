"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Plus,
  Eye,
  EyeOff,
  ExternalLink,
  Upload,
  Trash2,
  Edit3,
  PackageCheck,
  PackageX,
  CheckCircle2,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { AdminNav } from "@/components/AdminNav";
import { SupplyStatusBadge } from "@/components/SupplyStatusBadge";
import { formatGhs, isProductOutOfStock } from "@/lib/utils";
import {
  CategorySlug,
  Product,
  ProductCondition,
  SupplyState,
} from "@/lib/types";
import { CATEGORIES } from "@/lib/mock-data";

export default function AdminProductsPage() {
  const {
    products,
    adminRole,
    adjustProductInventory,
    createNewProduct,
    showToast,
  } = useStore();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [filterStock, setFilterStock] = useState<"ALL" | "IN_STOCK" | "OUT_OF_STOCK">("ALL");

  // Basic Info & Availability State
  const [name, setName] = useState("");
  const [shortTitle, setShortTitle] = useState("");
  const [sku, setSku] = useState("");
  const [brand, setBrand] = useState<Product["brand"]>("Lenovo");
  const [categorySlug, setCategorySlug] = useState<CategorySlug>("business-laptops");
  const [condition, setCondition] = useState<ProductCondition>("UK Used (Grade A)");
  const [supplyState, setSupplyState] = useState<SupplyState>("OWNED_IN_STOCK");
  const [priceGhs, setPriceGhs] = useState(11500);
  const [costPriceGhs, setCostPriceGhs] = useState(9200);
  const [ownedQty, setOwnedQty] = useState(4);

  // Full Hardware Specifications State
  const [processor, setProcessor] = useState("Intel Core i7-1265U (10 Cores, up to 4.8GHz)");
  const [processorTier, setProcessorTier] = useState<Product["specs"]["ProcessorTier"]>(
    "Core i7 / M2 / M3 / Ryzen 7"
  );
  const [ramGb, setRamGb] = useState(16);
  const [ramText, setRamText] = useState("16GB DDR5 4800MHz");
  const [storageGb, setStorageGb] = useState(512);
  const [storageText, setStorageText] = useState("512GB PCIe Gen4 NVMe SSD");
  const [screenSizeInches, setScreenSizeInches] = useState(14.0);
  const [display, setDisplay] = useState('14.0" FHD+ (1920 × 1200) Anti-Glare IPS');
  const [graphics, setGraphics] = useState("Intel Iris Xe Graphics");
  const [gpuType, setGpuType] = useState<Product["specs"]["gpuType"]>("Integrated");
  const [batteryLife, setBatteryLife] = useState("Up to 10 hours");
  const [weightKg, setWeightKg] = useState(1.32);
  const [os, setOs] = useState("Windows 11 Pro 64-bit");
  const [ports, setPorts] = useState("2x Thunderbolt 4, 2x USB-A 3.2, HDMI 2.1, Audio Jack");
  const [warrantyMonths, setWarrantyMonths] = useState(6);
  const [summary, setSummary] = useState("");
  const [highlightsText, setHighlightsText] = useState(
    "25-Point SAMCORE Hardware Diagnostic Passed\nOriginal Charger Included\n6–12 Month SAMCORE Hardware Warranty"
  );

  // Device Images (Uploaded Files + Image URLs)
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=85",
  ]);
  const [customImageUrl, setCustomImageUrl] = useState("");

  const resetFormForNewProduct = () => {
    setEditingProductId(null);
    setName("");
    setShortTitle("");
    setSku("");
    setBrand("Lenovo");
    setCategorySlug("business-laptops");
    setCondition("UK Used (Grade A)");
    setSupplyState("OWNED_IN_STOCK");
    setPriceGhs(11500);
    setCostPriceGhs(9200);
    setOwnedQty(4);
    setProcessor("Intel Core i7-1265U (10 Cores, up to 4.8GHz)");
    setProcessorTier("Core i7 / M2 / M3 / Ryzen 7");
    setRamGb(16);
    setRamText("16GB DDR5 4800MHz");
    setStorageGb(512);
    setStorageText("512GB PCIe Gen4 NVMe SSD");
    setScreenSizeInches(14.0);
    setDisplay('14.0" FHD+ (1920 × 1200) Anti-Glare IPS');
    setGraphics("Intel Iris Xe Graphics");
    setGpuType("Integrated");
    setBatteryLife("Up to 10 hours");
    setWeightKg(1.32);
    setOs("Windows 11 Pro 64-bit");
    setPorts("2x Thunderbolt 4, 2x USB-A 3.2, HDMI 2.1, Audio Jack");
    setWarrantyMonths(6);
    setSummary("");
    setHighlightsText(
      "25-Point SAMCORE Hardware Diagnostic Passed\nOriginal Charger Included\n6–12 Month SAMCORE Hardware Warranty"
    );
    setImages([
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=85",
    ]);
    setCustomImageUrl("");
  };

  const openEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setName(product.name);
    setShortTitle(product.shortTitle);
    setSku(product.sku);
    setBrand(product.brand);
    setCategorySlug(product.categorySlug);
    setCondition(product.condition);
    setSupplyState(product.supplyState);
    setPriceGhs(product.priceGhs);
    setCostPriceGhs(product.costPriceGhs);
    setOwnedQty(
      product.supplyState === "SUPPLIER_CONFIRMED"
        ? product.supplierAllocationQty ?? 0
        : product.ownedQtyAvailable
    );
    setProcessor(product.specs.processor);
    setProcessorTier(product.specs.ProcessorTier);
    setRamGb(product.specs.ramGb);
    setRamText(product.specs.ramText);
    setStorageGb(product.specs.storageGb);
    setStorageText(product.specs.storageText);
    setScreenSizeInches(product.specs.screenSizeInches);
    setDisplay(product.specs.display);
    setGraphics(product.specs.graphics);
    setGpuType(product.specs.gpuType);
    setBatteryLife(product.specs.batteryLife);
    setWeightKg(product.specs.weightKg);
    setOs(product.specs.os);
    setPorts(product.specs.ports);
    setWarrantyMonths(product.specs.warrantyMonths);
    setSummary(product.summary);
    setHighlightsText(product.highlights.join("\n"));
    setImages(product.images.length > 0 ? product.images : []);
    setCustomImageUrl("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle local file upload from computer/phone via FileReader Data URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(async (file) => {
      if (!file.type.startsWith("image/")) {
        showToast("Please select a valid image file (JPG, PNG, WEBP).");
        return;
      }
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.ok && data.url) {
          setImages((prev) => [data.url, ...prev]);
          showToast(`Uploaded device picture: ${file.name}`);
          return;
        }
      } catch {
        // Fallback to FileReader DataURL
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImages((prev) => [reader.result as string, ...prev]);
          showToast(`Uploaded device picture: ${file.name}`);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const handleAddImageUrl = () => {
    const clean = customImageUrl.trim();
    if (!clean) return;
    setImages((prev) => [clean, ...prev]);
    setCustomImageUrl("");
    showToast("Added image URL to device gallery.");
  };

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSetPrimaryImage = (idx: number) => {
    setImages((prev) => {
      const target = prev[idx];
      const rest = prev.filter((_, i) => i !== idx);
      return [target, ...rest];
    });
    showToast("Updated primary cover picture.");
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const catObj = CATEGORIES.find((c) => c.slug === categorySlug) || CATEGORIES[0];
    const finalImages =
      images.length > 0
        ? images
        : [
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=85",
          ];

    const finalHighlights = highlightsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const finalSupplyState: SupplyState =
      supplyState === "OWNED_IN_STOCK" && ownedQty <= 0
        ? "OUT_OF_STOCK"
        : supplyState;

    const specsPayload: Product["specs"] = {
      processor,
      ProcessorTier: processorTier,
      ramGb,
      ramText: ramText.trim() || `${ramGb}GB RAM`,
      storageGb,
      storageText: storageText.trim() || `${storageGb}GB NVMe SSD`,
      display,
      screenSizeInches,
      graphics,
      gpuType,
      batteryLife,
      weightKg,
      os,
      ports,
      warrantyMonths,
    };

    if (editingProductId) {
      adjustProductInventory(editingProductId, {
        name,
        shortTitle: shortTitle || name,
        sku,
        brand,
        categorySlug,
        categoryName: catObj.name,
        condition,
        priceGhs,
        costPriceGhs,
        supplyState: finalSupplyState,
        ownedQtyAvailable:
          finalSupplyState === "OWNED_IN_STOCK" ? Math.max(1, ownedQty) : 0,
        supplierAllocationQty:
          finalSupplyState === "SUPPLIER_CONFIRMED" ? Math.max(1, ownedQty) : 0,
        images: finalImages,
        summary:
          summary.trim() ||
          `${name} — diagnostic-verified and listed via SAMCORE Admin Portal.`,
        highlights:
          finalHighlights.length > 0
            ? finalHighlights
            : [`${processor} | ${ramText} | ${storageText}`],
        specs: specsPayload,
      });
      setShowForm(false);
      setEditingProductId(null);
      return;
    }

    const slug = (shortTitle || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    createNewProduct({
      slug: `${slug}-${Date.now().toString().slice(-3)}`,
      sku: sku || `SMC-${Date.now().toString().slice(-5)}`,
      name,
      shortTitle: shortTitle || name,
      brand,
      categorySlug,
      categoryName: catObj.name,
      condition,
      priceGhs,
      costPriceGhs,
      supplyState: finalSupplyState,
      ownedQtyAvailable:
        finalSupplyState === "OWNED_IN_STOCK" ? Math.max(1, ownedQty) : 0,
      ownedQtyReserved: 0,
      supplierAllocationQty:
        finalSupplyState === "SUPPLIER_CONFIRMED" ? Math.max(1, ownedQty) : 0,
      supplierLeadTimeDays: 1,
      featured: true,
      latestArrival: true,
      rating: 5.0,
      reviewCount: 1,
      images: finalImages,
      summary:
        summary.trim() ||
        `${name} — diagnostic-verified and listed via SAMCORE Admin Portal.`,
      highlights:
        finalHighlights.length > 0
          ? finalHighlights
          : [
              `${processor} with ${ramGb}GB RAM & ${storageGb}GB NVMe SSD`,
              "25-Point SAMCORE Hardware Diagnostic Passed",
              `${warrantyMonths}-Month SAMCORE Hardware Warranty`,
            ],
      useCases: ["office", "programming", "student"],
      specs: specsPayload,
      published: true,
    });

    setShowForm(false);
    resetFormForNewProduct();
  };

  const filteredProducts = products.filter((p) => {
    const out = isProductOutOfStock(p);
    if (filterStock === "IN_STOCK") return !out;
    if (filterStock === "OUT_OF_STOCK") return out;
    return true;
  });

  const outOfStockCount = products.filter((p) => isProductOutOfStock(p)).length;
  const availableCount = products.length - outOfStockCount;

  return (
    <div>
      <AdminNav />
      <div className="max-w-container mx-auto px-4 sm:px-6 pb-16 space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black pb-5">
          <div>
            <h1 className="text-h1">
              Restocking, Device Pictures & Specifications
            </h1>
            <p className="text-sm text-black/75 mt-1">
              Update which gadgets are available or Out of Stock, restock quantities, upload actual device pictures, and configure complete hardware specifications.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                if (showForm && !editingProductId) {
                  setShowForm(false);
                } else {
                  resetFormForNewProduct();
                  setShowForm(true);
                }
              }}
              className="inline-flex items-center gap-2 bg-black text-white px-5 py-3 text-xs font-mono uppercase font-bold rounded-sm"
            >
              <Plus className="w-4 h-4" />
              <span>
                {showForm && !editingProductId
                  ? "Close Form"
                  : "Upload New Device & Specs"}
              </span>
            </button>
          </div>
        </div>

        {/* Summary Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border border-black bg-black/[0.02] rounded-sm">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "ALL", label: `All Gadgets (${products.length})` },
              { id: "IN_STOCK", label: `Available / In Stock (${availableCount})` },
              { id: "OUT_OF_STOCK", label: `Out of Stock (${outOfStockCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterStock(tab.id as typeof filterStock)}
                className={`px-3.5 py-2 text-xs font-mono uppercase border border-black rounded-sm transition-colors ${
                  filterStock === tab.id
                    ? "bg-black text-white font-bold"
                    : "bg-white text-black hover:bg-black/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <p className="text-xs font-mono text-black/70">
            Tip: Click <strong>Edit Picture &amp; Specs</strong> on any gadget below to upload new photos, edit specs, or restock.
          </p>
        </div>

        {/* Create OR Edit / Restock Device Drawer */}
        {showForm && (
          <form
            onSubmit={handleSaveProduct}
            className="p-6 border-2 border-black bg-white rounded-sm space-y-6"
          >
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div>
                <span className="text-[11px] font-mono uppercase px-2 py-0.5 bg-black text-white font-bold">
                  {editingProductId ? `EDITING & RESTOCKING: ${sku}` : "NEW GADGET LISTING"}
                </span>
                <h2 className="font-display font-bold text-xl uppercase mt-1">
                  {editingProductId
                    ? `Update Device Pictures, Specifications & Stock — ${shortTitle || name}`
                    : "Upload New Device with Picture & Full Specifications"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingProductId(null);
                }}
                className="p-2 border border-black hover:bg-black hover:text-white rounded-sm"
                title="Close Editor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* SECTION 1: DEVICE PICTURE UPLOAD (COMPUTER/PHONE UPLOAD + LIVE PREVIEW) */}
            <div className="p-5 border border-black bg-black/[0.02] rounded-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/15 pb-2">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  <h3 className="font-mono text-xs uppercase font-bold tracking-wider">
                    1. Device Pictures (Upload from Computer/Phone or Add Image Link)
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-black/60">
                  {images.length} Picture(s) Attached
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                {/* Local File Upload Button */}
                <div className="md:col-span-5 space-y-2">
                  <label className="block font-mono text-xs uppercase font-bold">
                    Upload Device Photo(s) from Device
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3.5 px-4 border-2 border-dashed border-black bg-white hover:bg-black hover:text-white transition-colors font-mono text-xs uppercase font-bold flex items-center justify-center gap-2 rounded-sm"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Select Device Picture(s) from Computer / Phone</span>
                  </button>
                  <p className="text-[11px] text-black/60 font-mono">
                    Supports JPG, PNG, WEBP. Uploaded photos are immediately previewed and displayed on the storefront.
                  </p>
                </div>

                {/* Or Paste Image URL */}
                <div className="md:col-span-7 space-y-2">
                  <label className="block font-mono text-xs uppercase font-bold">
                    Or Add Image via Direct URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 border border-black px-3 py-2.5 text-xs bg-white rounded-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-4 py-2.5 bg-black text-white text-xs font-mono uppercase font-bold rounded-sm"
                    >
                      Add Photo URL
                    </button>
                  </div>
                </div>
              </div>

              {/* Uploaded Photo Previews */}
              {images.length > 0 && (
                <div className="pt-2">
                  <p className="text-[11px] font-mono uppercase text-black/70 mb-2">
                    Current Device Gallery (First image is the Primary Storefront Cover):
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {images.map((imgSrc, idx) => (
                      <div
                        key={idx}
                        className={`border rounded-sm bg-white p-2 space-y-2 ${
                          idx === 0 ? "border-2 border-black" : "border-black/30"
                        }`}
                      >
                        <div className="relative aspect-[16/10] bg-black/5 overflow-hidden rounded-sm">
                          <img
                            src={imgSrc}
                            alt={`Device preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {idx === 0 && (
                            <span className="absolute top-1 left-1 bg-black text-white text-[9px] font-mono uppercase px-1.5 py-0.5 font-bold">
                              Cover Photo
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-1 text-[10px] font-mono">
                          {idx !== 0 ? (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="underline hover:font-bold"
                            >
                              Make Cover
                            </button>
                          ) : (
                            <span className="text-black/60 font-bold">Primary</span>
                          )}
                          {images.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="text-black hover:underline inline-flex items-center gap-0.5"
                            >
                              <Trash2 className="w-3 h-3" /> Remove
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: IDENTITY, RESTOCK AVAILABILITY & PRICING */}
            <div className="space-y-3">
              <h3 className="font-mono text-xs uppercase font-bold tracking-wider border-b border-black/15 pb-1.5">
                2. Gadget Identity, Restock Availability &amp; Pricing (GH₵)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-mono uppercase mb-1 font-semibold">
                    Full Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Lenovo ThinkPad T14s Gen 3 (Core i7, 16GB, 512GB)"
                    className="w-full border border-black px-3 py-2 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase mb-1 font-semibold">
                    Short Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={shortTitle}
                    onChange={(e) => setShortTitle(e.target.value)}
                    placeholder="e.g., ThinkPad T14s Gen 3"
                    className="w-full border border-black px-3 py-2 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase mb-1 font-semibold">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="SMC-TP-T14S-G3"
                    className="w-full border border-black px-3 py-2 font-mono bg-white"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase mb-1 font-semibold">
                    Brand
                  </label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value as typeof brand)}
                    className="w-full border border-black px-3 py-2 bg-white"
                  >
                    {["Lenovo", "Apple", "Dell", "HP", "ASUS", "Logitech", "Samsung"].map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono uppercase mb-1 font-semibold">
                    Store Category
                  </label>
                  <select
                    value={categorySlug}
                    onChange={(e) => setCategorySlug(e.target.value as CategorySlug)}
                    className="w-full border border-black px-3 py-2 bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono uppercase mb-1 font-semibold">
                    Hardware Condition
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as ProductCondition)}
                    className="w-full border border-black px-3 py-2 bg-white"
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="UK Used (Grade A)">UK Used (Grade A)</option>
                    <option value="Factory Refurbished">Factory Refurbished</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono uppercase mb-1 font-semibold">
                    Stock / Availability Status *
                  </label>
                  <select
                    value={supplyState}
                    onChange={(e) => {
                      const nextState = e.target.value as SupplyState;
                      setSupplyState(nextState);
                      if (nextState === "OUT_OF_STOCK") {
                        setOwnedQty(0);
                      } else if (ownedQty === 0) {
                        setOwnedQty(3);
                      }
                    }}
                    className="w-full border-2 border-black px-3 py-2 bg-white font-mono font-bold"
                  >
                    <option value="OWNED_IN_STOCK">
                      IN STOCK — Ready for Immediate Dispatch
                    </option>
                    <option value="OUT_OF_STOCK">
                      OUT OF STOCK — Show &quot;OUT OF STOCK&quot; on Storefront
                    </option>
                    <option value="SUPPLIER_CONFIRMED">
                      PARTNER ALLOCATION — Verified Supplier Stock
                    </option>
                    <option value="PRE_ORDER">PRE-ORDER — 7–10 Days Air Freight</option>
                    <option value="SUPPLIER_UNKNOWN">
                      CONFIRM AVAILABILITY — WhatsApp Enquiry Only
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono uppercase mb-1 font-semibold">
                    Available Units (Restock Qty) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={ownedQty}
                    onChange={(e) => {
                      const val = Math.max(0, Number(e.target.value));
                      setOwnedQty(val);
                      if (val === 0 && supplyState === "OWNED_IN_STOCK") {
                        setSupplyState("OUT_OF_STOCK");
                      } else if (val > 0 && supplyState === "OUT_OF_STOCK") {
                        setSupplyState("OWNED_IN_STOCK");
                      }
                    }}
                    className="w-full border border-black px-3 py-2 font-mono font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase mb-1 font-semibold">
                    Customer Price (GH₵) *
                  </label>
                  <input
                    type="number"
                    required
                    value={priceGhs}
                    onChange={(e) => setPriceGhs(Number(e.target.value))}
                    className="w-full border border-black px-3 py-2 font-mono font-bold bg-white"
                  />
                </div>

                {adminRole === "Owner/Admin" && (
                  <div>
                    <label className="block font-mono uppercase mb-1 font-semibold">
                      Landed / Supplier Cost (GH₵)
                    </label>
                    <input
                      type="number"
                      required
                      value={costPriceGhs}
                      onChange={(e) => setCostPriceGhs(Number(e.target.value))}
                      className="w-full border border-black px-3 py-2 font-mono bg-white"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 3: COMPLETE DEVICE HARDWARE SPECIFICATIONS */}
            <div className="space-y-3">
              <h3 className="font-mono text-xs uppercase font-bold tracking-wider border-b border-black/15 pb-1.5">
                3. Complete Device Specifications (Displayed on Product Card &amp; Spec Table)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-mono uppercase mb-1 font-semibold">
                    Processor (CPU Model &amp; Speed) *
                  </label>
                  <input
                    type="text"
                    required
                    value={processor}
                    onChange={(e) => setProcessor(e.target.value)}
                    placeholder="e.g., Intel Core i7-1265U (10 Cores, up to 4.8GHz)"
                    className="w-full border border-black px-3 py-2 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase mb-1 font-semibold">
                    Processor Filter Tier
                  </label>
                  <select
                    value={processorTier}
                    onChange={(e) =>
                      setProcessorTier(
                        e.target.value as Product["specs"]["ProcessorTier"]
                      )
                    }
                    className="w-full border border-black px-3 py-2 bg-white"
                  >
                    <option value="Core i5 / Ryzen 5">Core i5 / Ryzen 5</option>
                    <option value="Core i7 / M2 / M3 / Ryzen 7">
                      Core i7 / M2 / M3 / Ryzen 7
                    </option>
                    <option value="Core i9 / M3 Pro / M3 Max">
                      Core i9 / M3 Pro / M3 Max
                    </option>
                    <option value="Accessory">Accessory</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono uppercase mb-1 font-semibold">
                    Memory Size (RAM in GB) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={ramGb}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setRamGb(val);
                      setRamText(`${val}GB DDR5 / LPDDR5`);
                    }}
                    className="w-full border border-black px-3 py-2 font-mono bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono uppercase mb-1 font-semibold">
                    Memory Specification Text *
                  </label>
                  <input
                    type="text"
                    required
                    value={ramText}
                    onChange={(e) => setRamText(e.target.value)}
                    placeholder="e.g., 16GB LPDDR5 5200MHz Dual-Channel"
                    className="w-full border border-black px-3 py-2 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase mb-1 font-semibold">
                    SSD Storage Size (GB) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={storageGb}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setStorageGb(val);
                      setStorageText(
                        val >= 1000
                          ? `${val / 1000}TB PCIe Gen4 NVMe SSD`
                          : `${val}GB PCIe Gen4 NVMe SSD`
                      );
                    }}
                    className="w-full border border-black px-3 py-2 font-mono bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono uppercase mb-1 font-semibold">
                    Storage Specification Text *
                  </label>
                  <input
                    type="text"
                    required
                    value={storageText}
                    onChange={(e) => setStorageText(e.target.value)}
                    placeholder="e.g., 512GB PCIe Gen4 NVMe M.2 SSD"
                    className="w-full border border-black px-3 py-2 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase mb-1 font-semibold">
                    Screen Size (Inches)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={screenSizeInches}
                    onChange={(e) => setScreenSizeInches(Number(e.target.value))}
                    className="w-full border border-black px-3 py-2 font-mono bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono uppercase mb-1 font-semibold">
                    Display Resolution &amp; Panel *
                  </label>
                  <input
                    type="text"
                    required
                    value={display}
                    onChange={(e) => setDisplay(e.target.value)}
                    placeholder='e.g., 14.0" FHD+ (1920 × 1200) IPS Anti-Glare 400 nits'
                    className="w-full border border-black px-3 py-2 bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono uppercase mb-1 font-semibold">
                    Graphics / GPU Model *
                  </label>
                  <input
                    type="text"
                    required
                    value={graphics}
                    onChange={(e) => setGraphics(e.target.value)}
                    placeholder="e.g., Intel Iris Xe Graphics or NVIDIA RTX 4060 8GB"
                    className="w-full border border-black px-3 py-2 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase mb-1 font-semibold">
                    GPU Class
                  </label>
                  <select
                    value={gpuType}
                    onChange={(e) =>
                      setGpuType(e.target.value as Product["specs"]["gpuType"])
                    }
                    className="w-full border border-black px-3 py-2 bg-white"
                  >
                    <option value="Integrated">Integrated</option>
                    <option value="Dedicated RTX / Pro">Dedicated RTX / Pro</option>
                    <option value="Apple Unified GPU">Apple Unified GPU</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono uppercase mb-1 font-semibold">
                    Battery Life Estimate
                  </label>
                  <input
                    type="text"
                    value={batteryLife}
                    onChange={(e) => setBatteryLife(e.target.value)}
                    placeholder="Up to 10 hours"
                    className="w-full border border-black px-3 py-2 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase mb-1 font-semibold">
                    Operating System (OS)
                  </label>
                  <input
                    type="text"
                    value={os}
                    onChange={(e) => setOs(e.target.value)}
                    placeholder="Windows 11 Pro 64-bit / macOS Sonoma"
                    className="w-full border border-black px-3 py-2 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase mb-1 font-semibold">
                    Warranty Period (Months)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={warrantyMonths}
                    onChange={(e) => setWarrantyMonths(Number(e.target.value))}
                    className="w-full border border-black px-3 py-2 font-mono bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono uppercase mb-1 font-semibold">
                    Ports &amp; Connectivity
                  </label>
                  <input
                    type="text"
                    value={ports}
                    onChange={(e) => setPorts(e.target.value)}
                    placeholder="2x Thunderbolt 4, 2x USB-A, HDMI 2.1, Audio Jack"
                    className="w-full border border-black px-3 py-2 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase mb-1 font-semibold">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full border border-black px-3 py-2 font-mono bg-white"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block font-mono uppercase mb-1 font-semibold">
                    Key Hardware Highlights (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={highlightsText}
                    onChange={(e) => setHighlightsText(e.target.value)}
                    className="w-full border border-black px-3 py-2 bg-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-black">
              <button
                type="submit"
                className="bg-black text-white px-6 py-3.5 text-xs font-mono uppercase font-bold rounded-sm inline-flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {editingProductId
                    ? "Save Updated Device Picture, Specs & Stock"
                    : "Publish New Device & Specs to Storefront"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingProductId(null);
                }}
                className="border border-black bg-white text-black px-5 py-3.5 text-xs font-mono uppercase rounded-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Products & Restocking Table */}
        <div className="overflow-x-auto border border-black rounded-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-black text-white font-mono uppercase">
                <th className="p-3.5">Device Photo &amp; Specs</th>
                <th className="p-3.5">Availability Status</th>
                <th className="p-3.5">Restock Units</th>
                <th className="p-3.5">Quick Stock Toggle</th>
                <th className="p-3.5">Retail Price</th>
                {adminRole === "Owner/Admin" && (
                  <th className="p-3.5">Cost / Margin</th>
                )}
                <th className="p-3.5">Visibility</th>
                <th className="p-3.5">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/15">
              {filteredProducts.map((p) => {
                const margin = p.priceGhs - p.costPriceGhs;
                const out = isProductOutOfStock(p);
                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-black/[0.02] ${
                      out ? "bg-black/[0.03]" : ""
                    }`}
                  >
                    {/* Device Photo + Model + Specs */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-11 border border-black bg-black/5 shrink-0 overflow-hidden rounded-sm">
                          <img
                            src={p.images[0]}
                            alt={p.shortTitle}
                            className={`w-full h-full object-cover ${
                              out ? "grayscale opacity-60" : ""
                            }`}
                          />
                          {out && (
                            <span className="absolute inset-0 bg-black/60 text-white text-[8px] font-mono uppercase font-bold flex items-center justify-center text-center leading-tight">
                              OUT OF STOCK
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{p.shortTitle}</p>
                          <p className="font-mono text-[11px] text-black/65">
                            {p.sku} • {p.condition}
                          </p>
                          <p className="font-mono text-[11px] text-black/80 mt-0.5">
                            {p.specs.processor.split("(")[0].trim()} |{" "}
                            {p.specs.ramText} | {p.specs.storageText}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Current Supply Badge */}
                    <td className="p-3.5">
                      <SupplyStatusBadge product={p} size="sm" />
                    </td>

                    {/* Quick Unit Counter (- / +) */}
                    <td className="p-3.5 font-mono">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            adjustProductInventory(p.id, {
                              ownedQtyAvailable: Math.max(
                                0,
                                p.ownedQtyAvailable - 1
                              ),
                            })
                          }
                          className="w-7 h-7 border border-black bg-white hover:bg-black hover:text-white font-bold"
                          title="Decrease stock by 1"
                        >
                          -
                        </button>
                        <span className="font-bold px-2 text-sm min-w-[28px] text-center">
                          {p.ownedQtyAvailable}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            adjustProductInventory(p.id, {
                              ownedQtyAvailable: p.ownedQtyAvailable + 1,
                              supplyState: "OWNED_IN_STOCK",
                            })
                          }
                          className="w-7 h-7 border border-black bg-white hover:bg-black hover:text-white font-bold"
                          title="Restock +1 unit"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* One-Click Restock / Mark Out of Stock */}
                    <td className="p-3.5 font-mono">
                      {out ? (
                        <button
                          type="button"
                          onClick={() =>
                            adjustProductInventory(p.id, {
                              supplyState: "OWNED_IN_STOCK",
                              ownedQtyAvailable: Math.max(3, p.ownedQtyAvailable || 3),
                            })
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-[11px] font-mono uppercase font-bold rounded-sm hover:bg-black/85"
                        >
                          <PackageCheck className="w-3.5 h-3.5" />
                          <span>Restock Gadget (+3)</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            adjustProductInventory(p.id, {
                              supplyState: "OUT_OF_STOCK",
                              ownedQtyAvailable: 0,
                            })
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-black bg-white text-black text-[11px] font-mono uppercase font-semibold rounded-sm hover:bg-black hover:text-white transition-colors"
                        >
                          <PackageX className="w-3.5 h-3.5" />
                          <span>Mark Out of Stock</span>
                        </button>
                      )}
                    </td>

                    {/* Retail Price */}
                    <td className="p-3.5 font-mono font-bold text-sm">
                      {formatGhs(p.priceGhs)}
                    </td>

                    {/* Owner Cost & Margin */}
                    {adminRole === "Owner/Admin" && (
                      <td className="p-3.5 font-mono">
                        <span className="block text-black/70">
                          Cost: {formatGhs(p.costPriceGhs)}
                        </span>
                        <span className="font-bold">
                          Margin: +{formatGhs(margin)}
                        </span>
                      </td>
                    )}

                    {/* Visibility */}
                    <td className="p-3.5 font-mono">
                      <button
                        type="button"
                        onClick={() =>
                          adjustProductInventory(p.id, {
                            published: !p.published,
                          })
                        }
                        className={`inline-flex items-center gap-1 px-2.5 py-1 border border-black uppercase ${
                          p.published
                            ? "bg-black text-white"
                            : "bg-white text-black"
                        }`}
                      >
                        {p.published ? (
                          <>
                            <Eye className="w-3 h-3" /> Live
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" /> Hidden
                          </>
                        )}
                      </button>
                    </td>

                    {/* Edit Specs / Upload Photo / View Live */}
                    <td className="p-3.5 font-mono">
                      <div className="flex flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditProduct(p)}
                          className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-black text-white text-[11px] uppercase font-bold rounded-sm hover:bg-black/85"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit Picture &amp; Specs</span>
                        </button>
                        <Link
                          href={`/products/${p.slug}`}
                          className="inline-flex items-center justify-center gap-1 text-[11px] underline py-0.5"
                        >
                          <span>View on Storefront</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
