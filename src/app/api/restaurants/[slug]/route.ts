import { getMenuForRestaurant, getRestaurantBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant) {
    return Response.json({ error: "Restaurant not found" }, { status: 404 });
  }

  const menu = await getMenuForRestaurant(restaurant.id);
  return Response.json({ restaurant, menu });
}
