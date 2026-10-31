"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { BagIcon } from "./icons";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/restaurants", label: "Restaurants" },
  { href: "/orders", label: "Orders" },
];

export function Header() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-cream/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-coral-400 to-coral-600 text-lg text-white shadow-soft"
          >
            🍜
          </span>
          <span className="text-lg font-extrabold tracking-tight">TastyTrail</span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm font-semibold text-ink/70 transition hover:bg-white hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/cart"
          className="flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-cream shadow-soft transition hover:bg-ink/90 active:scale-95"
        >
          <BagIcon className="h-4.5 w-4.5" />
          <span>Cart</span>
          {itemCount > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-coral-500 px-1.5 text-xs font-bold text-white">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
