import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Generate an upload URL for file upload
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Save uploaded file metadata
export const saveFile = mutation({
  args: {
    storageId: v.id("_storage"),
    filename: v.string(),
    contentType: v.string(),
    alt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("media", {
      storageId: args.storageId,
      filename: args.filename,
      contentType: args.contentType,
      uploadedAt: Date.now(),
      alt: args.alt,
    });
  },
});

// Get all media files
export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("media").withIndex("by_upload");

    const items = await query.order("desc").collect();

    // Get URLs for each file
    const itemsWithUrls = await Promise.all(
      items.slice(0, args.limit ?? 100).map(async (item) => ({
        ...item,
        url: await ctx.storage.getUrl(item.storageId),
      }))
    );

    return itemsWithUrls;
  },
});

// Get a single media file by ID
export const get = query({
  args: { id: v.id("media") },
  handler: async (ctx, args) => {
    const media = await ctx.db.get(args.id);
    if (!media) return null;

    const url = await ctx.storage.getUrl(media.storageId);
    return { ...media, url };
  },
});

// Get URL for a storage ID
export const getUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Delete a media file
export const remove = mutation({
  args: { id: v.id("media") },
  handler: async (ctx, args) => {
    const media = await ctx.db.get(args.id);
    if (media) {
      await ctx.storage.delete(media.storageId);
      return await ctx.db.delete(args.id);
    }
  },
});

// Update media metadata
export const update = mutation({
  args: {
    id: v.id("media"),
    filename: v.optional(v.string()),
    alt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    return await ctx.db.patch(id, cleanUpdates);
  },
});
