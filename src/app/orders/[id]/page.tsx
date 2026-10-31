import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/queries";
import { OrderTracker } from "@/components/OrderTracker";
import { StatusBadge } from "@/components/StatusBadge";
import { ArrowLeftIcon, BikeIcon, PhoneIcon, PinIcon, UserIcon } from "@/components/icons";
import { formatDate, formatINR } from "@/lib/format";
import type { CartItem } from "@/components/CartProvider";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const order = await getOrderById(Number(id));
  return { title: order ? `Order #TT-${order.id}` : "Order not found" };
}

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId) || orderId <= 0) notFound();

  const order = await getOrderById(orderId);
  if (!order) notFound();

  const items = (Array.isArray(order.items) ? order.items : []) as unknown as CartItem[];

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/orders"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-muted transition hover:text-ink"
      >
        <ArrowLeftIcon className="h-4 w-4" /> All orders
      </Link>

      {/* ---------- Header ---------- */}
      <header className="animate-rise mt-4 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-card sm:flex-row sm:items-center sm:gap-5">
        <span
          aria-hidden
          className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-4xl"
          style={{
            backgroundImage: "linear-gradient(135deg, var(--color-cream), var(--color-line))",
          }}
        >
          {order.restaurantEmoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-extrabold tracking-tight">{order.restaurantName}</h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-sm text-muted">
            Order <strong className="text-ink/70">#TT-{order.id}</strong> · placed{" "}
            {formatDate(order.createdAt)}
          </p>
        </div>
        <p className="text-2xl font-extrabold tabular-nums">{formatINR(order.total)}</p>
      </header>

      {/* ---------- Live tracker ---------- */}
      <section className="mt-6">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted">
          <BikeIcon className="h-4.5 w-4.5 text-coral-500" /> Live status
        </h2>
        <OrderTracker orderId={order.id} status={order.status} />
      </section>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {/* ---------- Items ---------- */}
        <section className="rounded-3xl bg-white p-6 shadow-card">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted">Your items</h2>
          <ul className="mt-4 divide-y divide-line">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-3">
                <span aria-hidden className="text-xl">
                  {item.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">{item.name}</span>
                  <span className="text-xs text-muted">
                    {formatINR(item.price)} × {item.qty}
                  </span>
                </span>
                <span className="text-sm font-bold tabular-nums">
                  {formatINR(item.price * item.qty)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between text-muted">
              <span>Item total</span>
              <span className="font-semibold tabular-nums text-ink">{formatINR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Delivery fee</span>
              <span
                className={`font-semibold tabular-nums ${
                  order.deliveryFee === 0 ? "text-leaf-500" : "text-ink"
                }`}
              >
                {order.deliveryFee === 0 ? "FREE" : formatINR(order.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base font-extrabold">
              <span>Total paid</span>
              <span className="tabular-nums">{formatINR(order.total)}</span>
            </div>
          </div>
        </section>

        {/* ---------- Delivery details ---------- */}
        <section className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted">Delivering to</h2>
            <ul className="mt-4 space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <UserIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-coral-500" />
                <span className="font-bold">{order.customerName}</span>
              </li>
              <li className="flex items-start gap-3">
                <PhoneIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-coral-500" />
                <span className="tabular-nums">{order.phone}</span>
              </li>
              <li className="flex items-start gap-3">
                <PinIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-coral-500" />
                <span className="leading-relaxed text-ink/80">{order.address}</span>
              </li>
            </ul>
            {order.note && (
              <p className="mt-4 rounded-2xl bg-cream px-4 py-3 text-sm italic text-muted">
                “{order.note}”
              </p>
            )}
          </div>

          <Link
            href="/restaurants"
            className="flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-cream shadow-soft transition hover:bg-ink/90 active:scale-95"
          >
            Order something else
          </Link>
        </section>
      </div>
    </main>
  );
}
