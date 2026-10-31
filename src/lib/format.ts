// Small formatting helpers shared across the app.
// Money is stored in paise (100 paise = ₹1) and ratings x10 (46 => 4.6).

export function formatINR(paise: number): string {
  const rupees = paise / 100;
  const formatted = rupees.toLocaleString("en-IN", {
    maximumFractionDigits: Number.isInteger(rupees) ? 0 : 2,
  });
  return `₹${formatted}`;
}

export function formatRating(ratingTimes10: number): string {
  return (ratingTimes10 / 10).toFixed(1);
}

export function formatDeliveryTime(minutes: number): string {
  return `${minutes}–${minutes + 8} mins`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
