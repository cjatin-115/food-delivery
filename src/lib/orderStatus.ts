export const ORDER_STATUSES = ["placed", "confirmed", "preparing", "on_the_way", "delivered"] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_META: Record<
  OrderStatus,
  { label: string; emoji: string; badgeClass: string; stepClass: string }
> = {
  placed: {
    label: "Order placed",
    emoji: "🧾",
    badgeClass: "bg-coral-50 text-coral-700",
    stepClass: "bg-coral-100 text-coral-700",
  },
  confirmed: {
    label: "Confirmed",
    emoji: "✅",
    badgeClass: "bg-blue-50 text-blue-700",
    stepClass: "bg-blue-50 text-blue-700",
  },
  preparing: {
    label: "Preparing",
    emoji: "👨‍🍳",
    badgeClass: "bg-amber-50 text-amber-700",
    stepClass: "bg-amber-50 text-amber-700",
  },
  on_the_way: {
    label: "On the way",
    emoji: "🛵",
    badgeClass: "bg-violet-50 text-violet-700",
    stepClass: "bg-violet-50 text-violet-700",
  },
  delivered: {
    label: "Delivered",
    emoji: "🎉",
    badgeClass: "bg-leaf-100 text-leaf-500",
    stepClass: "bg-leaf-100 text-leaf-500",
  },
};

export const STATUS_STEPS: { key: OrderStatus; label: string; emoji: string }[] = [
  { key: "placed", label: "Order placed", emoji: "🧾" },
  { key: "confirmed", label: "Confirmed", emoji: "✅" },
  { key: "preparing", label: "Preparing", emoji: "👨‍🍳" },
  { key: "on_the_way", label: "On the way", emoji: "🛵" },
  { key: "delivered", label: "Delivered", emoji: "🎉" },
];

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}
