import Link from "next/link";
import type { Restaurant } from "@/db/schema";
import { formatDeliveryTime, formatINR, formatRating } from "@/lib/format";
import { ClockIcon, StarIcon } from "./icons";

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link
      href={`/restaurants/${restaurant.slug}`}
      className="group block overflow-hidden rounded-3xl bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-pop"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {restaurant.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="grid h-full w-full place-items-center text-6xl"
            style={{
              backgroundImage: `linear-gradient(135deg, ${restaurant.gradientFrom}, ${restaurant.gradientTo})`,
            }}
          >
            {restaurant.emoji}
          </div>
        )}
        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold shadow-card">
          <StarIcon className="h-3.5 w-3.5 text-coral-500" />
          {formatRating(restaurant.rating)}
          <span className="font-medium text-muted">({restaurant.ratingCount})</span>
        </span>
      </div>

      <div className="p-4">
        <h3 className="truncate text-base font-bold">{restaurant.name}</h3>
        <p className="mt-0.5 truncate text-sm text-muted">{restaurant.tagline}</p>
        <div className="mt-3.5 flex items-center justify-between border-t border-line pt-3 text-sm text-muted">
          <span className="flex items-center gap-1.5 font-medium">
            <ClockIcon className="h-4 w-4" />
            {formatDeliveryTime(restaurant.deliveryMinutes)}
          </span>
          <span className="font-medium">{formatINR(restaurant.priceForTwo * 100)} for two</span>
        </div>
      </div>
    </Link>
  );
}
