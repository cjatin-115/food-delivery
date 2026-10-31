import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { advanceOrderStatus, getOrderById } from "@/lib/queries";
import { isOrderStatus } from "@/lib/orderStatus";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

async function resolveId(context: RouteContext): Promise<number | null> {
  const { id } = await context.params;
  const parsed = Number(id);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function GET(_request: Request, context: RouteContext) {
  const id = await resolveId(context);
  if (id === null) {
    return Response.json({ error: "Invalid order id" }, { status: 400 });
  }
  const order = await getOrderById(id);
  if (!order) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }
  return Response.json({ order });
}

export async function PATCH(request: Request, context: RouteContext) {
  const id = await resolveId(context);
  if (id === null) {
    return Response.json({ error: "Invalid order id" }, { status: 400 });
  }

  let body: { action?: string; status?: string } = {};
  try {
    body = await request.json();
  } catch {
    // Empty body is fine — default behaviour advances the status.
  }

  // Advance the order to its next status (demo of the backend write path).
  if (!body.status) {
    const order = await advanceOrderStatus(id);
    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }
    return Response.json({ order });
  }

  // Direct status update (admin-style tooling).
  if (!isOrderStatus(body.status)) {
    return Response.json({ error: "Unknown status" }, { status: 400 });
  }
  const existing = await getOrderById(id);
  if (!existing) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }
  const rows = await db
    .update(orders)
    .set({ status: body.status })
    .where(eq(orders.id, id))
    .returning();
  return Response.json({ order: rows[0] });
}
