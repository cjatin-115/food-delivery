"use client";

import { MinusIcon, PlusIcon } from "./icons";

type Props = {
  qty: number;
  onChange: (qty: number) => void;
  className?: string;
};

export function QuantityControl({ qty, onChange, className = "" }: Props) {
  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={() => onChange(1)}
        className={`rounded-full bg-coral-50 px-4 py-2 text-sm font-bold text-coral-600 transition hover:bg-coral-100 active:scale-95 ${className}`}
      >
        Add
      </button>
    );
  }

  return (
    <div
      className={`flex items-center gap-1 rounded-full bg-coral-500 p-1 text-white shadow-soft ${className}`}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(qty - 1)}
        className="grid h-7 w-7 place-items-center rounded-full transition hover:bg-white/20 active:scale-90"
      >
        <MinusIcon className="h-4 w-4" />
      </button>
      <span className="min-w-6 text-center text-sm font-bold tabular-nums">{qty}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(qty + 1)}
        className="grid h-7 w-7 place-items-center rounded-full transition hover:bg-white/20 active:scale-90"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
