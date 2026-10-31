"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ORDER_STATUSES, STATUS_STEPS, isOrderStatus } from "@/lib/orderStatus";
import { CheckIcon } from "./icons";

type Props = {
  orderId: number;
  status: string;
};

export function OrderTracker({ orderId, status }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentIndex = isOrderStatus(status) ? ORDER_STATUSES.indexOf(status) : 0;
  const isDelivered = currentIndex === ORDER_STATUSES.length - 1;

  async function advance() {
    setPending(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "advance" }),
      });
      if (!res.ok) throw new Error("Could not update the order");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
      <ol className="relative flex flex-col gap-0 sm:flex-row sm:items-start sm:justify-between">
        {/* Connecting line */}
        <div
          aria-hidden
          className="absolute left-5 top-2 h-[calc(100%-1rem)] w-0.5 rounded bg-line sm:left-0 sm:right-0 sm:top-5 sm:h-0.5 sm:w-auto"
        />
        {STATUS_STEPS.map((step, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;
          return (
            <li
              key={step.key}
              className="relative flex flex-1 flex-row items-center gap-3 py-2.5 sm:flex-col sm:items-center sm:gap-2.5 sm:text-center"
            >
              <span
                className={`z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 text-lg transition ${
                  done
                    ? "border-leaf-500 bg-leaf-500 text-white"
                    : active
                      ? "animate-pop border-coral-500 bg-coral-500 text-white shadow-soft"
                      : "border-line bg-white text-muted"
                }`}
              >
                {done ? <CheckIcon className="h-5 w-5" /> : step.emoji}
              </span>
              <div className="sm:px-2">
                <p
                  className={`text-sm font-bold ${
                    done ? "text-leaf-500" : active ? "text-coral-600" : "text-muted"
                  }`}
                >
                  {step.label}
                </p>
                {active && (
                  <p className="mt-0.5 text-xs font-medium text-coral-500">Happening now</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 border-t border-line pt-5">
        {isDelivered ? (
          <p className="text-center text-sm font-semibold text-leaf-500">
            🎉 Your order has been delivered. Enjoy your meal!
          </p>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={advance}
              disabled={pending}
              className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-cream shadow-soft transition hover:bg-ink/90 active:scale-95 disabled:opacity-60"
            >
              {pending ? "Updating…" : "Advance to next step"}
            </button>
            <p className="text-xs text-muted">
              Demo mode — tap to move the order to its next status.
            </p>
            {error && <p className="text-xs font-semibold text-coral-600">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
