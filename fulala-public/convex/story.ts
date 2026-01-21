import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all story content sorted by section and order
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("storyContent")
      .withIndex("by_section")
      .collect();
  },
});

// Get story content by section
export const getBySection = query({
  args: { section: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("storyContent")
      .withIndex("by_section", (q) => q.eq("section", args.section))
      .collect();
  },
});

// Get a single story item
export const get = query({
  args: { id: v.id("storyContent") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create story content
export const create = mutation({
  args: {
    section: v.string(),
    title: v.string(),
    content: v.string(),
    image: v.optional(v.id("_storage")),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("storyContent", args);
  },
});

// Update story content
export const update = mutation({
  args: {
    id: v.id("storyContent"),
    section: v.optional(v.string()),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    image: v.optional(v.id("_storage")),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    return await ctx.db.patch(id, cleanUpdates);
  },
});

// Delete story content
export const remove = mutation({
  args: { id: v.id("storyContent") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
