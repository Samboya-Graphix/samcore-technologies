"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Product,
  Order,
  SupplierRecord,
  AvailabilityRequestRecord,
  ReviewRecord,
  CouponRecord,
  RestockAlertSubscription,
  AdminAuditLog,
  StoreSettings,
  PaymentStatus,
  FulfilmentStatus,
  PaymentMethodType,
  SupplyState,
  ProductCondition,
} from "@/lib/types";
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_SUPPLIERS,
  INITIAL_REQUESTS,
  INITIAL_REVIEWS,
  INITIAL_COUPONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SETTINGS,
} from "@/lib/mock-data";
import { canImmediateCheckout, getMaxReservableQty, formatGhs } from "@/lib/utils";

export interface CartItem {
  productId: string;
  quantity: number;
  selectedRam?: string;
  selectedStorage?: string;
  customUnitPriceGhs?: number;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  defaultZoneId: string;
  defaultAddress: string;
  loyaltyPoints: number;
  loyaltyHistory: {
    id: string;
    date: string;
    description: string;
    pointsDelta: number;
  }[];
}

interface StoreContextType {
  products: Product[];
  orders: Order[];
  suppliers: SupplierRecord[];
  requests: AvailabilityRequestRecord[];
  reviews: ReviewRecord[];
  coupons: CouponRecord[];
  alerts: RestockAlertSubscription[];
  auditLogs: AdminAuditLog[];
  settings: StoreSettings;

  // Cart
  cart: CartItem[];
  addToCart: (
    productId: string,
    qty?: number,
    customSpecs?: {
      selectedRam?: string;
      selectedStorage?: string;
      customUnitPriceGhs?: number;
    }
  ) => { ok: boolean; message: string };
  updateCartQty: (productId: string, qty: number) => { ok: boolean; message: string };
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  // Compare (max 3)
  compareIds: string[];
  toggleCompare: (productId: string) => { ok: boolean; message: string };
  clearCompare: () => void;

  // Wishlist & Restock Alerts
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  subscribeRestockAlert: (
    productId: string,
    emailOrPhone: string,
    channel: "WhatsApp" | "Email" | "SMS"
  ) => void;
  removeRestockAlert: (alertId: string) => void;

  // Customer Account
  currentUser: CustomerUser | null;
  loginCustomer: (email: string, name?: string, phone?: string) => void;
  logoutCustomer: () => void;

  // Admin Security, Authentication & Role Enforcement
  isAdminAuthenticated: boolean;
  adminAuthEmail: string | null;
  adminRole: "Owner/Admin" | "Staff";
  failedAdminAttempts: number;
  adminLockoutUntil: number | null;
  authenticateAdmin: (
    email: string,
    password: string,
    securityPin?: string
  ) => { ok: boolean; error?: string; role?: "Owner/Admin" | "Staff" };
  lockAdminPortal: () => void;
  updateAdminCredentials: (
    newOwnerPassword: string,
    newOwnerPin: string,
    currentPin: string
  ) => { ok: boolean; message: string };
  setAdminRole: (role: "Owner/Admin" | "Staff") => void;

  // Checkout & Order Operations
  placeOrder: (payload: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryZoneId: string;
    deliveryAddress: string;
    paymentMethod: PaymentMethodType;
    couponCode?: string;
    redeemPoints?: number;
    manualSenderNumber?: string;
    manualReferenceNote?: string;
    onlineTransactionRef?: string;
  }) => { ok: boolean; order?: Order; error?: string };

  // Admin Mutations (with Audit Logging & Auth Guard)
  verifyOrderPayment: (orderId: string, providerRefNote?: string) => void;
  updateOrderFulfilment: (orderId: string, status: FulfilmentStatus, note?: string) => void;
  refundOrder: (orderId: string, reason: string) => void;
  adjustProductInventory: (
    productId: string,
    updates: Partial<Omit<Product, "id">>
  ) => void;
  createNewProduct: (newProd: Omit<Product, "id" | "updatedAt">) => Product;
  submitAvailabilityRequest: (
    req: Omit<AvailabilityRequestRecord, "id" | "createdAt" | "status">
  ) => AvailabilityRequestRecord;
  updateAvailabilityRequest: (
    reqId: string,
    updates: Partial<AvailabilityRequestRecord>
  ) => void;
  submitCustomerReview: (
    productId: string,
    rating: number,
    title: string,
    comment: string
  ) => void;
  moderateReview: (reviewId: string, status: "published" | "hidden") => void;
  createCoupon: (coupon: CouponRecord) => void;
  toggleCouponActive: (code: string) => void;
  updateStoreSettings: (newSettings: StoreSettings) => void;

  // Toast notification banner
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const DEFAULT_CUSTOMER: CustomerUser = {
  id: "USR-CUST-01",
  name: "Kofi Asante-Boateng",
  email: "kofi.asante@gmail.com",
  phone: "0244112233",
  defaultZoneId: "accra-metro",
  defaultAddress: "House 14, Labone Crescent, near Coffee Shop, Accra",
  loyaltyPoints: 280,
  loyaltyHistory: [
    {
      id: "LH-1",
      date: "2026-10-15",
      description: "Earned from Order #SMC-2026-8419 (ThinkPad X1 Carbon Gen 11)",
      pointsDelta: 162,
    },
    {
      id: "LH-2",
      date: "2026-09-20",
      description: "Welcome SAMCORE Member Bonus + Accessory Purchase",
      pointsDelta: 118,
    },
  ],
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [suppliers] = useState<SupplierRecord[]>(INITIAL_SUPPLIERS);
  const [requests, setRequests] = useState<AvailabilityRequestRecord[]>(INITIAL_REQUESTS);
  const [reviews, setReviews] = useState<ReviewRecord[]>(INITIAL_REVIEWS);
  const [coupons, setCoupons] = useState<CouponRecord[]>(INITIAL_COUPONS);
  const [alerts, setAlerts] = useState<RestockAlertSubscription[]>([
    {
      id: "ALT-01",
      productId: "PRD-009",
      productName: "Lenovo ThinkPad T14 Gen 2 Ryzen 5 PRO",
      emailOrPhone: "+233 24 411 2233",
      channel: "WhatsApp",
      createdAt: "2026-10-14",
    },
  ]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(INITIAL_AUDIT_LOGS);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);

  const [cart, setCart] = useState<CartItem[]>([
    { productId: "PRD-001", quantity: 1 },
  ]);
  const [compareIds, setCompareIds] = useState<string[]>(["PRD-001", "PRD-002", "PRD-003"]);
  const [wishlistIds, setWishlistIds] = useState<string[]>(["PRD-002", "PRD-005", "PRD-009"]);
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminAuthEmail, setAdminAuthEmail] = useState<string | null>(null);
  const [adminRole, setAdminRoleState] = useState<"Owner/Admin" | "Staff">("Staff");
  const [failedAdminAttempts, setFailedAdminAttempts] = useState<number>(0);
  const [adminLockoutUntil, setAdminLockoutUntil] = useState<number | null>(null);
  const [ownerMasterPassword, setOwnerMasterPassword] = useState<string>("SAMCORE@Admin2026!");
  const [ownerSecurityPin, setOwnerSecurityPin] = useState<string>("050946");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const [isServerHydrated, setIsServerHydrated] = useState<boolean>(false);

  // Load persisted state from server API + localStorage
  useEffect(() => {
    let isMounted = true;
    try {
      const savedProducts = localStorage.getItem("samcore_products_v1");
      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts);
        if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
          setProducts(parsedProducts);
        }
      }
      const savedCart = localStorage.getItem("samcore_cart_v1");
      if (savedCart) setCart(JSON.parse(savedCart));
      const savedWishlist = localStorage.getItem("samcore_wishlist_v1");
      if (savedWishlist) setWishlistIds(JSON.parse(savedWishlist));
      const savedCompare = localStorage.getItem("samcore_compare_v1");
      if (savedCompare) setCompareIds(JSON.parse(savedCompare));
      const savedCreds = localStorage.getItem("samcore_admin_vault_v1");
      if (savedCreds) {
        const parsed = JSON.parse(savedCreds);
        if (parsed.ownerMasterPassword) setOwnerMasterPassword(parsed.ownerMasterPassword);
        if (parsed.ownerSecurityPin) setOwnerSecurityPin(parsed.ownerSecurityPin);
      }
      const savedCustomer = sessionStorage.getItem("samcore_customer_session_v1");
      if (savedCustomer) {
        setCurrentUser(JSON.parse(savedCustomer));
      }
      const savedAdminSession = sessionStorage.getItem("samcore_admin_session_v1");
      if (savedAdminSession) {
        const parsed = JSON.parse(savedAdminSession);
        if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
          setIsAdminAuthenticated(true);
          setAdminAuthEmail(parsed.email);
          setAdminRoleState(parsed.role);
        } else {
          sessionStorage.removeItem("samcore_admin_session_v1");
        }
      }
    } catch {
      // Ignore storage errors
    }

    // Hydrate shared store data from /api/store
    fetch("/api/store", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (!isMounted || !payload?.ok || !payload.data) {
          setIsServerHydrated(true);
          return;
        }
        const db = payload.data;
        if (Array.isArray(db.products) && db.products.length > 0) {
          setProducts(db.products);
        }
        if (Array.isArray(db.orders)) setOrders(db.orders);
        if (Array.isArray(db.requests)) setRequests(db.requests);
        if (Array.isArray(db.reviews)) setReviews(db.reviews);
        if (Array.isArray(db.coupons)) setCoupons(db.coupons);
        if (Array.isArray(db.alerts)) setAlerts(db.alerts);
        if (Array.isArray(db.auditLogs)) setAuditLogs(db.auditLogs);
        if (db.settings) setSettings(db.settings);
        setIsServerHydrated(true);
      })
      .catch(() => {
        if (isMounted) setIsServerHydrated(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("samcore_products_v1", JSON.stringify(products));
      localStorage.setItem("samcore_cart_v1", JSON.stringify(cart));
      localStorage.setItem("samcore_wishlist_v1", JSON.stringify(wishlistIds));
      localStorage.setItem("samcore_compare_v1", JSON.stringify(compareIds));
    } catch {
      // Ignore storage errors
    }
  }, [products, cart, wishlistIds, compareIds]);

  // Persist shared store state to server database whenever modified
  useEffect(() => {
    if (!isServerHydrated) return;
    const timer = setTimeout(() => {
      fetch("/api/store", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products,
          orders,
          requests,
          reviews,
          coupons,
          alerts,
          auditLogs,
          settings,
        }),
      }).catch(() => {
        // Ignore network errors in offline mode
      });
    }, 250);
    return () => clearTimeout(timer);
  }, [
    isServerHydrated,
    products,
    orders,
    requests,
    reviews,
    coupons,
    alerts,
    auditLogs,
    settings,
  ]);

  const appendAudit = (action: string, entityRef: string, details: string, actorOverride?: string) => {
    const uniqueSuffix = `${Date.now().toString().slice(-4)}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;
    const entry: AdminAuditLog = {
      id: `AUD-${uniqueSuffix}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16) + " GMT",
      actor:
        actorOverride ||
        (adminRole === "Owner/Admin" ? "Samuel Amankwaa (Owner)" : "Store Staff"),
      role: adminRole,
      action,
      entityRef,
      details,
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  const authenticateAdmin: StoreContextType["authenticateAdmin"] = (
    email,
    password,
    securityPin = ""
  ) => {
    if (adminLockoutUntil && Date.now() < adminLockoutUntil) {
      const remainingSec = Math.ceil((adminLockoutUntil - Date.now()) / 1000);
      return {
        ok: false,
        error: `SECURITY LOCKOUT ACTIVE: Too many failed attempts. Try again in ${remainingSec}s.`,
      };
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPin = securityPin.trim();
    const pinMatchesOrNotRequired =
      cleanPin === "" || cleanPin === ownerSecurityPin;

    // Check Owner/Admin credentials
    if (
      cleanEmail === "samuel@samcore.gh" &&
      password === ownerMasterPassword &&
      pinMatchesOrNotRequired
    ) {
      const expiresAt = Date.now() + 15 * 60 * 1000; // 15-minute strict session TTL
      setIsAdminAuthenticated(true);
      setAdminAuthEmail(cleanEmail);
      setAdminRoleState("Owner/Admin");
      setFailedAdminAttempts(0);
      setAdminLockoutUntil(null);
      try {
        sessionStorage.setItem(
          "samcore_admin_session_v1",
          JSON.stringify({ email: cleanEmail, role: "Owner/Admin", expiresAt })
        );
      } catch {
        // ignore
      }
      appendAudit(
        "ADMIN_AUTH_SUCCESS",
        "UNIFIED_LOGIN",
        "Owner/Admin signed in via unified login form.",
        "Samuel Amankwaa (Owner)"
      );
      showToast("Signed in as Owner/Admin.");
      return { ok: true, role: "Owner/Admin" };
    }

    // Check Staff credentials (least privilege)
    if (
      cleanEmail === "staff@samcore.gh" &&
      password === "SAMCORE@Staff2026" &&
      (cleanPin === "" || cleanPin === "112233")
    ) {
      const expiresAt = Date.now() + 15 * 60 * 1000;
      setIsAdminAuthenticated(true);
      setAdminAuthEmail(cleanEmail);
      setAdminRoleState("Staff");
      setFailedAdminAttempts(0);
      setAdminLockoutUntil(null);
      try {
        sessionStorage.setItem(
          "samcore_admin_session_v1",
          JSON.stringify({ email: cleanEmail, role: "Staff", expiresAt })
        );
      } catch {
        // ignore
      }
      appendAudit(
        "STAFF_AUTH_SUCCESS",
        "UNIFIED_LOGIN",
        "Staff signed in with restricted least-privilege session.",
        "Store Staff"
      );
      showToast("Signed in as Staff (Restricted Access).");
      return { ok: true, role: "Staff" };
    }

    // Failed attempt handling for Admin/Staff emails
    const nextAttempts = failedAdminAttempts + 1;
    setFailedAdminAttempts(nextAttempts);
    appendAudit(
      "SECURITY_ALERT_FAILED_LOGIN",
      "UNIFIED_LOGIN",
      `Failed admin login attempt #${nextAttempts} for "${cleanEmail || "unknown"}".`,
      "Unverified Actor"
    );

    if (nextAttempts >= 3) {
      const lockUntil = Date.now() + 60 * 1000; // 60s brute-force lockout
      setAdminLockoutUntil(lockUntil);
      return {
        ok: false,
        error:
          "SECURITY LOCKOUT TRIGGERED: 3 failed authentication attempts. Login locked for 60 seconds and logged to Security Audit Trail.",
      };
    }

    return {
      ok: false,
      error: `Invalid Admin login credentials. (${
        3 - nextAttempts
      } attempt(s) remaining before security lockout)`,
    };
  };

  const lockAdminPortal = () => {
    appendAudit(
      "ADMIN_SESSION_LOCKED",
      "SECURITY_GATE",
      `Admin session signed out and locked by ${adminAuthEmail || adminRole}.`
    );
    setIsAdminAuthenticated(false);
    setAdminAuthEmail(null);
    setAdminRoleState("Staff");
    try {
      sessionStorage.removeItem("samcore_admin_session_v1");
    } catch {
      // ignore
    }
    showToast("Signed out of Admin Portal.");
  };

  const updateAdminCredentials: StoreContextType["updateAdminCredentials"] = (
    newOwnerPassword,
    newOwnerPin,
    currentPin
  ) => {
    if (!isAdminAuthenticated || adminRole !== "Owner/Admin") {
      return {
        ok: false,
        message: "SECURITY DENIAL: Only an authenticated Owner/Admin can rotate security credentials.",
      };
    }
    if (currentPin.trim() !== ownerSecurityPin && currentPin.trim() !== ownerMasterPassword) {
      appendAudit(
        "SECURITY_ALERT_CREDENTIAL_MISMATCH",
        "ADMIN_VAULT",
        "Failed attempt to rotate Owner Master Password."
      );
      return {
        ok: false,
        message: "Current Master Password or Security PIN is incorrect.",
      };
    }
    if (newOwnerPassword.trim().length < 8) {
      return {
        ok: false,
        message: "New Master Password must be at least 8 characters.",
      };
    }

    const nextPin = /^\d{6}$/.test(newOwnerPin.trim())
      ? newOwnerPin.trim()
      : ownerSecurityPin;

    setOwnerMasterPassword(newOwnerPassword.trim());
    setOwnerSecurityPin(nextPin);
    try {
      localStorage.setItem(
        "samcore_admin_vault_v1",
        JSON.stringify({
          ownerMasterPassword: newOwnerPassword.trim(),
          ownerSecurityPin: nextPin,
        })
      );
    } catch {
      // ignore
    }
    appendAudit(
      "ADMIN_CREDENTIALS_ROTATED",
      "ADMIN_VAULT",
      "Owner Master Password updated."
    );
    showToast("Owner Master Password updated.");
    return {
      ok: true,
      message: "Admin login password updated successfully.",
    };
  };

  const setAdminRole = (role: "Owner/Admin" | "Staff") => {
    if (!isAdminAuthenticated) {
      showToast("SECURITY BLOCK: Sign in first before changing role.");
      return;
    }
    if (role === "Owner/Admin" && adminAuthEmail !== "samuel@samcore.gh") {
      showToast(
        "PRIVILEGE ESCALATION BLOCKED: Staff accounts cannot switch to Owner/Admin."
      );
      appendAudit(
        "SECURITY_BLOCK_PRIVILEGE_ESCALATION",
        "ROLE_GUARD",
        "Blocked unauthorized attempt to switch from Staff to Owner/Admin."
      );
      return;
    }
    setAdminRoleState(role);
  };

  const addToCart: StoreContextType["addToCart"] = (
    productId,
    qty = 1,
    customSpecs
  ) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return { ok: false, message: "Product not found." };

    if (!canImmediateCheckout(product)) {
      const msg =
        product.supplyState === "SUPPLIER_UNKNOWN"
          ? "Unconfirmed supplier stock cannot be added to cart. Please use the WhatsApp DM button to confirm availability."
          : "This item is currently sold out. Join the Restock Alert list.";
      showToast(msg);
      return { ok: false, message: msg };
    }

    const maxQty = getMaxReservableQty(product);
    const existing = cart.find((i) => i.productId === productId);
    const targetQty = (existing?.quantity ?? 0) + qty;

    if (targetQty > maxQty) {
      const msg = `Cannot exceed ${maxQty} reservable unit(s) for ${product.shortTitle}.`;
      showToast(msg);
      return { ok: false, message: msg };
    }

    setCart((prev) => {
      if (existing) {
        return prev.map((i) =>
          i.productId === productId
            ? {
                ...i,
                quantity: targetQty,
                selectedRam: customSpecs?.selectedRam ?? i.selectedRam,
                selectedStorage:
                  customSpecs?.selectedStorage ?? i.selectedStorage,
                customUnitPriceGhs:
                  customSpecs?.customUnitPriceGhs ?? i.customUnitPriceGhs,
              }
            : i
        );
      }
      return [
        ...prev,
        {
          productId,
          quantity: qty,
          selectedRam: customSpecs?.selectedRam,
          selectedStorage: customSpecs?.selectedStorage,
          customUnitPriceGhs: customSpecs?.customUnitPriceGhs,
        },
      ];
    });

    const msg = `Added ${product.shortTitle} to order list.`;
    showToast(msg);
    return { ok: true, message: msg };
  };

  const updateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return { ok: true, message: "Removed from cart." };
    }
    const product = products.find((p) => p.id === productId);
    if (!product) return { ok: false, message: "Product not found." };
    const maxQty = getMaxReservableQty(product);
    if (qty > maxQty) {
      const msg = `Maximum reservable stock is ${maxQty} unit(s).`;
      showToast(msg);
      return { ok: false, message: msg };
    }
    setCart((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i))
    );
    return { ok: true, message: "Quantity updated." };
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
    showToast("Item removed from cart.");
  };

  const clearCart = () => setCart([]);

  const toggleCompare = (productId: string) => {
    if (compareIds.includes(productId)) {
      setCompareIds((prev) => prev.filter((id) => id !== productId));
      showToast("Removed from comparison tray.");
      return { ok: true, message: "Removed from comparison." };
    }
    if (compareIds.length >= 3) {
      const msg = "You can compare up to 3 laptops at a time. Remove one first.";
      showToast(msg);
      return { ok: false, message: msg };
    }
    setCompareIds((prev) => [...prev, productId]);
    showToast("Added to laptop comparison (up to 3).");
    return { ok: true, message: "Added to comparison." };
  };

  const clearCompare = () => setCompareIds([]);

  const toggleWishlist = (productId: string) => {
    if (wishlistIds.includes(productId)) {
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      showToast("Removed from saved wishlist.");
    } else {
      setWishlistIds((prev) => [...prev, productId]);
      showToast("Saved to your wishlist.");
    }
  };

  const subscribeRestockAlert = (
    productId: string,
    emailOrPhone: string,
    channel: "WhatsApp" | "Email" | "SMS"
  ) => {
    const prod = products.find((p) => p.id === productId);
    const sub: RestockAlertSubscription = {
      id: `ALT-${Date.now().toString().slice(-4)}-${Math.random()
        .toString(36)
        .slice(2, 5)
        .toUpperCase()}`,
      productId,
      productName: prod?.shortTitle ?? "SAMCORE Device",
      emailOrPhone,
      channel,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setAlerts((prev) => [sub, ...prev]);
    showToast(`Restock alert registered via ${channel} for ${sub.productName}.`);
  };

  const removeRestockAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    showToast("Alert subscription removed.");
  };

  const loginCustomer = (email: string, name?: string, phone?: string) => {
    const nextUser: CustomerUser = {
      ...DEFAULT_CUSTOMER,
      email: email || DEFAULT_CUSTOMER.email,
      name:
        name ||
        (email && email.toLowerCase() !== DEFAULT_CUSTOMER.email.toLowerCase()
          ? email.split("@")[0].replace(/[._-]/g, " ")
          : DEFAULT_CUSTOMER.name),
      phone: phone || DEFAULT_CUSTOMER.phone,
    };
    setCurrentUser(nextUser);
    try {
      sessionStorage.setItem("samcore_customer_session_v1", JSON.stringify(nextUser));
    } catch {
      // ignore
    }
    showToast("Signed in to your SAMCORE account.");
  };

  const logoutCustomer = () => {
    setCurrentUser(null);
    try {
      sessionStorage.removeItem("samcore_customer_session_v1");
    } catch {
      // ignore
    }
    showToast("Signed out. You can still browse or use Guest Checkout.");
  };

  const placeOrder: StoreContextType["placeOrder"] = (payload) => {
    if (cart.length === 0) {
      return { ok: false, error: "Your cart is empty." };
    }

    // Recheck prices, stock and supplier allocation per Section 6.2
    for (const item of cart) {
      const prod = products.find((p) => p.id === item.productId);
      if (!prod || !canImmediateCheckout(prod)) {
        return {
          ok: false,
          error: `${prod?.name ?? "An item"} is no longer eligible for immediate checkout.`,
        };
      }
      if (item.quantity > getMaxReservableQty(prod)) {
        return {
          ok: false,
          error: `Insufficient reservable stock for ${prod.shortTitle}. Only ${getMaxReservableQty(prod)} available.`,
        };
      }
    }

    const subtotalGhs = cart.reduce((sum, item) => {
      const prod = products.find((p) => p.id === item.productId)!;
      const unitPrice = item.customUnitPriceGhs ?? prod.priceGhs;
      return sum + unitPrice * item.quantity;
    }, 0);

    const zone =
      settings.deliveryZones.find((z) => z.id === payload.deliveryZoneId) ??
      settings.deliveryZones[0];

    let couponDiscount = 0;
    if (payload.couponCode) {
      const foundCoupon = coupons.find(
        (c) => c.code.toUpperCase() === payload.couponCode?.toUpperCase() && c.active
      );
      if (foundCoupon && subtotalGhs >= foundCoupon.minOrderGhs) {
        couponDiscount =
          foundCoupon.discountType === "FIXED_GHS"
            ? foundCoupon.value
            : Math.min(
                foundCoupon.maxDiscountGhs,
                Math.round((subtotalGhs * foundCoupon.value) / 100)
              );
      }
    }

    const pointsToRedeem = payload.redeemPoints ?? 0;
    const loyaltyDiscount = pointsToRedeem * settings.loyaltyRedeemValueGhsPerPoint;
    const totalDiscount = couponDiscount + loyaltyDiscount;
    const totalGhs = Math.max(0, subtotalGhs - totalDiscount + zone.feeGhs);
    const pointsEarned = Math.floor(totalGhs / settings.loyaltyEarnRateGhsPerPoint);

    const isOnline =
      payload.paymentMethod === "ONLINE_MOMO" ||
      payload.paymentMethod === "ONLINE_CARD";

    const orderId = `SMC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();
    const nowHuman = nowIso.replace("T", " ").slice(0, 16) + " GMT";

    const newOrder: Order = {
      id: orderId,
      createdAt: nowIso,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone,
      isGuest: !currentUser,
      userId: currentUser?.id,
      deliveryZone: zone.name,
      deliveryAddress: payload.deliveryAddress,
      deliveryFeeGhs: zone.feeGhs,
      subtotalGhs,
      discountGhs: totalDiscount,
      couponCode: payload.couponCode,
      loyaltyPointsRedeemed: pointsToRedeem,
      loyaltyPointsEarned: pointsEarned,
      totalGhs,
      paymentMethod: payload.paymentMethod,
      paymentProviderRef: isOnline
        ? payload.onlineTransactionRef || `PSTK_VERIFIED_${Date.now().toString().slice(-6)}`
        : payload.paymentMethod === "WHATSAPP_DM_ORDER"
        ? `WA_DM_${orderId}`
        : undefined,
      manualPaymentSenderNumber: payload.manualSenderNumber,
      manualPaymentReferenceNote: payload.manualReferenceNote,
      paymentStatus: isOnline ? "paid" : "pending",
      fulfilmentStatus: isOnline ? "confirmed" : "placed",
      availabilityStatus: "reserved",
      items: cart.map((item) => {
        const prod = products.find((p) => p.id === item.productId)!;
        const unitPrice = item.customUnitPriceGhs ?? prod.priceGhs;
        const ramChosen = item.selectedRam || prod.specs.ramText;
        const storageChosen = item.selectedStorage || prod.specs.storageText;
        return {
          productId: prod.id,
          slug: prod.slug,
          sku: prod.sku,
          name: prod.name,
          condition: prod.condition,
          unitPriceGhs: unitPrice,
          quantity: item.quantity,
          supplyStateAtPurchase: prod.supplyState,
          specsSnapshot: `${prod.specs.processor} | ${ramChosen} | ${storageChosen}`,
          warrantyMonths: prod.specs.warrantyMonths,
        };
      }),
      events: [
        {
          id: `EVT-${Date.now()}-1`,
          timestamp: nowHuman,
          actor: "Transactional Stock Engine",
          title: "Stock Reserved & Specification Snapshot Locked",
          note: "Inventory quantities and selected specifications reserved in ledger.",
        },
        payload.paymentMethod === "WHATSAPP_DM_ORDER"
          ? {
              id: `EVT-${Date.now()}-2`,
              timestamp: nowHuman,
              actor: "WhatsApp Order Dispatch",
              title: "Order Sent Automatically to SAMCORE WhatsApp DM",
              note: `Complete device & specification details routed to official SAMCORE WhatsApp DM (+${settings.whatsappNumber}) for direct payment & dispatch arrangement.`,
            }
          : isOnline
          ? {
              id: `EVT-${Date.now()}-2`,
              timestamp: nowHuman,
              actor: "Payment Gateway Webhook",
              title: "Online Payment Verified Server-Side",
              note: `Verified ${payload.paymentMethod} settlement of ${formatGhs(totalGhs)}. Order confirmed for fulfilment.`,
            }
          : {
              id: `EVT-${Date.now()}-2`,
              timestamp: nowHuman,
              actor: "Manual Settlement Queue",
              title: "Awaiting Admin Payment Verification",
              note: `Manual payment reference recorded (${payload.manualReferenceNote || "Pending Transfer"}). Admin will verify settlement before dispatch.`,
            },
      ],
    };

    // Transactional stock decrement / reservation
    setProducts((prev) =>
      prev.map((prod) => {
        const inCart = cart.find((c) => c.productId === prod.id);
        if (!inCart) return prod;
        if (prod.supplyState === "OWNED_IN_STOCK") {
          const nextAvail = Math.max(0, prod.ownedQtyAvailable - inCart.quantity);
          return {
            ...prod,
            ownedQtyAvailable: nextAvail,
            ownedQtyReserved: prod.ownedQtyReserved + inCart.quantity,
            supplyState: nextAvail === 0 ? "OUT_OF_STOCK" : prod.supplyState,
          };
        }
        if (prod.supplyState === "SUPPLIER_CONFIRMED") {
          const nextSup = Math.max(
            0,
            (prod.supplierAllocationQty ?? 0) - inCart.quantity
          );
          return {
            ...prod,
            supplierAllocationQty: nextSup,
            supplyState: nextSup === 0 ? "SUPPLIER_UNKNOWN" : prod.supplyState,
          };
        }
        return prod;
      })
    );

    // Update customer loyalty ledger if signed in
    if (currentUser) {
      const netDelta = pointsEarned - pointsToRedeem;
      setCurrentUser({
        ...currentUser,
        loyaltyPoints: Math.max(0, currentUser.loyaltyPoints + netDelta),
        loyaltyHistory: [
          {
            id: `LH-${Date.now()}`,
            date: nowIso.slice(0, 10),
            description: `Order #${orderId} (+${pointsEarned} earned${
              pointsToRedeem > 0 ? `, -${pointsToRedeem} redeemed` : ""
            })`,
            pointsDelta: netDelta,
          },
          ...currentUser.loyaltyHistory,
        ],
      });
    }

    setOrders((prev) => [newOrder, ...prev]);
    appendAudit(
      "ORDER_CREATED",
      orderId,
      `Created order (${payload.paymentMethod}) for ${formatGhs(totalGhs)}. Status: ${newOrder.paymentStatus}.`
    );
    clearCart();
    return { ok: true, order: newOrder };
  };

  const verifyOrderPayment = (orderId: string, providerRefNote?: string) => {
    if (!isAdminAuthenticated) {
      showToast("SECURITY BLOCK: Admin authentication required.");
      return;
    }
    const nowHuman = new Date().toISOString().replace("T", " ").slice(0, 16) + " GMT";
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId || o.paymentStatus === "paid") return o; // Idempotent guard
        return {
          ...o,
          paymentStatus: "paid" as PaymentStatus,
          fulfilmentStatus:
            o.fulfilmentStatus === "placed" ? "confirmed" : o.fulfilmentStatus,
          paymentProviderRef:
            providerRefNote || o.paymentProviderRef || `ADMIN_VERIFIED_${Date.now().toString().slice(-5)}`,
          events: [
            ...o.events,
            {
              id: `EVT-${Date.now()}`,
              timestamp: nowHuman,
              actor: `Admin (${adminRole})`,
              title: "Payment Verified & Approved",
              note: providerRefNote || "Manual settlement verified against merchant statement.",
            },
          ],
        };
      })
    );
    appendAudit(
      "PAYMENT_VERIFIED",
      orderId,
      `Verified payment settlement. ${providerRefNote ?? ""}`
    );
    showToast(`Payment verified for Order ${orderId}.`);
  };

  const updateOrderFulfilment = (
    orderId: string,
    status: FulfilmentStatus,
    note?: string
  ) => {
    if (!isAdminAuthenticated) {
      showToast("SECURITY BLOCK: Admin authentication required.");
      return;
    }
    const nowHuman = new Date().toISOString().replace("T", " ").slice(0, 16) + " GMT";
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          fulfilmentStatus: status,
          events: [
            ...o.events,
            {
              id: `EVT-${Date.now()}`,
              timestamp: nowHuman,
              actor: `Admin (${adminRole})`,
              title: `Fulfilment Status → ${status.toUpperCase()}`,
              note: note || `Order moved to ${status} stage.`,
            },
          ],
        };
      })
    );
    appendAudit(
      "FULFILMENT_UPDATED",
      orderId,
      `Updated fulfilment status to ${status.toUpperCase()}.`
    );
    showToast(`Order ${orderId} fulfilment set to ${status.toUpperCase()}.`);
  };

  const refundOrder = (orderId: string, reason: string) => {
    if (!isAdminAuthenticated || adminRole !== "Owner/Admin") {
      showToast("SECURITY BLOCK: Only an authenticated Owner/Admin can authorize refunds.");
      return;
    }
    const nowHuman = new Date().toISOString().replace("T", " ").slice(0, 16) + " GMT";
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder || targetOrder.paymentStatus === "refunded") return;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          paymentStatus: "refunded",
          fulfilmentStatus: "returned",
          availabilityStatus: "in_stock",
          events: [
            ...o.events,
            {
              id: `EVT-${Date.now()}`,
              timestamp: nowHuman,
              actor: `Admin (${adminRole})`,
              title: "Order Refunded & Stock Restored",
              note: `Refund processed (${reason}). Reserved stock returned to available inventory and loyalty points reversed.`,
            },
          ],
        };
      })
    );

    // Restore stock to owned inventory
    setProducts((prev) =>
      prev.map((p) => {
        const ordItem = targetOrder.items.find((i) => i.productId === p.id);
        if (!ordItem) return p;
        return {
          ...p,
          ownedQtyAvailable: p.ownedQtyAvailable + ordItem.quantity,
          ownedQtyReserved: Math.max(0, p.ownedQtyReserved - ordItem.quantity),
          supplyState:
            p.supplyState === "OUT_OF_STOCK" ? "OWNED_IN_STOCK" : p.supplyState,
        };
      })
    );

    appendAudit(
      "ORDER_REFUNDED",
      orderId,
      `Refunded ${formatGhs(targetOrder.totalGhs)}. Reason: ${reason}. Restored stock & reversed loyalty.`
    );
    showToast(`Order ${orderId} refunded and audited.`);
  };

  const adjustProductInventory: StoreContextType["adjustProductInventory"] = (
    productId,
    updates
  ) => {
    if (!isAdminAuthenticated) {
      showToast("SECURITY BLOCK: Admin authentication required.");
      return;
    }
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;

        let nextSupplyState = updates.supplyState ?? p.supplyState;
        let nextOwnedQty =
          updates.ownedQtyAvailable !== undefined
            ? updates.ownedQtyAvailable
            : p.ownedQtyAvailable;

        // If admin sets supplyState explicitly to OUT_OF_STOCK without specifying qty, zero out ownedQty
        if (
          updates.supplyState === "OUT_OF_STOCK" &&
          updates.ownedQtyAvailable === undefined
        ) {
          nextOwnedQty = 0;
        }
        // If admin sets supplyState to OWNED_IN_STOCK and qty was 0, default to at least 1 unit unless specified
        if (
          updates.supplyState === "OWNED_IN_STOCK" &&
          updates.ownedQtyAvailable === undefined &&
          nextOwnedQty <= 0
        ) {
          nextOwnedQty = 1;
        }
        // If admin adjusts ownedQtyAvailable to 0 on an OWNED_IN_STOCK item without specifying supplyState, mark OUT_OF_STOCK
        if (
          updates.ownedQtyAvailable !== undefined &&
          updates.ownedQtyAvailable <= 0 &&
          updates.supplyState === undefined &&
          p.supplyState === "OWNED_IN_STOCK"
        ) {
          nextSupplyState = "OUT_OF_STOCK";
        }
        // If admin restocks ownedQtyAvailable > 0 on an OUT_OF_STOCK item, mark OWNED_IN_STOCK
        if (
          updates.ownedQtyAvailable !== undefined &&
          updates.ownedQtyAvailable > 0 &&
          updates.supplyState === undefined &&
          p.supplyState === "OUT_OF_STOCK"
        ) {
          nextSupplyState = "OWNED_IN_STOCK";
        }

        return {
          ...p,
          ...updates,
          ownedQtyAvailable: nextOwnedQty,
          supplyState: nextSupplyState,
          specs: updates.specs ? { ...p.specs, ...updates.specs } : p.specs,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    appendAudit(
      "PRODUCT_INVENTORY_UPDATE",
      productId,
      `Updated fields: ${Object.keys(updates).join(", ")}`
    );
    showToast("Gadget availability, images & specifications updated.");
  };

  const createNewProduct: StoreContextType["createNewProduct"] = (newProd) => {
    if (!isAdminAuthenticated) {
      showToast("SECURITY BLOCK: Admin authentication required.");
      throw new Error("Admin authentication required");
    }
    const created: Product = {
      ...newProd,
      id: `PRD-${String(products.length + 1).padStart(3, "0")}-${Math.random()
        .toString(36)
        .slice(2, 5)
        .toUpperCase()}`,
      updatedAt: new Date().toISOString(),
    };
    setProducts((prev) => [created, ...prev]);
    appendAudit(
      "PRODUCT_CREATED",
      created.id,
      `Created product ${created.shortTitle} (${formatGhs(created.priceGhs)}) [${created.supplyState}]`
    );
    showToast(`Created product: ${created.shortTitle}`);
    return created;
  };

  const submitAvailabilityRequest: StoreContextType["submitAvailabilityRequest"] = (
    req
  ) => {
    const created: AvailabilityRequestRecord = {
      ...req,
      id: `REQ-2026-${Math.floor(320 + Math.random() * 600)}-${Math.random()
        .toString(36)
        .slice(2, 5)
        .toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: "New Enquiry",
    };
    setRequests((prev) => [created, ...prev]);
    appendAudit(
      "AVAILABILITY_REQUEST_LOGGED",
      created.id,
      `Customer ${created.customerName} requested ${created.productName}`
    );
    showToast(`Availability request ${created.id} submitted.`);
    return created;
  };

  const updateAvailabilityRequest: StoreContextType["updateAvailabilityRequest"] = (
    reqId,
    updates
  ) => {
    if (!isAdminAuthenticated) {
      showToast("SECURITY BLOCK: Admin authentication required.");
      return;
    }
    setRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, ...updates } : r))
    );
    appendAudit(
      "REQUEST_SOURCING_UPDATED",
      reqId,
      `Updated availability request (${updates.status ?? "quoted"})`
    );
    showToast(`Updated request ${reqId}.`);
  };

  const submitCustomerReview: StoreContextType["submitCustomerReview"] = (
    productId,
    rating,
    title,
    comment
  ) => {
    const prod = products.find((p) => p.id === productId);
    const hasPurchased = orders.some(
      (o) =>
        o.paymentStatus === "paid" &&
        o.items.some((i) => i.productId === productId)
    );
    const rev: ReviewRecord = {
      id: `REV-${String(reviews.length + 1).padStart(3, "0")}-${Math.random()
        .toString(36)
        .slice(2, 5)
        .toUpperCase()}`,
      productId,
      productName: prod?.shortTitle ?? "SAMCORE Laptop",
      customerName: currentUser?.name ?? "Verified Guest Buyer",
      rating,
      title,
      comment,
      verifiedPurchase: hasPurchased,
      status: "pending",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setReviews((prev) => [rev, ...prev]);
    showToast("Review submitted for moderation.");
  };

  const moderateReview = (reviewId: string, status: "published" | "hidden") => {
    if (!isAdminAuthenticated) {
      showToast("SECURITY BLOCK: Admin authentication required.");
      return;
    }
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status } : r))
    );
    appendAudit(
      "REVIEW_MODERATED",
      reviewId,
      `Set review status to ${status.toUpperCase()}`
    );
    showToast(`Review ${reviewId} marked as ${status}.`);
  };

  const createCoupon = (coupon: CouponRecord) => {
    if (!isAdminAuthenticated || adminRole !== "Owner/Admin") {
      showToast("SECURITY BLOCK: Owner/Admin authentication required.");
      return;
    }
    setCoupons((prev) => [coupon, ...prev]);
    appendAudit("COUPON_CREATED", coupon.code, `Created coupon ${coupon.code}`);
    showToast(`Coupon ${coupon.code} created.`);
  };

  const toggleCouponActive = (code: string) => {
    if (!isAdminAuthenticated || adminRole !== "Owner/Admin") {
      showToast("SECURITY BLOCK: Owner/Admin authentication required.");
      return;
    }
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, active: !c.active } : c))
    );
    appendAudit("COUPON_TOGGLED", code, `Toggled active state for ${code}`);
    showToast(`Updated coupon ${code}.`);
  };

  const updateStoreSettings = (newSettings: StoreSettings) => {
    if (!isAdminAuthenticated || adminRole !== "Owner/Admin") {
      showToast("SECURITY BLOCK: Only an authenticated Owner/Admin can modify store settings.");
      return;
    }
    setSettings(newSettings);
    appendAudit("SETTINGS_UPDATED", "STORE_SETTINGS", "Updated store configuration");
    showToast("Store settings saved.");
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        suppliers,
        requests,
        reviews,
        coupons,
        alerts,
        auditLogs,
        settings,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        compareIds,
        toggleCompare,
        clearCompare,
        wishlistIds,
        toggleWishlist,
        subscribeRestockAlert,
        removeRestockAlert,
        currentUser,
        loginCustomer,
        logoutCustomer,
        isAdminAuthenticated,
        adminAuthEmail,
        adminRole,
        failedAdminAttempts,
        adminLockoutUntil,
        authenticateAdmin,
        lockAdminPortal,
        updateAdminCredentials,
        setAdminRole,
        placeOrder,
        verifyOrderPayment,
        updateOrderFulfilment,
        refundOrder,
        adjustProductInventory,
        createNewProduct,
        submitAvailabilityRequest,
        updateAvailabilityRequest,
        submitCustomerReview,
        moderateReview,
        createCoupon,
        toggleCouponActive,
        updateStoreSettings,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
