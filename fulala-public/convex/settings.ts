import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get a single setting by key
export const get = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const setting = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
    return setting?.value ?? null;
  },
});

// Get all settings
export const list = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("siteSettings").collect();
    return Object.fromEntries(settings.map((s) => [s.key, s.value]));
  },
});

// Set a setting (upsert)
export const set = mutation({
  args: {
    key: v.string(),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        value: args.value,
        updatedAt: Date.now(),
      });
    } else {
      return await ctx.db.insert("siteSettings", {
        key: args.key,
        value: args.value,
        updatedAt: Date.now(),
      });
    }
  },
});

// Delete a setting
export const remove = mutation({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const setting = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
    if (setting) {
      return await ctx.db.delete(setting._id);
    }
  },
});

// Batch update settings
export const batchSet = mutation({
  args: {
    settings: v.array(
      v.object({
        key: v.string(),
        value: v.any(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const { key, value } of args.settings) {
      const existing = await ctx.db
        .query("siteSettings")
        .withIndex("by_key", (q) => q.eq("key", key))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          value,
          updatedAt: Date.now(),
        });
      } else {
        await ctx.db.insert("siteSettings", {
          key,
          value,
          updatedAt: Date.now(),
        });
      }
    }
  },
});
