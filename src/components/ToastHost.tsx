"use client";

import { useCart } from "./CartProvider";

export function ToastHost() {
  const { toast } = useCart();

  if (!toast) return null;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4"
    >
      <div
        key={toast.id}
        className="animate-toast rounded-full bg-ink px-5 py-3 text-sm font-semibold text-cream shadow-pop"
      >
        {toast.message}
      </div>
    </div>
  );
}
