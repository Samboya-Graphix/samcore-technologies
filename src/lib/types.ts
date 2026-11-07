export type SupplyState =
  | "OWNED_IN_STOCK"
  | "SUPPLIER_CONFIRMED"
  | "SUPPLIER_UNKNOWN"
  | "OUT_OF_STOCK"
  | "PRE_ORDER";

export type ProductCondition = "Brand New" | "UK Used (Grade A)" | "Factory Refurbished";

export type CategorySlug =
  | "business-laptops"
  | "creator-workstations"
  | "gaming-performance"
  | "student-everyday"
  | "apple-macbooks"
  | "monitors-accessories";

export interface TechnicalSpecs {
  processor: string;
  ProcessorTier: "Core i5 / M1 / Ryzen 5" | "Core i7 / M2 / M3 / Ryzen 7" | "Core i9 / M3 Max / Ryzen 9";
  ramGb: number;
  ramText: string;
  storageGb: number;
  storageText: string;
  display: string;
  screenSizeInches: number;
  graphics: string;
  gpuType: "Integrated" | "Dedicated RTX / Pro";
  batteryLife: string;
  weightKg: number;
  os: string;
  ports: string;
  warrantyMonths: number;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  shortTitle: string;
  brand: "Apple" | "Dell" | "HP" | "Lenovo" | "ASUS" | "Logitech" | "Samsung";
  categorySlug: CategorySlug;
  categoryName: string;
  condition: ProductCondition;
  priceGhs: number;
  compareAtPriceGhs?: number;
  costPriceGhs: number; // Admin-only visibility
  supplyState: SupplyState;
  ownedQtyAvailable: number;
  ownedQtyReserved: number;
  supplierId?: string;
  supplierName?: string; // Admin-only visibility
  supplierAllocationQty?: number;
  supplierAllocationExpiry?: string;
  supplierLeadTimeDays?: number;
  preOrderDepositPercent?: number;
  preOrderEta?: string;
  featured: boolean;
  latestArrival: boolean;
  dealBadge?: string;
  rating: number;
  reviewCount: number;
  images: string[];
  summary: string;
  highlights: string[];
  useCases: ("student" | "office" | "programming" | "design" | "gaming" | "executive")[];
  specs: TechnicalSpecs;
  published: boolean;
  updatedAt: string;
}

export type PaymentStatus =
  | "unpaid"
  | "pending"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded"
  | "partially_refunded";

export type FulfilmentStatus =
  | "placed"
  | "confirmed"
  | "processing"
  | "dispatched"
  | "delivered"
  | "on_hold"
  | "cancelled"
  | "returned";

export type OrderAvailabilityStatus =
  | "in_stock"
  | "reserved"
  | "supplier_confirmed"
  | "unconfirmed"
  | "unavailable";

export type PaymentMethodType =
  | "WHATSAPP_DM_ORDER"
  | "ONLINE_MOMO"
  | "ONLINE_CARD"
  | "MANUAL_MOMO_TRANSFER"
  | "MANUAL_BANK_DEPOSIT";

export interface OrderItemSnapshot {
  productId: string;
  slug: string;
  sku: string;
  name: string;
  condition: ProductCondition;
  unitPriceGhs: number;
  quantity: number;
  supplyStateAtPurchase: SupplyState;
  specsSnapshot: string;
  warrantyMonths: number;
}

export interface OrderEvent {
  id: string;
  timestamp: string;
  actor: string;
  title: string;
  note: string;
}

export interface Order {
  id: string; // e.g., "SMC-2026-8419"
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string; // Used for verification in /track-order
  isGuest: boolean;
  userId?: string;
  deliveryZone: string;
  deliveryAddress: string;
  deliveryFeeGhs: number;
  subtotalGhs: number;
  discountGhs: number;
  couponCode?: string;
  loyaltyPointsRedeemed: number;
  loyaltyPointsEarned: number;
  totalGhs: number;
  paymentMethod: PaymentMethodType;
  paymentProviderRef?: string;
  manualPaymentSenderNumber?: string;
  manualPaymentReferenceNote?: string;
  paymentStatus: PaymentStatus;
  fulfilmentStatus: FulfilmentStatus;
  availabilityStatus: OrderAvailabilityStatus;
  items: OrderItemSnapshot[];
  events: OrderEvent[];
}

export interface AvailabilityRequestRecord {
  id: string; // e.g., "REQ-2026-309"
  createdAt: string;
  productId?: string;
  productName: string;
  desiredSpecs: string;
  conditionPreference: ProductCondition | "Any";
  budgetGhs: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes: string;
  status: "New Enquiry" | "Sourcing with Supplier" | "Quoted to Customer" | "Converted to Order" | "Closed";
  assignedSupplierId?: string;
  quotedPriceGhs?: number;
  leadTimeEstimate?: string;
  adminNotes?: string;
}

export interface SupplierRecord {
  id: string;
  name: string;
  location: string;
  contactPerson: string;
  phone: string;
  email: string;
  activeAllocations: number;
  averageLeadTimeDays: number;
  reliabilityRating: string;
  lastVerifiedAt: string;
}

export interface ReviewRecord {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  orderId?: string;
  status: "published" | "pending" | "hidden";
  createdAt: string;
}

export interface CouponRecord {
  code: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED_GHS";
  value: number;
  minOrderGhs: number;
  maxDiscountGhs: number;
  usageCount: number;
  usageLimit: number;
  expiresAt: string;
  active: boolean;
}

export interface RestockAlertSubscription {
  id: string;
  productId: string;
  productName: string;
  emailOrPhone: string;
  channel: "WhatsApp" | "Email" | "SMS";
  createdAt: string;
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: "Owner/Admin" | "Staff";
  action: string;
  entityRef: string;
  details: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  whatsappNumber: string;
  supportPhone: string;
  supportEmail: string;
  showroomAddress: string;
  momoMerchantNumber: string;
  momoMerchantName: string;
  bankAccountDetails: string;
  deliveryZones: { id: string; name: string; feeGhs: number; eta: string }[];
  loyaltyEarnRateGhsPerPoint: number; // e.g., 100 GHS spent = 1 point
  loyaltyRedeemValueGhsPerPoint: number; // e.g., 1 point = 5 GHS
}
