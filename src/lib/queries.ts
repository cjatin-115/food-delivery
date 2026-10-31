import { db } from "@/db";
import { and, asc, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { menuItems, orders, restaurants } from "@/db/schema";

export type SortOption = "recommended" | "rating" | "delivery" | "priceLow" | "priceHigh";

export async function listRestaurants(options: {
  q?: string;
  cuisine?: string;
  sort?: string;
} = {}) {
  const conditions: SQL[] = [];
  const q = options.q?.trim();
  if (q) {
    conditions.push(
      or(
        ilike(restaurants.name, `%${q}%`),
        ilike(restaurants.cuisine, `%${q}%`),
        ilike(restaurants.tagline, `%${q}%`),
      )!,
    );
  }
  if (options.cuisine && options.cuisine !== "All") {
    conditions.push(eq(restaurants.cuisine, options.cuisine));
  }

  const sorters: Record<SortOption, SQL[]> = {
    recommended: [desc(restaurants.ratingCount)],
    rating: [desc(restaurants.rating)],
    delivery: [asc(restaurants.deliveryMinutes)],
    priceLow: [asc(restaurants.priceForTwo)],
    priceHigh: [desc(restaurants.priceForTwo)],
  };
  const orderBy = sorters[(options.sort as SortOption) ?? "recommended"] ?? sorters.recommended;

  return db
    .select()
    .from(restaurants)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(...orderBy);
}

export async function getRestaurantBySlug(slug: string) {
  const rows = await db.select().from(restaurants).where(eq(restaurants.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getMenuForRestaurant(restaurantId: number) {
  return db
    .select()
    .from(menuItems)
    .where(eq(menuItems.restaurantId, restaurantId))
    .orderBy(asc(menuItems.id));
}

export async function listCuisines() {
  const rows = await db
    .selectDistinct({ cuisine: restaurants.cuisine })
    .from(restaurants)
    .orderBy(asc(restaurants.cuisine));
  return rows.map((r) => r.cuisine);
}

export async function getPopularRestaurants(limit = 6) {
  return db.select().from(restaurants).orderBy(desc(restaurants.ratingCount)).limit(limit);
}

// ---------- Orders ----------

export type OrderItemInput = {
  id: number;
  name: string;
  price: number; // paise
  emoji: string;
  qty: number;
};

export type CreateOrderInput = {
  customerName: string;
  phone: string;
  address: string;
  note?: string;
  restaurantId: number;
  restaurantName: string;
  restaurantEmoji: string;
  items: OrderItemInput[];
  deliveryFee: number; // paise
};

export async function createOrder(input: CreateOrderInput) {
  const subtotal = input.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal + input.deliveryFee;

  const rows = await db
    .insert(orders)
    .values({
      customerName: input.customerName,
      phone: input.phone,
      address: input.address,
      note: input.note || null,
      restaurantId: input.restaurantId,
      restaurantName: input.restaurantName,
      restaurantEmoji: input.restaurantEmoji,
      items: input.items,
      subtotal,
      deliveryFee: input.deliveryFee,
      total,
      status: "placed",
    })
    .returning();

  return rows[0];
}

export async function listOrders(phone?: string, limit = 50) {
  if (phone?.trim()) {
    return db
      .select()
      .from(orders)
      .where(eq(orders.phone, phone.trim()))
      .orderBy(desc(orders.createdAt))
      .limit(limit);
  }
  return db.select().from(orders).orderBy(desc(orders.createdAt)).limit(limit);
}

export async function getOrderById(id: number) {
  const rows = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return rows[0] ?? null;
}

const STATUS_FLOW = ["placed", "confirmed", "preparing", "on_the_way", "delivered"] as const;

export async function advanceOrderStatus(id: number) {
  const order = await getOrderById(id);
  if (!order) return null;
  const currentIndex = STATUS_FLOW.indexOf(order.status as (typeof STATUS_FLOW)[number]);
  const nextStatus = STATUS_FLOW[Math.min(currentIndex + 1, STATUS_FLOW.length - 1)];
  const rows = await db
    .update(orders)
    .set({ status: nextStatus })
    .where(eq(orders.id, id))
    .returning();
  return rows[0];
}

export { STATUS_FLOW };

// Health-check helper kept close to the data layer.
export async function pingDb() {
  await db.execute(sql`select 1`);
}
