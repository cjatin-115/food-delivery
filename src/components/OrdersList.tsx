"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Order } from "@/db/schema";
import type { CartItem } from "./CartProvider";
import { StatusBadge } from "./StatusBadge";
import { ArrowRightIcon, PhoneIcon, SearchIcon } from "./icons";
import { formatDate, formatINR } from "@/lib/format";

function summariseItems(items: unknown): string {
  const list = Array.isArray(items) ? (items as CartItem[]) : [];
  if (list.length === 0) return "—";
  const names = list.slice(0, 2).map((item) => `${item.qty}× ${item.name}`);
  const extra = list.length - 2;
  return extra > 0 ? `${names.join(", ")} +${extra} more` : names.join(", ");
}

export function OrdersList({ orders }: { orders: Order[] }) {
  const [phone, setPhone] = useState("");

  const filtered = useMemo(() => {
    const query = phone.trim();
    if (!query) return orders;
    return orders.filter((order) => order.phone.includes(query));
  }, [orders, phone]);

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-card">
        <span className="text-muted">
          <SearchIcon className="h-5 w-5" />
        </span>
        <input
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Filter by phone number…"
          aria-label="Filter orders by phone number"
          inputMode="numeric"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-3xl bg-white px-6 py-12 text-center text-sm text-muted shadow-card">
          No orders match that phone number.
        </p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((order, index) => (
            <li
              key={order.id}
              className="animate-rise"
              style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
            >
              <Link
                href={`/orders/${order.id}`}
                className="group flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-pop sm:flex-row sm:items-center"
              >
                <span
                  aria-hidden
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-3xl"
                  style={{
                    backgroundImage: "linear-gradient(135deg, var(--color-cream), var(--color-line))",
                  }}
                >
                  {order.restaurantEmoji}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-extrabold">{order.restaurantName}</h2>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="mt-1 truncate text-sm text-muted">{summariseItems(order.items)}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                    <span className="font-semibold text-ink/70">#TT-{order.id}</span>
                    <span>{formatDate(order.createdAt)}</span>
                    <span className="flex items-center gap-1">
                      <PhoneIcon className="h-3.5 w-3.5" /> {order.phone}
                    </span>
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <span className="text-lg font-extrabold tabular-nums">{formatINR(order.total)}</span>
                  <span className="flex items-center gap-1 text-sm font-bold text-coral-600 transition group-hover:gap-2">
                    Track <ArrowRightIcon className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
