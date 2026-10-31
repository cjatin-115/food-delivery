import { NextRequest } from "next/server";
import { listRestaurants } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const restaurants = await listRestaurants({
    q: searchParams.get("q") ?? undefined,
    cuisine: searchParams.get("cuisine") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
  });
  return Response.json({ restaurants });
}
