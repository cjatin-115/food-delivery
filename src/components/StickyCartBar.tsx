"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { formatINR } from "@/lib/format";
import { BagIcon } from "./icons";

export function StickyCartBar() {
  const { itemCount, subtotal, restaurant } = useCart();

  if (itemCount === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-30 flex justify-center px-4">
      <Link
        href="/cart"
        className="animate-pop pointer-events-auto flex items-center gap-4 rounded-full bg-ink py-3 pl-5 pr-6 text-cream shadow-pop transition hover:scale-[1.02] active:scale-95"
      >
        <span className="relative">
          <BagIcon className="h-5 w-5" />
          <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-coral-500 px-1 text-[10px] font-bold text-white">
            {itemCount}
          </span>
        </span>
        <span className="text-sm font-semibold">
          {itemCount} item{itemCount > 1 ? "s" : ""}
          {restaurant ? ` · ${restaurant.name}` : ""}
        </span>
        <span className="rounded-full bg-cream/15 px-3 py-1 text-sm font-bold">
          {formatINR(subtotal)} · View cart
        </span>
      </Link>
    </div>
  );
}
