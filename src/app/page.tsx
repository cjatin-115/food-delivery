import Link from "next/link";
import { getPopularRestaurants, listCuisines } from "@/lib/queries";
import { RestaurantCard } from "@/components/RestaurantCard";
import {
  ArrowRightIcon,
  BikeIcon,
  ChefIcon,
  ClockIcon,
  ReceiptIcon,
  SearchIcon,
  StarIcon,
} from "@/components/icons";

export const dynamic = "force-dynamic";

const CATEGORY_EMOJI: Record<string, string> = {
  Italian: "🍕",
  American: "🍔",
  Japanese: "🍣",
  Indian: "🍛",
  "Healthy & Salads": "🥗",
  Desserts: "🍰",
};

const STEPS = [
  {
    icon: SearchIcon,
    title: "Pick your craving",
    text: "Browse hand-picked restaurants near you and explore their full menus.",
  },
  {
    icon: ReceiptIcon,
    title: "Order in a tap",
    text: "Build your cart, add your address and check out in under a minute.",
  },
  {
    icon: BikeIcon,
    title: "Track to your door",
    text: "Follow every step live — from the kitchen to your doorstep.",
  },
];

export default async function HomePage() {
  const [restaurants, cuisines] = await Promise.all([getPopularRestaurants(6), listCuisines()]);

  return (
    <main>
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden">
        {/* Soft decorative blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-coral-100/70 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-40 h-80 w-80 rounded-full bg-[#EAE4FF]/60 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-18 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-16">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-card">
              🛵 Free delivery on orders over ₹499
            </span>
            <h1 className="mt-6 text-[clamp(2.6rem,6vw,4.2rem)] font-extrabold leading-[1.03] tracking-tight">
              Good food,
              <br />
              <span className="text-coral-500">delivered soft.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
              Your favourite restaurants, one gentle tap away. Minimal ordering, maximum flavour —
              brought to your door warm.
            </p>

            {/* GET form: no client JS needed */}
            <form
              action="/restaurants"
              method="get"
              className="mt-8 flex max-w-lg items-center gap-2 rounded-full bg-white p-2 shadow-soft"
            >
              <span className="pl-3 text-muted">
                <SearchIcon className="h-5 w-5" />
              </span>
              <input
                name="q"
                type="search"
                placeholder="Search restaurants or cuisines…"
                aria-label="Search restaurants or cuisines"
                className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-muted"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-coral-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-coral-600 active:scale-95"
              >
                Find food
              </button>
            </form>

            <dl className="mt-9 flex flex-wrap gap-x-8 gap-y-4">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Restaurants
                </dt>
                <dd className="text-2xl font-extrabold">{restaurants.length * 24}+</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Avg. rating
                </dt>
                <dd className="flex items-center gap-1 text-2xl font-extrabold">
                  4.6 <StarIcon className="h-5 w-5 text-coral-500" />
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Avg. delivery
                </dt>
                <dd className="flex items-center gap-1 text-2xl font-extrabold">
                  <ClockIcon className="h-6 w-6 text-coral-500" /> 28 min
                </dd>
              </div>
            </dl>
          </div>

          {/* Hero image with floating cards */}
          <div className="relative animate-rise [animation-delay:120ms]">
            <div className="overflow-hidden rounded-[2.5rem] shadow-pop">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero-food.jpg"
                alt="A soft flat lay of dishes from TastyTrail restaurants"
                className="h-[340px] w-full object-cover sm:h-[440px]"
              />
            </div>
            <div className="absolute -bottom-5 -left-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-pop sm:-left-8">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-coral-50 text-lg">
                🛵
              </span>
              <div>
                <p className="text-sm font-bold leading-tight">25–35 min</p>
                <p className="text-xs text-muted">Usual delivery time</p>
              </div>
            </div>
            <div className="absolute -top-4 right-2 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-pop sm:right-0">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-leaf-100 text-lg">
                <ChefIcon className="h-5 w-5 text-leaf-500" />
              </span>
              <div>
                <p className="text-sm font-bold leading-tight">Fresh kitchens</p>
                <p className="text-xs text-muted">Cooked to order</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Categories ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-extrabold tracking-tight">What&apos;s on your mind?</h2>
          <Link
            href="/restaurants"
            className="flex items-center gap-1.5 text-sm font-bold text-coral-600 transition hover:gap-2.5"
          >
            See all <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="no-scrollbar mt-6 flex gap-4 overflow-x-auto pb-2">
          {cuisines.map((cuisine) => (
            <Link
              key={cuisine}
              href={`/restaurants?cuisine=${encodeURIComponent(cuisine)}`}
              className="group flex w-24 shrink-0 flex-col items-center gap-3"
            >
              <span
                className="grid h-20 w-20 place-items-center rounded-3xl text-4xl shadow-card transition duration-300 group-hover:-translate-y-1 group-hover:shadow-pop"
                style={{
                  backgroundImage:
                    cuisine === "Indian"
                      ? "linear-gradient(135deg, #FFF3D6, #F5D68A)"
                      : cuisine === "Italian"
                        ? "linear-gradient(135deg, #FFE9D6, #FFC48C)"
                        : cuisine === "Japanese"
                          ? "linear-gradient(135deg, #FFE4EC, #F7AFCB)"
                          : cuisine === "American"
                            ? "linear-gradient(135deg, #FFE7E4, #F7B2A6)"
                            : cuisine === "Desserts"
                              ? "linear-gradient(135deg, #EAE4FF, #C6B8F5)"
                              : "linear-gradient(135deg, #E2F3E4, #A8DDB0)",
                }}
              >
                {CATEGORY_EMOJI[cuisine] ?? "🍽️"}
              </span>
              <span className="text-center text-sm font-bold leading-tight">{cuisine}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------- Popular restaurants ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Loved near you</h2>
            <p className="mt-1 text-sm text-muted">The most-ordered kitchens this week</p>
          </div>
          <Link
            href="/restaurants"
            className="flex items-center gap-1.5 text-sm font-bold text-coral-600 transition hover:gap-2.5"
          >
            See all <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-center text-2xl font-extrabold tracking-tight">
          Three soft steps to dinner
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="rounded-3xl bg-white p-7 text-center shadow-card transition hover:-translate-y-1 hover:shadow-pop"
            >
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-coral-50 text-coral-500">
                <step.icon className="h-7 w-7" />
              </span>
              <p className="mt-5 text-xs font-bold uppercase tracking-widest text-muted">
                Step {index + 1}
              </p>
              <h3 className="mt-1.5 text-lg font-extrabold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
        <div className="overflow-hidden rounded-[2.5rem] bg-ink px-8 py-14 text-center text-cream shadow-pop sm:px-16">
          <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold leading-tight">
            Hungry now? We&apos;ve got you.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-cream/70">
            Fresh meals from the best kitchens in town — delivered in under 30 minutes.
          </p>
          <Link
            href="/restaurants"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-coral-500 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-coral-600 active:scale-95"
          >
            Browse restaurants <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
