import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Simple hash function for passwords (in production, use bcrypt on server)
// This is a placeholder - real implementation would use proper password hashing
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "fulala_salt_2025");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// Generate session token
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Login
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (!user.isActive) {
      throw new Error("Account is disabled");
    }

    // Verify password
    const isValid = await verifyPassword(args.password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    // Create session
    const token = generateToken();
    const now = Date.now();
    const expiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days

    await ctx.db.insert("adminSessions", {
      userId: user._id,
      token,
      expiresAt,
      createdAt: now,
      userAgent: args.userAgent,
      ipAddress: args.ipAddress,
    });

    // Update last login
    await ctx.db.patch(user._id, { lastLoginAt: now });

    return {
      token,
      expiresAt,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  },
});

// Logout
export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }
  },
});

// Validate session and get user
export const validateSession = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session) {
      return null;
    }

    // Check if expired
    if (session.expiresAt < Date.now()) {
      return null;
    }

    // Get user
    const user = await ctx.db.get(session.userId);
    if (!user || !user.isActive) {
      return null;
    }

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      session: {
        expiresAt: session.expiresAt,
      },
    };
  },
});

// Get current user from session
export const getCurrentUser = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return null;
    }

    const user = await ctx.db.get(session.userId);
    if (!user || !user.isActive) {
      return null;
    }

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  },
});

// Create admin user (for initial setup)
export const createUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    role: v.union(v.literal("owner"), v.literal("manager"), v.literal("staff")),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existing = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (existing) {
      throw new Error("Email already registered");
    }

    const passwordHash = await hashPassword(args.password);
    const now = Date.now();

    return await ctx.db.insert("adminUsers", {
      email: args.email.toLowerCase(),
      passwordHash,
      name: args.name,
      role: args.role,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update user
export const updateUser = mutation({
  args: {
    id: v.id("adminUsers"),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    role: v.optional(
      v.union(v.literal("owner"), v.literal("manager"), v.literal("staff"))
    ),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, email, ...updates } = args;

    // Check email uniqueness if changing
    if (email) {
      const existing = await ctx.db
        .query("adminUsers")
        .withIndex("by_email", (q) => q.eq("email", email.toLowerCase()))
        .first();

      if (existing && existing._id !== id) {
        throw new Error("Email already in use");
      }
    }

    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    await ctx.db.patch(id, {
      ...filteredUpdates,
      ...(email && { email: email.toLowerCase() }),
      updatedAt: Date.now(),
    });
  },
});

// Change password
export const changePassword = mutation({
  args: {
    userId: v.id("adminUsers"),
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isValid = await verifyPassword(args.currentPassword, user.passwordHash);
    if (!isValid) {
      throw new Error("Current password is incorrect");
    }

    const newHash = await hashPassword(args.newPassword);
    await ctx.db.patch(args.userId, {
      passwordHash: newHash,
      updatedAt: Date.now(),
    });

    // Invalidate all sessions except current
    const sessions = await ctx.db
      .query("adminSessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }
  },
});

// List all admin users
export const listUsers = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("adminUsers").collect();
    return users.map((u) => ({
      id: u._id,
      email: u.email,
      name: u.name,
      role: u.role,
      isActive: u.isActive,
      lastLoginAt: u.lastLoginAt,
      createdAt: u.createdAt,
    }));
  },
});

// Delete user
export const deleteUser = mutation({
  args: { id: v.id("adminUsers") },
  handler: async (ctx, args) => {
    // Delete all sessions
    const sessions = await ctx.db
      .query("adminSessions")
      .withIndex("by_user", (q) => q.eq("userId", args.id))
      .collect();

    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }

    await ctx.db.delete(args.id);
  },
});

// Cleanup expired sessions (can be called periodically)
export const cleanupSessions = mutation({
  handler: async (ctx) => {
    const now = Date.now();
    const expired = await ctx.db
      .query("adminSessions")
      .withIndex("by_expires")
      .filter((q) => q.lt(q.field("expiresAt"), now))
      .collect();

    for (const session of expired) {
      await ctx.db.delete(session._id);
    }

    return { deleted: expired.length };
  },
});

// Seed initial admin user (for development)
export const seedAdmin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Only create if no admin users exist
    const existing = await ctx.db.query("adminUsers").first();
    if (existing) {
      return { created: false, message: "Admin user already exists" };
    }

    const passwordHash = await hashPassword(args.password);
    const now = Date.now();

    const userId = await ctx.db.insert("adminUsers", {
      email: args.email.toLowerCase(),
      passwordHash,
      name: args.name,
      role: "owner",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    return { created: true, userId };
  },
});
