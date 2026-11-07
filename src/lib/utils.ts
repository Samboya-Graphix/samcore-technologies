import { Product, StoreSettings, Order } from "./types";

export function formatGhs(amount: number): string {
  return `GH₵ ${amount.toLocaleString("en-GH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function isProductOutOfStock(product: Product): boolean {
  if (product.supplyState === "OUT_OF_STOCK") return true;
  if (product.supplyState === "OWNED_IN_STOCK" && product.ownedQtyAvailable <= 0) {
    return true;
  }
  return false;
}

export function canImmediateCheckout(product: Product): boolean {
  if (isProductOutOfStock(product)) return false;
  if (product.supplyState === "OWNED_IN_STOCK") {
    return product.ownedQtyAvailable > 0;
  }
  if (product.supplyState === "SUPPLIER_CONFIRMED") {
    return (product.supplierAllocationQty ?? 0) > 0;
  }
  if (product.supplyState === "PRE_ORDER") {
    return true;
  }
  return false;
}

export function getMaxReservableQty(product: Product): number {
  if (isProductOutOfStock(product)) return 0;
  if (product.supplyState === "OWNED_IN_STOCK") {
    return Math.max(0, product.ownedQtyAvailable);
  }
  if (product.supplyState === "SUPPLIER_CONFIRMED") {
    return Math.max(0, product.supplierAllocationQty ?? 0);
  }
  if (product.supplyState === "PRE_ORDER") {
    return 2;
  }
  return 0;
}

export interface SupplyBadgeConfig {
  label: string;
  sublabel: string;
  iconType: "check" | "shield" | "clock" | "calendar" | "x";
  borderStyle: "solid" | "dashed" | "double" | "dotted";
  isInverted: boolean;
  patternClass: string;
}

export function normalizeWhatsAppPhone(rawPhone: string): string {
  const digits = rawPhone.replace(/[^0-9]/g, "");
  if (digits.startsWith("0") && digits.length === 10) {
    return `233${digits.slice(1)}`;
  }
  return digits || "233509461505";
}

export function getSupplyBadgeConfig(product: Product): SupplyBadgeConfig {
  if (isProductOutOfStock(product)) {
    return {
      label: "OUT OF STOCK",
      sublabel: "Currently Out of Stock — Join Restock Alert",
      iconType: "x",
      borderStyle: "solid",
      isInverted: false,
      patternClass: "pattern-diagonal-lines",
    };
  }

  switch (product.supplyState) {
    case "OWNED_IN_STOCK":
      return {
        label: `IN STOCK (${product.ownedQtyAvailable} AVAILABLE)`,
        sublabel: "Ready Owned Stock — Immediate Dispatch",
        iconType: "check",
        borderStyle: "solid",
        isInverted: true,
        patternClass: "",
      };
    case "SUPPLIER_CONFIRMED":
      return {
        label: `PARTNER ALLOCATION (${product.supplierAllocationQty ?? 1} CONFIRMED)`,
        sublabel: `Verified Partner Stock — Dispatch in ${product.supplierLeadTimeDays ?? 1}d`,
        iconType: "shield",
        borderStyle: "solid",
        isInverted: false,
        patternClass: "",
      };
    case "SUPPLIER_UNKNOWN":
      return {
        label: "CONFIRM AVAILABILITY",
        sublabel: "Supplier-Sourced — Confirm via WhatsApp DM",
        iconType: "clock",
        borderStyle: "dashed",
        isInverted: false,
        patternClass: "pattern-dots",
      };
    case "PRE_ORDER":
      return {
        label: `PRE-ORDER (${product.preOrderDepositPercent ?? 30}% DEPOSIT)`,
        sublabel: product.preOrderEta ?? "7–10 Business Days Air Freight",
        iconType: "calendar",
        borderStyle: "dotted",
        isInverted: false,
        patternClass: "",
      };
    case "OUT_OF_STOCK":
    default:
      return {
        label: "OUT OF STOCK",
        sublabel: "Currently Out of Stock — Join Restock Alert",
        iconType: "x",
        borderStyle: "solid",
        isInverted: false,
        patternClass: "pattern-diagonal-lines",
      };
  }
}

export interface CustomSpecSelection {
  selectedRam?: string;
  selectedStorage?: string;
  selectedDeliveryZone?: string;
  quantity?: number;
  computedUnitPriceGhs?: number;
  customerNote?: string;
}

export function getWhatsAppEnquiryUrl(
  settings: StoreSettings,
  product?: Product,
  customMessage?: string,
  specSelection?: CustomSpecSelection
): string {
  const cleanPhone = normalizeWhatsAppPhone(settings.whatsappNumber);
  let text = "";
  if (customMessage) {
    text = customMessage;
  } else if (product) {
    const qty = specSelection?.quantity ?? 1;
    const unitPrice = specSelection?.computedUnitPriceGhs ?? product.priceGhs;
    const totalPrice = unitPrice * qty;
    const ramSpec = specSelection?.selectedRam || product.specs.ramText;
    const storageSpec = specSelection?.selectedStorage || product.specs.storageText;
    const deliveryPref =
      specSelection?.selectedDeliveryZone || "Greater Accra / Nationwide Doorstep Delivery";

    const actionHeader =
      product.supplyState === "SUPPLIER_UNKNOWN"
        ? "AVAILABILITY & ORDER REQUEST"
        : "DIRECT WHATSAPP ORDER SUBMISSION";

    text =
      `Hello *${settings.storeName}*,\n` +
      `I would like to place a *${actionHeader}* with the following device & specifications:\n\n` +
      `• *Device*: ${product.name}\n` +
      `• *SKU*: ${product.sku}\n` +
      `• *Condition*: ${product.condition}\n` +
      `• *Processor*: ${product.specs.processor}\n` +
      `• *Selected RAM*: ${ramSpec}\n` +
      `• *Selected Storage*: ${storageSpec}\n` +
      `• *Display / GPU*: ${product.specs.display} | ${product.specs.graphics}\n` +
      `• *Warranty*: ${product.specs.warrantyMonths} Months SAMCORE Warranty\n` +
      `• *Quantity*: ${qty}\n` +
      `• *Unit Price*: ${formatGhs(unitPrice)}\n` +
      `• *Total Estimate*: *${formatGhs(totalPrice)}*\n` +
      `• *Delivery Zone*: ${deliveryPref}\n` +
      (specSelection?.customerNote
        ? `• *Notes*: ${specSelection.customerNote}\n`
        : "") +
      `\nPlease confirm my order and share payment/delivery arrangements.`;
  } else {
    text =
      "Hello SAMCORE TECHNOLOGIES, I would like assistance choosing or ordering a laptop in Ghana.";
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function getWhatsAppOrderSubmissionUrl(
  settings: StoreSettings,
  order: Order
): string {
  const cleanPhone = normalizeWhatsAppPhone(settings.whatsappNumber);
  const itemsLines = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.name}* (SKU: ${item.sku})\n` +
        `   • Condition: ${item.condition}\n` +
        `   • Selected Specs: ${item.specsSnapshot}\n` +
        `   • Qty: ${item.quantity} × ${formatGhs(item.unitPriceGhs)} = *${formatGhs(
          item.unitPriceGhs * item.quantity
        )}*`
    )
    .join("\n\n");

  const text =
    `Hello *${settings.storeName}*,\n` +
    `I have submitted my order on the website. Here are my complete order & specification details:\n\n` +
    `*ORDER REFERENCE*: ${order.id}\n` +
    `*CUSTOMER*: ${order.customerName}\n` +
    `*PHONE*: ${order.customerPhone}\n` +
    `*EMAIL*: ${order.customerEmail}\n` +
    `*DELIVERY ZONE*: ${order.deliveryZone}\n` +
    `*DELIVERY ADDRESS*: ${order.deliveryAddress}\n\n` +
    `*SELECTED DEVICES & SPECIFICATIONS*:\n${itemsLines}\n\n` +
    `*SUBTOTAL*: ${formatGhs(order.subtotalGhs)}\n` +
    (order.discountGhs > 0
      ? `*DISCOUNT (${order.couponCode || "Loyalty"})*: -${formatGhs(
          order.discountGhs
        )}\n`
      : "") +
    `*DELIVERY FEE*: ${
      order.deliveryFeeGhs === 0 ? "FREE" : formatGhs(order.deliveryFeeGhs)
    }\n` +
    `*TOTAL PAYABLE*: *${formatGhs(order.totalGhs)}*\n\n` +
    `Please confirm my order and share payment details to finalize dispatch.`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
