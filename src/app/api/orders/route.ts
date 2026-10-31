import { NextRequest } from "next/server";
import { createOrder, listOrders, type OrderItemInput } from "@/lib/queries";
import { DELIVERY_FEE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orders = await listOrders(searchParams.get("phone") ?? undefined);
  return Response.json({ orders });
}

type OrderPayload = {
  customerName?: string;
  phone?: string;
  address?: string;
  note?: string;
  restaurantId?: number;
  restaurantName?: string;
  restaurantEmoji?: string;
  items?: OrderItemInput[];
};

export async function POST(request: NextRequest) {
  let payload: OrderPayload;
  try {
    payload = (await request.json()) as OrderPayload;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { customerName, phone, address, note, restaurantId, restaurantName, restaurantEmoji, items } =
    payload;

  // ---- Validation ----
  const errors: Record<string, string> = {};
  if (!customerName || customerName.trim().length < 2) errors.customerName = "Please enter your name";
  if (!phone || !/^[0-9]{10}$/.test(phone.trim()))
    errors.phone = "Enter a valid 10-digit phone number";
  if (!address || address.trim().length < 10)
    errors.address = "Please enter a complete delivery address";
  if (!restaurantId || !restaurantName) errors.restaurant = "Missing restaurant information";
  if (!Array.isArray(items) || items.length === 0) errors.items = "Your cart is empty";

  const sanitizedItems: OrderItemInput[] = Array.isArray(items)
    ? items
        .filter((item) => item && Number.isFinite(item.price) && Number.isFinite(item.qty))
        .map((item) => ({
          id: Number(item.id),
          name: String(item.name),
          price: Math.max(0, Math.round(Number(item.price))),
          emoji: String(item.emoji ?? "🍽️"),
          qty: Math.max(1, Math.min(20, Math.round(Number(item.qty)))),
        }))
    : [];

  if (sanitizedItems.length === 0) errors.items = "Your cart is empty";

  if (Object.keys(errors).length > 0) {
    return Response.json({ error: "Validation failed", errors }, { status: 422 });
  }

  const order = await createOrder({
    customerName: customerName!.trim(),
    phone: phone!.trim(),
    address: address!.trim(),
    note: note?.trim() || undefined,
    restaurantId: restaurantId!,
    restaurantName: restaurantName!,
    restaurantEmoji: restaurantEmoji ?? "🍽️",
    items: sanitizedItems,
    deliveryFee: DELIVERY_FEE,
  });

  return Response.json({ order }, { status: 201 });
}
