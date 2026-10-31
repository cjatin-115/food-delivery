import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

// ---------- Restaurants ----------
export const restaurants = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  cuisine: text("cuisine").notNull(),
  tagline: text("tagline"),
  emoji: text("emoji").notNull().default("🍽️"),
  image: text("image"),
  rating: integer("rating").notNull().default(45), // 45 => 4.5
  ratingCount: integer("rating_count").notNull().default(0),
  deliveryMinutes: integer("delivery_minutes").notNull().default(30),
  priceForTwo: integer("price_for_two").notNull().default(300), // in rupees
  gradientFrom: text("gradient_from").notNull().default("#FFE9D6"),
  gradientTo: text("gradient_to").notNull().default("#FFD3B6"),
  isOpen: boolean("is_open").notNull().default(true),
});

// ---------- Menu items ----------
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id")
    .notNull()
    .references(() => restaurants.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // in paise (100 paise = ₹1)
  category: text("category").notNull().default("Mains"),
  emoji: text("emoji").notNull().default("🍴"),
  isVeg: boolean("is_veg").notNull().default(true),
  isBestseller: boolean("is_bestseller").notNull().default(false),
});

// ---------- Orders ----------
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  note: text("note"),
  restaurantId: integer("restaurant_id").notNull(),
  restaurantName: text("restaurant_name").notNull(),
  restaurantEmoji: text("restaurant_emoji").notNull().default("🍽️"),
  items: jsonb("items").notNull(), // [{ id, name, emoji, price, qty }]
  subtotal: integer("subtotal").notNull(), // paise
  deliveryFee: integer("delivery_fee").notNull().default(0), // paise
  total: integer("total").notNull(), // paise
  status: text("status").notNull().default("placed"), // placed -> confirmed -> preparing -> on_the_way -> delivered
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Restaurant = typeof restaurants.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
