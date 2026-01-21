import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all categories sorted by order
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_sort")
      .collect();
  },
});

// Get a single category by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .first();
  },
});

// Create a new category
export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    sortOrder: v.number(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("categories", args);
  },
});

// Update a category
export const update = mutation({
  args: {
    id: v.id("categories"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    return await ctx.db.patch(id, cleanUpdates);
  },
});

// Delete a category
export const remove = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Reorder categories
export const reorder = mutation({
  args: {
    items: v.array(
      v.object({
        id: v.id("categories"),
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
