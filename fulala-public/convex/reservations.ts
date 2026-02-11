import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// List reservations with filters
export const list = query({
  args: {
    date: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("confirmed"),
        v.literal("seated"),
        v.literal("completed"),
        v.literal("cancelled"),
        v.literal("no_show")
      )
    ),
    tableId: v.optional(v.id("tables")),
  },
  handler: async (ctx, args) => {
    if (args.date) {
      return await ctx.db
        .query("reservations")
        .withIndex("by_date", (q) => q.eq("date", args.date!))
        .collect();
    } else if (args.status) {
      return await ctx.db
        .query("reservations")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    } else if (args.tableId) {
      return await ctx.db
        .query("reservations")
        .withIndex("by_table", (q) => q.eq("tableId", args.tableId!))
        .collect();
    }

    return await ctx.db.query("reservations").collect();
  },
});

// Get single reservation
export const get = query({
  args: { id: v.id("reservations") },
  handler: async (ctx, args) => {
    const reservation = await ctx.db.get(args.id);
    if (!reservation) return null;

    // Get table info if assigned
    let table = null;
    if (reservation.tableId) {
      table = await ctx.db.get(reservation.tableId);
    }

    return { ...reservation, table };
  },
});

// Get reservations by phone (for customer lookup)
export const getByPhone = query({
  args: { phone: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reservations")
      .withIndex("by_phone", (q) => q.eq("phone", args.phone))
      .collect();
  },
});

// Get upcoming reservations for a date range
export const getUpcoming = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const reservations = await ctx.db.query("reservations").collect();
    return reservations.filter(
      (r) =>
        r.date >= args.startDate &&
        r.date <= args.endDate &&
        !["cancelled", "no_show", "completed"].includes(r.status)
    );
  },
});

// Create new reservation
export const create = mutation({
  args: {
    reservationType: v.optional(v.union(v.literal("table"), v.literal("space"))),
    guestName: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    partySize: v.number(),
    date: v.string(),
    timeSlot: v.string(),
    endTime: v.optional(v.string()),
    eventType: v.optional(v.string()),
    notes: v.optional(v.string()),
    specialRequests: v.optional(v.string()),
    tableId: v.optional(v.id("tables")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const type = args.reservationType || "table";

    // For space bookings, check for conflicting space reservations
    if (type === "space") {
      const existing = await ctx.db
        .query("reservations")
        .withIndex("by_date", (q) => q.eq("date", args.date))
        .filter((q) =>
          q.and(
            q.eq(q.field("reservationType"), "space"),
            q.neq(q.field("status"), "cancelled"),
            q.neq(q.field("status"), "no_show")
          )
        )
        .collect();

      // Check for time overlap
      for (const r of existing) {
        const existingStart = r.timeSlot;
        const existingEnd = r.endTime || r.timeSlot;
        const newStart = args.timeSlot;
        const newEnd = args.endTime || args.timeSlot;
        if (newStart < existingEnd && newEnd > existingStart) {
          throw new Error("The downstairs space is already booked for this time period");
        }
      }
    }

    // For table bookings, check table conflicts
    if (type === "table" && args.tableId) {
      const existing = await ctx.db
        .query("reservations")
        .withIndex("by_table", (q) => q.eq("tableId", args.tableId!))
        .filter((q) =>
          q.and(
            q.eq(q.field("date"), args.date),
            q.eq(q.field("timeSlot"), args.timeSlot),
            q.neq(q.field("status"), "cancelled"),
            q.neq(q.field("status"), "no_show")
          )
        )
        .first();

      if (existing) {
        throw new Error("Table already reserved for this time slot");
      }
    }

    return await ctx.db.insert("reservations", {
      reservationType: type,
      guestName: args.guestName,
      phone: args.phone,
      email: args.email,
      partySize: args.partySize,
      date: args.date,
      timeSlot: args.timeSlot,
      endTime: args.endTime,
      eventType: args.eventType,
      notes: args.notes,
      specialRequests: args.specialRequests,
      tableId: args.tableId,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update reservation
export const update = mutation({
  args: {
    id: v.id("reservations"),
    guestName: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    partySize: v.optional(v.number()),
    date: v.optional(v.string()),
    timeSlot: v.optional(v.string()),
    endTime: v.optional(v.string()),
    notes: v.optional(v.string()),
    specialRequests: v.optional(v.string()),
    tableId: v.optional(v.id("tables")),
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

// Update reservation status
export const updateStatus = mutation({
  args: {
    id: v.id("reservations"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("seated"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("no_show")
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const updates: {
      status: typeof args.status;
      updatedAt: number;
      confirmedAt?: number;
    } = {
      status: args.status,
      updatedAt: now,
    };

    if (args.status === "confirmed") {
      updates.confirmedAt = now;
    }

    // Update table status when seated
    if (args.status === "seated") {
      const reservation = await ctx.db.get(args.id);
      if (reservation?.tableId) {
        await ctx.db.patch(reservation.tableId, { status: "occupied" });
      }
    }

    // Free table when completed
    if (args.status === "completed" || args.status === "no_show") {
      const reservation = await ctx.db.get(args.id);
      if (reservation?.tableId) {
        await ctx.db.patch(reservation.tableId, { status: "cleaning" });
      }
    }

    await ctx.db.patch(args.id, updates);
  },
});

// Assign table to reservation
export const assignTable = mutation({
  args: {
    id: v.id("reservations"),
    tableId: v.id("tables"),
  },
  handler: async (ctx, args) => {
    const reservation = await ctx.db.get(args.id);
    if (!reservation) throw new Error("Reservation not found");

    // Check table availability
    const conflicting = await ctx.db
      .query("reservations")
      .withIndex("by_table", (q) => q.eq("tableId", args.tableId))
      .filter((q) =>
        q.and(
          q.eq(q.field("date"), reservation.date),
          q.eq(q.field("timeSlot"), reservation.timeSlot),
          q.neq(q.field("status"), "cancelled"),
          q.neq(q.field("status"), "no_show"),
          q.neq(q.field("_id"), args.id)
        )
      )
      .first();

    if (conflicting) {
      throw new Error("Table already reserved for this time slot");
    }

    await ctx.db.patch(args.id, {
      tableId: args.tableId,
      updatedAt: Date.now(),
    });

    // Mark table as reserved
    await ctx.db.patch(args.tableId, { status: "reserved" });
  },
});

// Cancel reservation
export const cancel = mutation({
  args: { id: v.id("reservations") },
  handler: async (ctx, args) => {
    const reservation = await ctx.db.get(args.id);
    if (!reservation) throw new Error("Reservation not found");

    // Free up the table if assigned
    if (reservation.tableId) {
      const table = await ctx.db.get(reservation.tableId);
      if (table && table.status === "reserved") {
        await ctx.db.patch(reservation.tableId, { status: "available" });
      }
    }

    await ctx.db.patch(args.id, {
      status: "cancelled",
      updatedAt: Date.now(),
    });
  },
});

// Get available time slots for a date
export const getAvailableSlots = query({
  args: {
    date: v.string(),
    partySize: v.number(),
  },
  handler: async (ctx, args) => {
    // Define operating hours
    const timeSlots = [
      "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
      "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
      "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
      "20:00", "20:30", "21:00", "21:30",
    ];

    // Get reservations for this date
    const reservations = await ctx.db
      .query("reservations")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .filter((q) =>
        q.and(
          q.neq(q.field("status"), "cancelled"),
          q.neq(q.field("status"), "no_show")
        )
      )
      .collect();

    // Get tables that can accommodate party size
    const tables = await ctx.db
      .query("tables")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .filter((q) => q.gte(q.field("capacity"), args.partySize))
      .collect();

    // Calculate available slots
    return timeSlots.map((slot) => {
      const reservedTableIds = reservations
        .filter((r) => r.timeSlot === slot && r.tableId)
        .map((r) => r.tableId);

      const availableTables = tables.filter(
        (t) => !reservedTableIds.includes(t._id)
      );

      return {
        time: slot,
        available: availableTables.length > 0,
        tablesAvailable: availableTables.length,
      };
    });
  },
});

// Get space availability for a date
export const getSpaceAvailability = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const timeBlocks = [
      { id: "morning", label: "11:00 – 15:00", start: "11:00", end: "15:00" },
      { id: "afternoon", label: "15:00 – 18:00", start: "15:00", end: "18:00" },
      { id: "evening", label: "18:00 – 22:00", start: "18:00", end: "22:00" },
      { id: "full_day", label: "11:00 – 22:00", start: "11:00", end: "22:00" },
    ];

    const spaceReservations = await ctx.db
      .query("reservations")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .filter((q) =>
        q.and(
          q.eq(q.field("reservationType"), "space"),
          q.neq(q.field("status"), "cancelled"),
          q.neq(q.field("status"), "no_show")
        )
      )
      .collect();

    return timeBlocks.map((block) => {
      const isBooked = spaceReservations.some((r) => {
        const rEnd = r.endTime || r.timeSlot;
        return r.timeSlot < block.end && rEnd > block.start;
      });
      return { ...block, available: !isBooked };
    });
  },
});

// Get reservation stats
export const getStats = query({
  args: { date: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const today = args.date || new Date().toISOString().split("T")[0];

    const reservations = await ctx.db
      .query("reservations")
      .withIndex("by_date", (q) => q.eq("date", today))
      .collect();

    return {
      total: reservations.length,
      pending: reservations.filter((r) => r.status === "pending").length,
      confirmed: reservations.filter((r) => r.status === "confirmed").length,
      seated: reservations.filter((r) => r.status === "seated").length,
      completed: reservations.filter((r) => r.status === "completed").length,
      cancelled: reservations.filter((r) => r.status === "cancelled").length,
      noShow: reservations.filter((r) => r.status === "no_show").length,
      totalGuests: reservations
        .filter((r) => !["cancelled", "no_show"].includes(r.status))
        .reduce((sum, r) => sum + r.partySize, 0),
    };
  },
});
