"use client";

import type { MenuItem } from "@/db/schema";
import { formatINR } from "@/lib/format";
import { useCart } from "./CartProvider";
import { LeafIcon, StarIcon } from "./icons";
import { QuantityControl } from "./QuantityControl";

type MenuSection = { category: string; items: MenuItem[] };

type Props = {
  restaurant: {
    id: number;
    name: string;
    slug: string;
    emoji: string;
    deliveryMinutes: number;
    priceForTwo: number;
  };
  sections: MenuSection[];
};

export function MenuList({ restaurant, sections }: Props) {
  const { items, restaurant: cartRestaurant, addItem, setQty } = useCart();
  const qtyOf = (id: number) => items.find((i) => i.id === id)?.qty ?? 0;

  return (
    <div className="space-y-8">
      {cartRestaurant && cartRestaurant.id !== restaurant.id && (
        <p className="rounded-2xl border border-coral-200 bg-coral-50 px-4 py-3 text-sm text-coral-700">
          Your cart has items from <strong>{cartRestaurant.name}</strong>. Adding items here will
          start a fresh cart.
        </p>
      )}

      {sections.map((section) => (
        <section key={section.category}>
          <h2 className="mb-4 flex items-center gap-3 text-lg font-extrabold">
            {section.category}
            <span className="h-px flex-1 bg-line" />
            <span className="text-sm font-medium text-muted">{section.items.length} items</span>
          </h2>

          <div className="divide-y divide-line overflow-hidden rounded-3xl bg-white shadow-card">
            {section.items.map((item) => {
              const qty = qtyOf(item.id);
              return (
                <article
                  key={item.id}
                  className="flex items-center gap-4 p-4 transition hover:bg-cream/60 sm:p-5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        aria-label={item.isVeg ? "Vegetarian" : "Non-vegetarian"}
                        title={item.isVeg ? "Veg" : "Non-veg"}
                        className={`grid h-4 w-4 shrink-0 place-items-center rounded-sm border ${
                          item.isVeg ? "border-leaf-500" : "border-coral-600"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            item.isVeg ? "bg-leaf-500" : "bg-coral-600"
                          }`}
                        />
                      </span>
                      {item.isBestseller && (
                        <span className="flex items-center gap-1 rounded-full bg-coral-50 px-2 py-0.5 text-[11px] font-bold text-coral-600">
                          <StarIcon className="h-3 w-3" /> Bestseller
                        </span>
                      )}
                    </div>

                    <h3 className="mt-1.5 font-bold leading-tight">{item.name}</h3>
                    <p className="mt-1 text-sm font-semibold">{formatINR(item.price)}</p>
                    {item.description && (
                      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
                        {item.description}
                      </p>
                    )}
                    {item.isVeg && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-leaf-500">
                        <LeafIcon className="h-3.5 w-3.5" /> Pure veg
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div
                      aria-hidden
                      className="grid h-20 w-20 place-items-center rounded-2xl text-4xl sm:h-24 sm:w-24"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, var(--color-cream), var(--color-line))",
                      }}
                    >
                      {item.emoji}
                    </div>
                    <QuantityControl
                      qty={qty}
                      onChange={(next) => {
                        if (next > qty) {
                          if (qty === 0) {
                            addItem(restaurant, {
                              id: item.id,
                              name: item.name,
                              price: item.price,
                              emoji: item.emoji,
                              isVeg: item.isVeg,
                            });
                          } else {
                            setQty(item.id, next);
                          }
                        } else {
                          setQty(item.id, next);
                        }
                      }}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
