"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchIcon } from "./icons";

type Props = {
  cuisines: string[];
  activeCuisine: string;
  activeSort: string;
  activeQuery: string;
};

const SORTS = [
  { value: "recommended", label: "Recommended" },
  { value: "rating", label: "Rating: high to low" },
  { value: "delivery", label: "Delivery time" },
  { value: "priceLow", label: "Cost for two: low to high" },
  { value: "priceHigh", label: "Cost for two: high to low" },
];

export function RestaurantFilters({ cuisines, activeCuisine, activeSort, activeQuery }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(activeQuery);
  const [prevActiveQuery, setPrevActiveQuery] = useState(activeQuery);

  if (activeQuery !== prevActiveQuery) {
    setPrevActiveQuery(activeQuery);
    setQuery(activeQuery);
  }

  function pushParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.replace(params.toString() ? `${pathname}?${params}` : pathname, { scroll: false });
  }

  // Debounced search-as-you-type.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const current = searchParams.get("q") ?? "";
      if (query.trim() === current) return;
      pushParams((params) => {
        if (query.trim()) params.set("q", query.trim());
        else params.delete("q");
      });
    }, 350);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-card">
        <span className="text-muted">
          <SearchIcon className="h-5 w-5" />
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search restaurants or cuisines…"
          aria-label="Search restaurants"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="shrink-0 rounded-full bg-cream px-3 py-1 text-xs font-bold text-muted transition hover:text-ink"
          >
            Clear
          </button>
        )}
      </div>

      {/* Cuisine pills */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {["All", ...cuisines].map((cuisine) => {
          const active = cuisine === activeCuisine;
          return (
            <button
              key={cuisine}
              type="button"
              onClick={() =>
                pushParams((params) => {
                  if (cuisine === "All") params.delete("cuisine");
                  else params.set("cuisine", cuisine);
                })
              }
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition active:scale-95 ${
                active
                  ? "bg-ink text-cream shadow-soft"
                  : "bg-white text-ink/70 shadow-card hover:text-ink"
              }`}
            >
              {cuisine}
            </button>
          );
        })}
      </div>

      {/* Sort */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted">
          {activeCuisine !== "All" ? `${activeCuisine} · ` : ""}
          {activeQuery ? `“${activeQuery}” · ` : ""}sorted by{" "}
          {SORTS.find((s) => s.value === activeSort)?.label.toLowerCase()}
        </p>
        <label className="flex items-center gap-2 text-sm">
          <span className="hidden font-semibold text-muted sm:inline">Sort</span>
          <select
            value={activeSort}
            onChange={(event) =>
              pushParams((params) => {
                if (event.target.value === "recommended") params.delete("sort");
                else params.set("sort", event.target.value);
              })
            }
            className="rounded-full border-0 bg-white px-4 py-2 text-sm font-semibold shadow-card outline-none"
          >
            {SORTS.map((sort) => (
              <option key={sort.value} value={sort.value}>
                {sort.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
