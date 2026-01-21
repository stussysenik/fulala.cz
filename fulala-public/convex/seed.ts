import { mutation } from "./_generated/server";

// Seed data migration from existing Menu.js
export const seedMenu = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if we already have menu items
    const existingItems = await ctx.db.query("menuItems").collect();
    if (existingItems.length > 0) {
      return { message: "Data already seeded", count: existingItems.length };
    }

    // Create default categories
    const categories = [
      { name: "Dumplings", slug: "dumplings", sortOrder: 0, description: "Steamed and fried dumplings" },
      { name: "Buns", slug: "buns", sortOrder: 1, description: "Golden crispy buns" },
      { name: "Noodles", slug: "noodles", sortOrder: 2, description: "Hand-pulled noodles" },
      { name: "Sides", slug: "sides", sortOrder: 3, description: "Fresh sides and salads" },
    ];

    for (const category of categories) {
      await ctx.db.insert("categories", category);
    }

    // Migrate menu items from existing Menu.js
    const menuItems = [
      {
        title: "Fulala Classic",
        description: "Pork & chive dumplings, steamed to perfection.",
        price: 185,
        priceDisplay: "185 Kč",
        category: "dumplings",
        isAvailable: true,
        sortOrder: 0,
      },
      {
        title: "Tiger Heat",
        description: "Spicy Szechuan beef dumplings with chili oil.",
        price: 195,
        priceDisplay: "195 Kč",
        category: "dumplings",
        isAvailable: true,
        sortOrder: 1,
      },
      {
        title: "Zen Garden",
        description: "Mushroom & tofu mix, light and earthy.",
        price: 175,
        priceDisplay: "175 Kč",
        category: "dumplings",
        isAvailable: true,
        sortOrder: 2,
      },
      {
        title: "Golden Buns",
        description: "Crispy fried veggie buns.",
        price: 145,
        priceDisplay: "145 Kč",
        category: "buns",
        isAvailable: true,
        sortOrder: 0,
      },
      {
        title: "Lucky Noodles",
        description: "Hand-pulled noodles with peanut sauce.",
        price: 210,
        priceDisplay: "210 Kč",
        category: "noodles",
        isAvailable: true,
        sortOrder: 0,
      },
      {
        title: "Cucumber Slaw",
        description: "Garlic, sesame oil, chili flakes.",
        price: 85,
        priceDisplay: "85 Kč",
        category: "sides",
        isAvailable: true,
        sortOrder: 0,
      },
    ];

    for (const item of menuItems) {
      await ctx.db.insert("menuItems", item);
    }

    // Seed default site settings
    const settings = [
      { key: "siteName", value: "Fulala", updatedAt: Date.now() },
      { key: "tagline", value: "Old School New Soul", updatedAt: Date.now() },
      { key: "description", value: "Comfort Chinese dishes in Prague", updatedAt: Date.now() },
      { key: "address", value: "Prague, Czech Republic", updatedAt: Date.now() },
      { key: "phone", value: "+420 XXX XXX XXX", updatedAt: Date.now() },
      { key: "email", value: "hello@fulala.cz", updatedAt: Date.now() },
      { key: "openingHours", value: "Tue-Sun: 11:00 - 21:00", updatedAt: Date.now() },
    ];

    for (const setting of settings) {
      await ctx.db.insert("siteSettings", setting);
    }

    // Seed story content
    const storyContent = [
      {
        section: "intro",
        title: "Old School New Soul",
        content: "At Fulala, we believe in the magic of handmade dumplings. Each one is crafted with love, following recipes passed down through generations.",
        sortOrder: 0,
      },
      {
        section: "origin",
        title: "Born in Prague",
        content: "Our journey began in the heart of Prague, where we set out to bring authentic Chinese comfort food to the Czech Republic. Our tiger mascot represents the bold, playful spirit of our kitchen.",
        sortOrder: 0,
      },
      {
        section: "values",
        title: "Rituals of Joy",
        content: "We believe eating should be a joyful ritual. Fresh ingredients, traditional techniques, and a whole lot of heart go into every dish we serve.",
        sortOrder: 0,
      },
    ];

    for (const story of storyContent) {
      await ctx.db.insert("storyContent", story);
    }

    return {
      message: "Seed data created successfully",
      categories: categories.length,
      menuItems: menuItems.length,
      settings: settings.length,
      storyContent: storyContent.length,
    };
  },
});
