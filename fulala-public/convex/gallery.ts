import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// List gallery items
export const list = query({
  args: {
    category: v.optional(v.string()),
    featuredOnly: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("galleryItems");

    if (args.featuredOnly) {
      query = query.withIndex("by_featured", (q) => q.eq("isFeatured", true));
    } else if (args.category) {
      query = query.withIndex("by_category", (q) =>
        q.eq("category", args.category!)
      );
    } else {
      query = query.withIndex("by_sort");
    }

    let items = await query.collect();

    // Enrich with media data
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const media = await ctx.db.get(item.mediaId);
        let url = null;
        if (media) {
          url = await ctx.storage.getUrl(media.storageId);
        }
        return {
          ...item,
          media,
          url,
        };
      })
    );

    return args.limit ? enrichedItems.slice(0, args.limit) : enrichedItems;
  },
});

// Get single gallery item
export const get = query({
  args: { id: v.id("galleryItems") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) return null;

    const media = await ctx.db.get(item.mediaId);
    let url = null;
    if (media) {
      url = await ctx.storage.getUrl(media.storageId);
    }

    return { ...item, media, url };
  },
});

// Get gallery categories with counts
export const getCategories = query({
  handler: async (ctx) => {
    const items = await ctx.db.query("galleryItems").collect();

    const categoryCounts: Record<string, number> = {};
    items.forEach((item) => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });

    return Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count,
    }));
  },
});

// Create gallery item
export const create = mutation({
  args: {
    mediaId: v.id("media"),
    category: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    isFeatured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Get max sort order
    const items = await ctx.db.query("galleryItems").withIndex("by_sort").collect();
    const maxSort = items.length > 0 ? Math.max(...items.map((i) => i.sortOrder)) : 0;

    return await ctx.db.insert("galleryItems", {
      mediaId: args.mediaId,
      category: args.category,
      title: args.title,
      description: args.description,
      isFeatured: args.isFeatured ?? false,
      sortOrder: maxSort + 1,
      createdAt: Date.now(),
    });
  },
});

// Update gallery item
export const update = mutation({
  args: {
    id: v.id("galleryItems"),
    category: v.optional(v.string()),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    isFeatured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filteredUpdates);
  },
});

// Toggle featured status
export const toggleFeatured = mutation({
  args: { id: v.id("galleryItems") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) throw new Error("Gallery item not found");

    await ctx.db.patch(args.id, { isFeatured: !item.isFeatured });
  },
});

// Reorder gallery items
export const reorder = mutation({
  args: {
    items: v.array(
      v.object({
        id: v.id("galleryItems"),
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

// Delete gallery item
export const remove = mutation({
  args: { id: v.id("galleryItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Bulk create gallery items from media
export const bulkCreate = mutation({
  args: {
    mediaIds: v.array(v.id("media")),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const items = await ctx.db.query("galleryItems").withIndex("by_sort").collect();
    let sortOrder = items.length > 0 ? Math.max(...items.map((i) => i.sortOrder)) : 0;

    const created = [];
    for (const mediaId of args.mediaIds) {
      sortOrder += 1;
      const id = await ctx.db.insert("galleryItems", {
        mediaId,
        category: args.category,
        isFeatured: false,
        sortOrder,
        createdAt: Date.now(),
      });
      created.push(id);
    }

    return created;
  },
});

// Get gallery stats
export const getStats = query({
  handler: async (ctx) => {
    const items = await ctx.db.query("galleryItems").collect();

    return {
      total: items.length,
      featured: items.filter((i) => i.isFeatured).length,
      byCategory: items.reduce(
        (acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
    };
  },
});
