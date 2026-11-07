import fs from "fs";
import path from "path";
import {
  Product,
  Order,
  AvailabilityRequestRecord,
  ReviewRecord,
  CouponRecord,
  RestockAlertSubscription,
  AdminAuditLog,
  StoreSettings,
} from "./types";
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_REQUESTS,
  INITIAL_REVIEWS,
  INITIAL_COUPONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SETTINGS,
} from "./mock-data";

export interface ServerStoreDatabase {
  products: Product[];
  orders: Order[];
  requests: AvailabilityRequestRecord[];
  reviews: ReviewRecord[];
  coupons: CouponRecord[];
  alerts: RestockAlertSubscription[];
  auditLogs: AdminAuditLog[];
  settings: StoreSettings;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE_PATH = path.join(DATA_DIR, "store-db.json");

const DEFAULT_DB: ServerStoreDatabase = {
  products: INITIAL_PRODUCTS,
  orders: INITIAL_ORDERS,
  requests: INITIAL_REQUESTS,
  reviews: INITIAL_REVIEWS,
  coupons: INITIAL_COUPONS,
  alerts: [
    {
      id: "ALT-01",
      productId: "PRD-009",
      productName: "Lenovo ThinkPad T14 Gen 2 Ryzen 5 PRO",
      emailOrPhone: "+233 24 411 2233",
      channel: "WhatsApp",
      createdAt: "2026-10-14",
    },
  ],
  auditLogs: INITIAL_AUDIT_LOGS,
  settings: INITIAL_SETTINGS,
  updatedAt: new Date().toISOString(),
};

let memoryCache: ServerStoreDatabase | null = null;

export function readServerDb(): ServerStoreDatabase {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw) as Partial<ServerStoreDatabase>;
      memoryCache = {
        products: Array.isArray(parsed.products) && parsed.products.length > 0 ? parsed.products : DEFAULT_DB.products,
        orders: Array.isArray(parsed.orders) ? parsed.orders : DEFAULT_DB.orders,
        requests: Array.isArray(parsed.requests) ? parsed.requests : DEFAULT_DB.requests,
        reviews: Array.isArray(parsed.reviews) ? parsed.reviews : DEFAULT_DB.reviews,
        coupons: Array.isArray(parsed.coupons) ? parsed.coupons : DEFAULT_DB.coupons,
        alerts: Array.isArray(parsed.alerts) ? parsed.alerts : DEFAULT_DB.alerts,
        auditLogs: Array.isArray(parsed.auditLogs) ? parsed.auditLogs : DEFAULT_DB.auditLogs,
        settings: parsed.settings ?? DEFAULT_DB.settings,
        updatedAt: parsed.updatedAt ?? new Date().toISOString(),
      };
      return memoryCache;
    }
  } catch {
    // Fallback to in-memory cache or default seed if disk read fails
  }

  if (!memoryCache) {
    memoryCache = { ...DEFAULT_DB };
    writeServerDb(memoryCache);
  }
  return memoryCache;
}

export function writeServerDb(partial: Partial<ServerStoreDatabase>): ServerStoreDatabase {
  const current = memoryCache ?? readServerDb();
  const nextDb: ServerStoreDatabase = {
    ...current,
    ...partial,
    updatedAt: new Date().toISOString(),
  };
  memoryCache = nextDb;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(nextDb, null, 2), "utf-8");
  } catch {
    // In read-only serverless environments, memoryCache still serves the active instance
  }

  return nextDb;
}
