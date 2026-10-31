import Link from "next/link";
import { listOrders } from "@/lib/queries";
import { OrdersList } from "@/components/OrdersList";
import { ReceiptIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await listOrders();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="animate-rise">
        <p className="text-sm font-semibold uppercase tracking-widest text-coral-500">Account</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Your orders</h1>
        <p className="mt-2 text-muted">
          {orders.length > 0
            ? `${orders.length} order${orders.length === 1 ? "" : "s"} placed with TastyTrail.`
            : "Orders you place will appear here with live status."}
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="mt-10 grid place-items-center rounded-3xl bg-white px-6 py-20 text-center shadow-card">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-coral-50">
            <ReceiptIcon className="h-7 w-7 text-coral-500" />
          </span>
          <h2 className="mt-5 text-xl font-extrabold">No orders yet</h2>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Once you place your first order you can track it here, step by step.
          </p>
          <Link
            href="/restaurants"
            className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-bold text-cream transition hover:bg-ink/90 active:scale-95"
          >
            Find something tasty
          </Link>
        </div>
      ) : (
        <OrdersList orders={orders} />
      )}
    </main>
  );
}
