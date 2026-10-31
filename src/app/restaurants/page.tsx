import Link from "next/link";
import { listCuisines, listRestaurants } from "@/lib/queries";
import { RestaurantCard } from "@/components/RestaurantCard";
import { RestaurantFilters } from "@/components/RestaurantFilters";
import { SearchIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

type SearchParams = { q?: string; cuisine?: string; sort?: string };

export default async function RestaurantsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = params.q ?? "";
  const cuisine = params.cuisine ?? "All";
  const sort = params.sort ?? "recommended";

  const [restaurants, cuisines] = await Promise.all([
    listRestaurants({ q, cuisine, sort }),
    listCuisines(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="animate-rise">
        <p className="text-sm font-semibold uppercase tracking-widest text-coral-500">Explore</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Restaurants near you</h1>
        <p className="mt-2 text-muted">
          {restaurants.length} kitchen{restaurants.length === 1 ? "" : "s"} ready to deliver, warm and
          fresh.
        </p>
      </header>

      <div className="mt-8">
        <RestaurantFilters
          cuisines={cuisines}
          activeCuisine={cuisine}
          activeSort={sort}
          activeQuery={q}
        />
      </div>

      {restaurants.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant, index) => (
            <div key={restaurant.id} className="animate-rise" style={{ animationDelay: `${index * 60}ms` }}>
              <RestaurantCard restaurant={restaurant} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-10 grid place-items-center rounded-3xl bg-white px-6 py-20 text-center shadow-card">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-coral-50 text-3xl">
            <SearchIcon className="h-7 w-7 text-coral-500" />
          </span>
          <h2 className="mt-5 text-xl font-extrabold">No kitchens match that craving</h2>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Try a different dish, cuisine or clear your filters to see everything on offer.
          </p>
          <Link
            href="/restaurants"
            className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-bold text-cream transition hover:bg-ink/90 active:scale-95"
          >
            Clear filters
          </Link>
        </div>
      )}
    </main>
  );
}
