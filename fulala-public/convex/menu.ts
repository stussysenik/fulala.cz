import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all menu items, optionally filtered by category
export const list = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.category) {
      return await ctx.db
        .query("menuItems")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .collect();
    }
    return await ctx.db
      .query("menuItems")
      .withIndex("by_sort")
      .collect();
  },
});

// Get a single menu item by ID
export const get = query({
  args: { id: v.id("menuItems") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get menu items grouped by category
export const listByCategory = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query("menuItems")
      .withIndex("by_sort")
      .collect();

    const categories = await ctx.db
      .query("categories")
      .withIndex("by_sort")
      .collect();

    // Group items by category
    const grouped = categories.map((category) => ({
      ...category,
      items: items.filter((item) => item.category === category.slug),
    }));

    return grouped;
  },
});

// Create a new menu item
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    price: v.number(),
    priceDisplay: v.string(),
    category: v.string(),
    image: v.optional(v.id("_storage")),
    isAvailable: v.boolean(),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("menuItems", args);
  },
});

// Update a menu item
export const update = mutation({
  args: {
    id: v.id("menuItems"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    priceDisplay: v.optional(v.string()),
    category: v.optional(v.string()),
    image: v.optional(v.id("_storage")),
    isAvailable: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    // Filter out undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    return await ctx.db.patch(id, cleanUpdates);
  },
});

// Delete a menu item
export const remove = mutation({
  args: { id: v.id("menuItems") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Reorder menu items
export const reorder = mutation({
  args: {
    items: v.array(
      v.object({
        id: v.id("menuItems"),
        sortOrder: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const item of args.items) {
      await ctx.db.patch(item.id, { sortOrder: item.sortOrder });
    }
  },
});
