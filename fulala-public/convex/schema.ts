import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Order status workflow: pending → confirmed → preparing → ready → served → completed
const orderStatus = v.union(
  v.literal("pending"),
  v.literal("confirmed"),
  v.literal("preparing"),
  v.literal("ready"),
  v.literal("served"),
  v.literal("completed"),
  v.literal("cancelled")
);

// Table status
const tableStatus = v.union(
  v.literal("available"),
  v.literal("occupied"),
  v.literal("reserved"),
  v.literal("cleaning")
);

// Table shape
const tableShape = v.union(
  v.literal("round"),
  v.literal("square"),
  v.literal("rectangle")
);

// Reservation status
const reservationStatus = v.union(
  v.literal("pending"),
  v.literal("confirmed"),
  v.literal("seated"),
  v.literal("completed"),
  v.literal("cancelled"),
  v.literal("no_show")
);

// QR code type
const qrCodeType = v.union(
  v.literal("table_order"),
  v.literal("menu_view"),
  v.literal("reservation")
);

// Admin role
const adminRole = v.union(
  v.literal("owner"),
  v.literal("manager"),
  v.literal("staff")
);

export default defineSchema({
  // ============ EXISTING TABLES ============

  menuItems: defineTable({
    title: v.string(),
    description: v.string(),
    price: v.number(),
    priceDisplay: v.string(), // e.g., "185 Kč"
    category: v.string(),
    image: v.optional(v.id("_storage")),
    isAvailable: v.boolean(),
    sortOrder: v.number(),
  })
    .index("by_category", ["category", "sortOrder"])
    .index("by_sort", ["sortOrder"]),

  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    sortOrder: v.number(),
    description: v.optional(v.string()),
  }).index("by_sort", ["sortOrder"]),

  siteSettings: defineTable({
    key: v.string(),
    value: v.any(),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),

  media: defineTable({
    storageId: v.id("_storage"),
    filename: v.string(),
    contentType: v.string(),
    uploadedAt: v.number(),
    alt: v.optional(v.string()),
  }).index("by_upload", ["uploadedAt"]),

  storyContent: defineTable({
    section: v.string(), // "intro", "origin", "team", "values"
    title: v.string(),
    content: v.string(), // Markdown or plain text
    image: v.optional(v.id("_storage")),
    sortOrder: v.number(),
  }).index("by_section", ["section", "sortOrder"]),

  // ============ NEW TABLES ============

  // Orders - Customer orders from QR or walk-in
  orders: defineTable({
    orderNumber: v.string(), // e.g., "ORD-001"
    status: orderStatus,
    tableId: v.optional(v.id("tables")),
    items: v.array(
      v.object({
        menuItemId: v.id("menuItems"),
        title: v.string(),
        price: v.number(),
        quantity: v.number(),
        notes: v.optional(v.string()),
      })
    ),
    subtotal: v.number(),
    tax: v.number(),
    total: v.number(),
    customerName: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_status", ["status", "createdAt"])
    .index("by_table", ["tableId", "createdAt"])
    .index("by_created", ["createdAt"])
    .index("by_order_number", ["orderNumber"]),

  // Tables - Restaurant seating
  tables: defineTable({
    name: v.string(), // e.g., "Table 1", "Booth A"
    capacity: v.number(),
    shape: tableShape,
    status: tableStatus,
    position: v.object({
      x: v.number(),
      y: v.number(),
      width: v.number(),
      height: v.number(),
      rotation: v.optional(v.number()),
    }),
    floorId: v.optional(v.id("floorPlans")),
    qrCodeId: v.optional(v.id("qrCodes")),
    isActive: v.boolean(),
  })
    .index("by_floor", ["floorId", "name"])
    .index("by_status", ["status"])
    .index("by_active", ["isActive"]),

  // Reservations - Table bookings & space bookings
  reservations: defineTable({
    reservationType: v.optional(v.union(v.literal("table"), v.literal("space"))), // "table" default for backward compat
    tableId: v.optional(v.id("tables")), // Can assign later
    guestName: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    partySize: v.number(),
    date: v.string(), // "2025-01-21"
    timeSlot: v.string(), // "18:00"
    endTime: v.optional(v.string()), // "20:00"
    eventType: v.optional(v.string()), // For space bookings: "party", "meeting", "dinner", "workshop", "other"
    status: reservationStatus,
    notes: v.optional(v.string()),
    specialRequests: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    confirmedAt: v.optional(v.number()),
  })
    .index("by_date", ["date", "timeSlot"])
    .index("by_table", ["tableId", "date"])
    .index("by_status", ["status", "date"])
    .index("by_phone", ["phone"]),

  // QR Codes - For table ordering and menu access
  qrCodes: defineTable({
    type: qrCodeType,
    tableId: v.optional(v.id("tables")),
    code: v.string(), // Unique short code e.g., "TBL-A1"
    url: v.string(), // Full URL
    isActive: v.boolean(),
    scansCount: v.number(),
    lastScannedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_code", ["code"])
    .index("by_table", ["tableId"])
    .index("by_type", ["type", "isActive"]),

  // Gallery Items - Photo showcase
  galleryItems: defineTable({
    mediaId: v.id("media"),
    category: v.string(), // "food", "interior", "team", "events"
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    isFeatured: v.boolean(),
    sortOrder: v.number(),
    createdAt: v.number(),
  })
    .index("by_category", ["category", "sortOrder"])
    .index("by_featured", ["isFeatured", "sortOrder"])
    .index("by_sort", ["sortOrder"]),

  // Floor Plans - Restaurant layout
  floorPlans: defineTable({
    name: v.string(), // e.g., "Main Floor", "Patio"
    width: v.number(), // Canvas width in pixels
    height: v.number(), // Canvas height in pixels
    backgroundImage: v.optional(v.id("_storage")),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_active", ["isActive"])
    .index("by_name", ["name"]),

  // Admin Users - Staff with admin access
  adminUsers: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    name: v.string(),
    role: adminRole,
    isActive: v.boolean(),
    lastLoginAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role", "isActive"]),

  // Admin Sessions - Login sessions
  adminSessions: defineTable({
    userId: v.id("adminUsers"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"])
    .index("by_expires", ["expiresAt"]),
});
