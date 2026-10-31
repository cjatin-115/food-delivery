"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/lib/constants";
import { useCart } from "@/components/CartProvider";
import { QuantityControl } from "@/components/QuantityControl";
import { ArrowLeftIcon, BagIcon, BikeIcon, PhoneIcon, PinIcon, ReceiptIcon, UserIcon } from "@/components/icons";
import { formatINR } from "@/lib/format";
import type { ReactNode } from "react";

export default function CartPage() {
  const router = useRouter();
  const { items, restaurant, subtotal, deliveryFee, total, itemCount, setQty, clearCart } =
    useCart();

  const [form, setForm] = useState({ customerName: "", phone: "", address: "", note: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const remainingForFreeDelivery = FREE_DELIVERY_THRESHOLD - subtotal;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!restaurant) return;

    const nextErrors: Record<string, string> = {};
    if (form.customerName.trim().length < 2) nextErrors.customerName = "Please enter your name";
    if (!/^[0-9]{10}$/.test(form.phone.trim()))
      nextErrors.phone = "Enter a valid 10-digit phone number";
    if (form.address.trim().length < 10)
      nextErrors.address = "Please enter a complete delivery address";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName,
          phone: form.phone,
          address: form.address,
          note: form.note,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          restaurantEmoji: restaurant.emoji,
          items,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors ?? { form: data.error ?? "Could not place your order" });
        return;
      }
      clearCart();
      router.push(`/orders/${data.order.id}`);
    } catch {
      setErrors({ form: "Network error — please check your connection and try again." });
    } finally {
      setSubmitting(false);
    }
  }

  // ---------- Empty state ----------
  if (itemCount === 0) {
    return (
      <main className="mx-auto grid max-w-2xl place-items-center px-4 py-24 text-center sm:px-6">
        <span className="grid h-20 w-20 place-items-center rounded-3xl bg-white text-4xl shadow-card">
          <BagIcon className="h-9 w-9 text-coral-500" />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Your cart is empty</h1>
        <p className="mt-3 text-muted">
          Add a dish or two from your favourite restaurant and it will show up right here.
        </p>
        <Link
          href="/restaurants"
          className="mt-8 flex items-center gap-2 rounded-full bg-coral-500 px-7 py-3.5 text-sm font-bold text-white shadow-soft transition hover:bg-coral-600 active:scale-95"
        >
          Browse restaurants
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/restaurants"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-muted transition hover:text-ink"
      >
        <ArrowLeftIcon className="h-4 w-4" /> Continue browsing
      </Link>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight">Your cart</h1>
      <p className="mt-2 text-muted">
        {itemCount} item{itemCount > 1 ? "s" : ""} from{" "}
        <Link href={`/restaurants/${restaurant?.slug}`} className="font-bold text-coral-600">
          {restaurant?.name}
        </Link>
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* ---------- Items ---------- */}
        <section className="animate-rise space-y-4">
          <div className="divide-y divide-line overflow-hidden rounded-3xl bg-white shadow-card">
            {items.map((item) => (
              <article key={item.id} className="flex items-center gap-4 p-4 sm:p-5">
                <div
                  aria-hidden
                  className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-3xl"
                  style={{
                    backgroundImage: "linear-gradient(135deg, var(--color-cream), var(--color-line))",
                  }}
                >
                  {item.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-bold">{item.name}</h3>
                  <p className="mt-0.5 text-sm font-semibold">{formatINR(item.price)}</p>
                </div>
                <QuantityControl qty={item.qty} onChange={(qty) => setQty(item.id, qty)} />
                <p className="hidden w-20 text-right text-sm font-bold tabular-nums sm:block">
                  {formatINR(item.price * item.qty)}
                </p>
              </article>
            ))}
          </div>

          {/* Free-delivery progress */}
          <div className="rounded-3xl bg-white p-5 shadow-card">
            {remainingForFreeDelivery > 0 ? (
              <>
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <BikeIcon className="h-4.5 w-4.5 text-coral-500" />
                  Add {formatINR(remainingForFreeDelivery)} more for{" "}
                  <strong className="text-leaf-500">free delivery</strong>
                </p>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-cream">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-coral-400 to-coral-600 transition-all duration-500"
                    style={{ width: `${Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="flex items-center gap-2 text-sm font-semibold text-leaf-500">
                <BikeIcon className="h-4.5 w-4.5" /> You&apos;ve unlocked free delivery!
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="text-sm font-semibold text-muted underline-offset-4 transition hover:text-coral-600 hover:underline"
          >
            Empty cart
          </button>
        </section>

        {/* ---------- Checkout ---------- */}
        <section className="lg:sticky lg:top-24 lg:self-start">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="animate-rise space-y-5 rounded-3xl bg-white p-6 shadow-card"
          >
            <h2 className="flex items-center gap-2 text-lg font-extrabold">
              <ReceiptIcon className="h-5 w-5 text-coral-500" /> Delivery details
            </h2>

            <Field
              icon={<UserIcon className="h-4.5 w-4.5" />}
              label="Full name"
              error={errors.customerName}
            >
              <input
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                placeholder="Aarav Sharma"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
              />
            </Field>

            <Field
              icon={<PhoneIcon className="h-4.5 w-4.5" />}
              label="Phone number"
              error={errors.phone}
            >
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="10-digit mobile number"
                inputMode="numeric"
                maxLength={10}
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
              />
            </Field>

            <Field
              icon={<PinIcon className="h-4.5 w-4.5" />}
              label="Delivery address"
              error={errors.address}
            >
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Flat / house no., street, area, city"
                rows={3}
                className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted"
              />
            </Field>

            <Field icon={<span className="text-sm">📝</span>} label="Notes for the kitchen (optional)">
              <input
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="e.g. make it extra spicy, ring the bell"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
              />
            </Field>

            {/* Bill */}
            <div className="space-y-2.5 border-t border-line pt-5 text-sm">
              <Row label={`Item total (${itemCount})`} value={formatINR(subtotal)} />
              <Row
                label="Delivery fee"
                value={deliveryFee === 0 ? "FREE" : formatINR(deliveryFee)}
                valueClass={deliveryFee === 0 ? "text-leaf-500" : ""}
              />
              <div className="flex items-center justify-between border-t border-line pt-3 text-base font-extrabold">
                <span>To pay</span>
                <span className="tabular-nums">{formatINR(total)}</span>
              </div>
            </div>

            {errors.form && (
              <p className="rounded-2xl bg-coral-50 px-4 py-3 text-sm font-semibold text-coral-700">
                {errors.form}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-coral-500 py-4 text-sm font-bold text-white shadow-soft transition hover:bg-coral-600 active:scale-[0.98] disabled:opacity-60"
            >
              {submitting ? "Placing your order…" : `Place order · ${formatINR(total)}`}
            </button>
            <p className="text-center text-xs text-muted">
              Demo checkout — no real payment is taken. Delivery fee {formatINR(DELIVERY_FEE)}, free
              above {formatINR(FREE_DELIVERY_THRESHOLD)}.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}

function Field({
  icon,
  label,
  error,
  children,
}: {
  icon: ReactNode;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wider text-muted">{label}</span>
      <span
        className={`mt-1.5 flex items-center gap-2.5 rounded-2xl border bg-cream/60 px-4 py-3 transition focus-within:border-coral-400 focus-within:bg-white ${
          error ? "border-coral-400" : "border-line"
        }`}
      >
        <span className="text-muted">{icon}</span>
        {children}
      </span>
      {error && <span className="mt-1 block text-xs font-semibold text-coral-600">{error}</span>}
    </label>
  );
}

function Row({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between text-muted">
      <span>{label}</span>
      <span className={`font-semibold tabular-nums text-ink ${valueClass}`}>{value}</span>
    </div>
  );
}
