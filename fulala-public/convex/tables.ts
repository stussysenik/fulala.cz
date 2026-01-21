import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// List all tables
export const list = query({
  args: {
    floorId: v.optional(v.id("floorPlans")),
    status: v.optional(
      v.union(
        v.literal("available"),
        v.literal("occupied"),
        v.literal("reserved"),
        v.literal("cleaning")
      )
    ),
    activeOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("tables");

    if (args.floorId) {
      query = query.withIndex("by_floor", (q) => q.eq("floorId", args.floorId!));
    } else if (args.status) {
      query = query.withIndex("by_status", (q) => q.eq("status", args.status!));
    } else if (args.activeOnly) {
      query = query.withIndex("by_active", (q) => q.eq("isActive", true));
    }

    return await query.collect();
  },
});

// Get single table
export const get = query({
  args: { id: v.id("tables") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get table with current order
export const getWithOrder = query({
  args: { id: v.id("tables") },
  handler: async (ctx, args) => {
    const table = await ctx.db.get(args.id);
    if (!table) return null;

    // Get active order for this table
    const activeOrder = await ctx.db
      .query("orders")
      .withIndex("by_table", (q) => q.eq("tableId", args.id))
      .filter((q) =>
        q.and(
          q.neq(q.field("status"), "completed"),
          q.neq(q.field("status"), "cancelled")
        )
      )
      .first();

    return { ...table, currentOrder: activeOrder };
  },
});

// Create new table
export const create = mutation({
  args: {
    name: v.string(),
    capacity: v.number(),
    shape: v.union(v.literal("round"), v.literal("square"), v.literal("rectangle")),
    position: v.object({
      x: v.number(),
      y: v.number(),
      width: v.number(),
      height: v.number(),
      rotation: v.optional(v.number()),
    }),
    floorId: v.optional(v.id("floorPlans")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tables", {
      name: args.name,
      capacity: args.capacity,
      shape: args.shape,
      status: "available",
      position: args.position,
      floorId: args.floorId,
      isActive: true,
    });
  },
});

// Update table
export const update = mutation({
  args: {
    id: v.id("tables"),
    name: v.optional(v.string()),
    capacity: v.optional(v.number()),
    shape: v.optional(
      v.union(v.literal("round"), v.literal("square"), v.literal("rectangle"))
    ),
    position: v.optional(
      v.object({
        x: v.number(),
        y: v.number(),
        width: v.number(),
        height: v.number(),
        rotation: v.optional(v.number()),
      })
    ),
    floorId: v.optional(v.id("floorPlans")),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filteredUpdates);
  },
});

// Update table status
export const updateStatus = mutation({
  args: {
    id: v.id("tables"),
    status: v.union(
      v.literal("available"),
      v.literal("occupied"),
      v.literal("reserved"),
      v.literal("cleaning")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

// Update table position (for floor plan editor)
export const updatePosition = mutation({
  args: {
    id: v.id("tables"),
    position: v.object({
      x: v.number(),
      y: v.number(),
      width: v.number(),
      height: v.number(),
      rotation: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { position: args.position });
  },
});

// Batch update positions (for floor plan save)
export const batchUpdatePositions = mutation({
  args: {
    updates: v.array(
      v.object({
        id: v.id("tables"),
        position: v.object({
          x: v.number(),
          y: v.number(),
          width: v.number(),
          height: v.number(),
          rotation: v.optional(v.number()),
        }),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const update of args.updates) {
      await ctx.db.patch(update.id, { position: update.position });
    }
  },
});

// Delete table
export const remove = mutation({
  args: { id: v.id("tables") },
  handler: async (ctx, args) => {
    // Check for active orders
    const activeOrder = await ctx.db
      .query("orders")
      .withIndex("by_table", (q) => q.eq("tableId", args.id))
      .filter((q) =>
        q.and(
          q.neq(q.field("status"), "completed"),
          q.neq(q.field("status"), "cancelled")
        )
      )
      .first();

    if (activeOrder) {
      throw new Error("Cannot delete table with active orders");
    }

    await ctx.db.delete(args.id);
  },
});

// Get table stats
export const getStats = query({
  handler: async (ctx) => {
    const tables = await ctx.db
      .query("tables")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    return {
      total: tables.length,
      available: tables.filter((t) => t.status === "available").length,
      occupied: tables.filter((t) => t.status === "occupied").length,
      reserved: tables.filter((t) => t.status === "reserved").length,
      cleaning: tables.filter((t) => t.status === "cleaning").length,
      totalCapacity: tables.reduce((sum, t) => sum + t.capacity, 0),
    };
  },
});
