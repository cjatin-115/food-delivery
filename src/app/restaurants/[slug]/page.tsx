import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMenuForRestaurant, getRestaurantBySlug } from "@/lib/queries";
import { MenuList } from "@/components/MenuList";
import { StickyCartBar } from "@/components/StickyCartBar";
import { ArrowLeftIcon, ClockIcon, PinIcon, StarIcon } from "@/components/icons";
import { formatDeliveryTime, formatINR, formatRating } from "@/lib/format";

export const dynamic = "force-dynamic";

type MenuItemRow = Awaited<ReturnType<typeof getMenuForRestaurant>>[number];
type MenuSection = { category: string; items: MenuItemRow[] };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);
  return { title: restaurant ? `${restaurant.name} · Order online` : "Restaurant not found" };
}

export default async function RestaurantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant) notFound();

  const menu = await getMenuForRestaurant(restaurant.id);

  // Group menu items by category, preserving first-seen order.
  const sections: MenuSection[] = [];
  for (const item of menu) {
    let section = sections.find((s) => s.category === item.category);
    if (!section) {
      section = { category: item.category, items: [] };
      sections.push(section);
    }
    section.items.push(item);
  }

  return (
    <main className="pb-28">
      {/* ---------- Banner ---------- */}
      <div className="relative h-56 overflow-hidden sm:h-72">
        {restaurant.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="grid h-full w-full place-items-center text-8xl"
            style={{
              backgroundImage: `linear-gradient(135deg, ${restaurant.gradientFrom}, ${restaurant.gradientTo})`,
            }}
          >
            {restaurant.emoji}
          </div>
        )}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />

        <Link
          href="/restaurants"
          className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-sm font-bold shadow-card backdrop-blur transition hover:bg-white sm:left-6"
        >
          <ArrowLeftIcon className="h-4 w-4" /> All restaurants
        </Link>

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-4xl px-4 pb-6 sm:px-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow sm:text-4xl">
              {restaurant.name}
            </h1>
            <p className="mt-1.5 max-w-xl text-sm text-white/85">{restaurant.tagline}</p>
          </div>
        </div>
      </div>

      {/* ---------- Info strip ---------- */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="-mt-6 grid grid-cols-3 divide-x divide-line rounded-3xl bg-white py-5 shadow-card">
          <div className="flex flex-col items-center gap-1 px-2 text-center">
            <span className="flex items-center gap-1.5 text-lg font-extrabold">
              <StarIcon className="h-4.5 w-4.5 text-coral-500" />
              {formatRating(restaurant.rating)}
            </span>
            <span className="text-xs text-muted">{restaurant.ratingCount}+ ratings</span>
          </div>
          <div className="flex flex-col items-center gap-1 px-2 text-center">
            <span className="flex items-center gap-1.5 text-lg font-extrabold">
              <ClockIcon className="h-4.5 w-4.5 text-coral-500" />
              {restaurant.deliveryMinutes} min
            </span>
            <span className="text-xs text-muted">{formatDeliveryTime(restaurant.deliveryMinutes)}</span>
          </div>
          <div className="flex flex-col items-center gap-1 px-2 text-center">
            <span className="flex items-center gap-1.5 text-lg font-extrabold">
              <PinIcon className="h-4.5 w-4.5 text-coral-500" />
              {formatINR(restaurant.priceForTwo * 100)}
            </span>
            <span className="text-xs text-muted">Cost for two</span>
          </div>
        </div>

        {/* ---------- Menu ---------- */}
        <div className="mt-10">
          <h2 className="text-2xl font-extrabold tracking-tight">Menu</h2>
          <p className="mt-1 text-sm text-muted">
            {menu.length} dishes · {restaurant.cuisine} kitchen
          </p>

          <div className="mt-6">
            <MenuList
              restaurant={{
                id: restaurant.id,
                name: restaurant.name,
                slug: restaurant.slug,
                emoji: restaurant.emoji,
                deliveryMinutes: restaurant.deliveryMinutes,
                priceForTwo: restaurant.priceForTwo,
              }}
              sections={sections}
            />
          </div>
        </div>
      </div>

      <StickyCartBar />
    </main>
  );
}
