import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Generate order number
function generateOrderNumber(): string {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD-${day}${random}`;
}

// List all orders with optional filters
export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("confirmed"),
        v.literal("preparing"),
        v.literal("ready"),
        v.literal("served"),
        v.literal("completed"),
        v.literal("cancelled")
      )
    ),
    tableId: v.optional(v.id("tables")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let orders;

    if (args.status) {
      orders = await ctx.db
        .query("orders")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    } else if (args.tableId) {
      orders = await ctx.db
        .query("orders")
        .withIndex("by_table", (q) => q.eq("tableId", args.tableId!))
        .order("desc")
        .collect();
    } else {
      orders = await ctx.db
        .query("orders")
        .withIndex("by_created")
        .order("desc")
        .collect();
    }

    return args.limit ? orders.slice(0, args.limit) : orders;
  },
});

// Get single order by ID
export const get = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get order by order number
export const getByOrderNumber = query({
  args: { orderNumber: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_order_number", (q) => q.eq("orderNumber", args.orderNumber))
      .first();
  },
});

// Get active orders (not completed/cancelled)
export const listActive = query({
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").withIndex("by_created").order("desc").collect();
    return orders.filter(
      (o) => !["completed", "cancelled"].includes(o.status)
    );
  },
});

// Create new order
export const create = mutation({
  args: {
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
    customerName: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const subtotal = args.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = Math.round(subtotal * 0.21 * 100) / 100; // 21% VAT
    const total = subtotal + tax;

    const now = Date.now();

    const orderId = await ctx.db.insert("orders", {
      orderNumber: generateOrderNumber(),
      status: "pending",
      tableId: args.tableId,
      items: args.items,
      subtotal,
      tax,
      total,
      customerName: args.customerName,
      customerPhone: args.customerPhone,
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });

    // Update table status if assigned
    if (args.tableId) {
      await ctx.db.patch(args.tableId, { status: "occupied" });
    }

    return orderId;
  },
});

// Update order status
export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("preparing"),
      v.literal("ready"),
      v.literal("served"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const updates: {
      status: typeof args.status;
      updatedAt: number;
      completedAt?: number;
    } = {
      status: args.status,
      updatedAt: now,
    };

    if (args.status === "completed" || args.status === "cancelled") {
      updates.completedAt = now;

      // Free up the table
      const order = await ctx.db.get(args.id);
      if (order?.tableId) {
        await ctx.db.patch(order.tableId, { status: "cleaning" });
      }
    }

    await ctx.db.patch(args.id, updates);
  },
});

// Add item to existing order
export const addItem = mutation({
  args: {
    orderId: v.id("orders"),
    item: v.object({
      menuItemId: v.id("menuItems"),
      title: v.string(),
      price: v.number(),
      quantity: v.number(),
      notes: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    const newItems = [...order.items, args.item];
    const subtotal = newItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = Math.round(subtotal * 0.21 * 100) / 100;
    const total = subtotal + tax;

    await ctx.db.patch(args.orderId, {
      items: newItems,
      subtotal,
      tax,
      total,
      updatedAt: Date.now(),
    });
  },
});

// Remove item from order
export const removeItem = mutation({
  args: {
    orderId: v.id("orders"),
    itemIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    const newItems = order.items.filter((_, i) => i !== args.itemIndex);
    const subtotal = newItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = Math.round(subtotal * 0.21 * 100) / 100;
    const total = subtotal + tax;

    await ctx.db.patch(args.orderId, {
      items: newItems,
      subtotal,
      tax,
      total,
      updatedAt: Date.now(),
    });
  },
});

// Get orders stats for dashboard
export const getStats = query({
  handler: async (ctx) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();

    const allOrders = await ctx.db.query("orders").collect();

    const todayOrders = allOrders.filter((o) => o.createdAt >= todayStart);
    const activeOrders = allOrders.filter(
      (o) => !["completed", "cancelled"].includes(o.status)
    );
    const completedToday = todayOrders.filter(
      (o) => o.status === "completed"
    );

    return {
      totalToday: todayOrders.length,
      activeCount: activeOrders.length,
      completedToday: completedToday.length,
      revenueToday: completedToday.reduce((sum, o) => sum + o.total, 0),
      pendingCount: activeOrders.filter((o) => o.status === "pending").length,
      preparingCount: activeOrders.filter((o) => o.status === "preparing").length,
      readyCount: activeOrders.filter((o) => o.status === "ready").length,
    };
  },
});
