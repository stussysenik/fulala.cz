import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// List all floor plans
export const list = query({
  args: {
    activeOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const floorPlans = args.activeOnly
      ? await ctx.db
          .query("floorPlans")
          .withIndex("by_active", (q) => q.eq("isActive", true))
          .collect()
      : await ctx.db.query("floorPlans").collect();

    // Get table counts for each floor
    const enriched = await Promise.all(
      floorPlans.map(async (fp) => {
        const tables = await ctx.db
          .query("tables")
          .withIndex("by_floor", (q) => q.eq("floorId", fp._id))
          .collect();

        let backgroundUrl = null;
        if (fp.backgroundImage) {
          backgroundUrl = await ctx.storage.getUrl(fp.backgroundImage);
        }

        return {
          ...fp,
          tableCount: tables.length,
          backgroundUrl,
        };
      })
    );

    return enriched;
  },
});

// Get single floor plan with tables
export const get = query({
  args: { id: v.id("floorPlans") },
  handler: async (ctx, args) => {
    const floorPlan = await ctx.db.get(args.id);
    if (!floorPlan) return null;

    const tables = await ctx.db
      .query("tables")
      .withIndex("by_floor", (q) => q.eq("floorId", args.id))
      .collect();

    let backgroundUrl = null;
    if (floorPlan.backgroundImage) {
      backgroundUrl = await ctx.storage.getUrl(floorPlan.backgroundImage);
    }

    return {
      ...floorPlan,
      tables,
      backgroundUrl,
    };
  },
});

// Get active floor plan
export const getActive = query({
  handler: async (ctx) => {
    const floorPlan = await ctx.db
      .query("floorPlans")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .first();

    if (!floorPlan) return null;

    const tables = await ctx.db
      .query("tables")
      .withIndex("by_floor", (q) => q.eq("floorId", floorPlan._id))
      .collect();

    // Get current orders for occupied tables
    const tablesWithOrders = await Promise.all(
      tables.map(async (table) => {
        if (table.status === "occupied") {
          const order = await ctx.db
            .query("orders")
            .withIndex("by_table", (q) => q.eq("tableId", table._id))
            .filter((q) =>
              q.and(
                q.neq(q.field("status"), "completed"),
                q.neq(q.field("status"), "cancelled")
              )
            )
            .first();
          return { ...table, currentOrder: order };
        }
        return { ...table, currentOrder: null };
      })
    );

    let backgroundUrl = null;
    if (floorPlan.backgroundImage) {
      backgroundUrl = await ctx.storage.getUrl(floorPlan.backgroundImage);
    }

    return {
      ...floorPlan,
      tables: tablesWithOrders,
      backgroundUrl,
    };
  },
});

// Create floor plan
export const create = mutation({
  args: {
    name: v.string(),
    width: v.number(),
    height: v.number(),
    backgroundImage: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("floorPlans", {
      name: args.name,
      width: args.width,
      height: args.height,
      backgroundImage: args.backgroundImage,
      isActive: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update floor plan
export const update = mutation({
  args: {
    id: v.id("floorPlans"),
    name: v.optional(v.string()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    backgroundImage: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    await ctx.db.patch(id, {
      ...filteredUpdates,
      updatedAt: Date.now(),
    });
  },
});

// Set active floor plan
export const setActive = mutation({
  args: { id: v.id("floorPlans") },
  handler: async (ctx, args) => {
    // Deactivate all other floor plans
    const allPlans = await ctx.db.query("floorPlans").collect();
    for (const plan of allPlans) {
      if (plan._id !== args.id && plan.isActive) {
        await ctx.db.patch(plan._id, { isActive: false });
      }
    }

    // Activate the selected one
    await ctx.db.patch(args.id, {
      isActive: true,
      updatedAt: Date.now(),
    });
  },
});

// Delete floor plan
export const remove = mutation({
  args: { id: v.id("floorPlans") },
  handler: async (ctx, args) => {
    // Check for tables on this floor
    const tables = await ctx.db
      .query("tables")
      .withIndex("by_floor", (q) => q.eq("floorId", args.id))
      .collect();

    if (tables.length > 0) {
      throw new Error(
        `Cannot delete floor plan with ${tables.length} tables. Remove tables first.`
      );
    }

    await ctx.db.delete(args.id);
  },
});

// Upload background image
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Set background image after upload
export const setBackgroundImage = mutation({
  args: {
    id: v.id("floorPlans"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      backgroundImage: args.storageId,
      updatedAt: Date.now(),
    });
  },
});

// Remove background image
export const removeBackgroundImage = mutation({
  args: { id: v.id("floorPlans") },
  handler: async (ctx, args) => {
    const floorPlan = await ctx.db.get(args.id);
    if (floorPlan?.backgroundImage) {
      await ctx.storage.delete(floorPlan.backgroundImage);
    }

    await ctx.db.patch(args.id, {
      backgroundImage: undefined,
      updatedAt: Date.now(),
    });
  },
});

// Duplicate floor plan
export const duplicate = mutation({
  args: { id: v.id("floorPlans") },
  handler: async (ctx, args) => {
    const original = await ctx.db.get(args.id);
    if (!original) throw new Error("Floor plan not found");

    const now = Date.now();

    // Create new floor plan
    const newFloorId = await ctx.db.insert("floorPlans", {
      name: `${original.name} (Copy)`,
      width: original.width,
      height: original.height,
      backgroundImage: original.backgroundImage,
      isActive: false,
      createdAt: now,
      updatedAt: now,
    });

    // Copy all tables
    const tables = await ctx.db
      .query("tables")
      .withIndex("by_floor", (q) => q.eq("floorId", args.id))
      .collect();

    for (const table of tables) {
      await ctx.db.insert("tables", {
        name: table.name,
        capacity: table.capacity,
        shape: table.shape,
        status: "available",
        position: table.position,
        floorId: newFloorId,
        isActive: table.isActive,
      });
    }

    return newFloorId;
  },
});
