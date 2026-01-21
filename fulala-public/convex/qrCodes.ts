import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Generate unique code
function generateCode(type: string, tableId?: string): string {
  const prefix = type === "table_order" ? "TBL" : type === "menu_view" ? "MNU" : "RSV";
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${random}`;
}

// List all QR codes
export const list = query({
  args: {
    type: v.optional(
      v.union(
        v.literal("table_order"),
        v.literal("menu_view"),
        v.literal("reservation")
      )
    ),
    activeOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const codes = args.type
      ? await ctx.db
          .query("qrCodes")
          .withIndex("by_type", (q) =>
            q.eq("type", args.type!).eq("isActive", args.activeOnly ?? true)
          )
          .collect()
      : await ctx.db.query("qrCodes").collect();

    // Enrich with table data for table_order codes
    const enrichedCodes = await Promise.all(
      codes.map(async (code) => {
        if (code.tableId) {
          const table = await ctx.db.get(code.tableId);
          return { ...code, table };
        }
        return code;
      })
    );

    return enrichedCodes;
  },
});

// Get single QR code
export const get = query({
  args: { id: v.id("qrCodes") },
  handler: async (ctx, args) => {
    const code = await ctx.db.get(args.id);
    if (!code) return null;

    let table = null;
    if (code.tableId) {
      table = await ctx.db.get(code.tableId);
    }

    return { ...code, table };
  },
});

// Get QR code by code string
export const getByCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const qrCode = await ctx.db
      .query("qrCodes")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .first();

    if (!qrCode) return null;

    let table = null;
    if (qrCode.tableId) {
      table = await ctx.db.get(qrCode.tableId);
    }

    return { ...qrCode, table };
  },
});

// Get QR code for a table
export const getByTable = query({
  args: { tableId: v.id("tables") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("qrCodes")
      .withIndex("by_table", (q) => q.eq("tableId", args.tableId))
      .first();
  },
});

// Create QR code
export const create = mutation({
  args: {
    type: v.union(
      v.literal("table_order"),
      v.literal("menu_view"),
      v.literal("reservation")
    ),
    tableId: v.optional(v.id("tables")),
    baseUrl: v.string(), // e.g., "https://fulala.cz"
  },
  handler: async (ctx, args) => {
    const code = generateCode(args.type, args.tableId?.toString());

    // Build URL based on type
    let urlPath = "";
    if (args.type === "table_order") {
      urlPath = `/order/${code}`;
    } else if (args.type === "menu_view") {
      urlPath = `/menu?qr=${code}`;
    } else {
      urlPath = `/reservations?qr=${code}`;
    }

    const url = `${args.baseUrl}${urlPath}`;

    const qrId = await ctx.db.insert("qrCodes", {
      type: args.type,
      tableId: args.tableId,
      code,
      url,
      isActive: true,
      scansCount: 0,
      createdAt: Date.now(),
    });

    // Link QR code to table if applicable
    if (args.tableId) {
      await ctx.db.patch(args.tableId, { qrCodeId: qrId });
    }

    return qrId;
  },
});

// Generate QR codes for all tables without one
export const generateForAllTables = mutation({
  args: { baseUrl: v.string() },
  handler: async (ctx, args) => {
    const tables = await ctx.db
      .query("tables")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    const created = [];

    for (const table of tables) {
      // Check if table already has a QR code
      const existing = await ctx.db
        .query("qrCodes")
        .withIndex("by_table", (q) => q.eq("tableId", table._id))
        .first();

      if (!existing) {
        const code = generateCode("table_order", table._id.toString());
        const url = `${args.baseUrl}/order/${code}`;

        const qrId = await ctx.db.insert("qrCodes", {
          type: "table_order",
          tableId: table._id,
          code,
          url,
          isActive: true,
          scansCount: 0,
          createdAt: Date.now(),
        });

        await ctx.db.patch(table._id, { qrCodeId: qrId });
        created.push({ tableId: table._id, qrId, code });
      }
    }

    return created;
  },
});

// Record QR code scan
export const recordScan = mutation({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const qrCode = await ctx.db
      .query("qrCodes")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .first();

    if (!qrCode) {
      throw new Error("Invalid QR code");
    }

    if (!qrCode.isActive) {
      throw new Error("QR code is inactive");
    }

    await ctx.db.patch(qrCode._id, {
      scansCount: qrCode.scansCount + 1,
      lastScannedAt: Date.now(),
    });

    return qrCode;
  },
});

// Toggle QR code active status
export const toggleActive = mutation({
  args: { id: v.id("qrCodes") },
  handler: async (ctx, args) => {
    const qrCode = await ctx.db.get(args.id);
    if (!qrCode) throw new Error("QR code not found");

    await ctx.db.patch(args.id, { isActive: !qrCode.isActive });
  },
});

// Regenerate QR code (new code, same ID)
export const regenerate = mutation({
  args: { id: v.id("qrCodes") },
  handler: async (ctx, args) => {
    const qrCode = await ctx.db.get(args.id);
    if (!qrCode) throw new Error("QR code not found");

    const newCode = generateCode(qrCode.type, qrCode.tableId?.toString());
    const newUrl = qrCode.url.replace(qrCode.code, newCode);

    await ctx.db.patch(args.id, {
      code: newCode,
      url: newUrl,
      scansCount: 0,
      lastScannedAt: undefined,
    });

    return newCode;
  },
});

// Delete QR code
export const remove = mutation({
  args: { id: v.id("qrCodes") },
  handler: async (ctx, args) => {
    const qrCode = await ctx.db.get(args.id);
    if (!qrCode) throw new Error("QR code not found");

    // Unlink from table
    if (qrCode.tableId) {
      await ctx.db.patch(qrCode.tableId, { qrCodeId: undefined });
    }

    await ctx.db.delete(args.id);
  },
});

// Get QR code stats
export const getStats = query({
  handler: async (ctx) => {
    const codes = await ctx.db.query("qrCodes").collect();

    const totalScans = codes.reduce((sum, c) => sum + c.scansCount, 0);
    const activeCodes = codes.filter((c) => c.isActive);

    return {
      total: codes.length,
      active: activeCodes.length,
      inactive: codes.length - activeCodes.length,
      totalScans,
      tableOrderCodes: codes.filter((c) => c.type === "table_order").length,
      menuViewCodes: codes.filter((c) => c.type === "menu_view").length,
      reservationCodes: codes.filter((c) => c.type === "reservation").length,
    };
  },
});
