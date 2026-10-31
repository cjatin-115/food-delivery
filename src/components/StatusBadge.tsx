import type { OrderStatus } from "@/lib/orderStatus";
import { STATUS_META } from "@/lib/orderStatus";

export function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status as OrderStatus] ?? STATUS_META.placed;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${meta.badgeClass}`}
    >
      <span className="text-sm leading-none">{meta.emoji}</span>
      {meta.label}
    </span>
  );
}
