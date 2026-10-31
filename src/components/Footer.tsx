import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-white/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-coral-400 to-coral-600 text-lg text-white"
            >
              🍜
            </span>
            <span className="text-lg font-extrabold tracking-tight">TastyTrail</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Soft, simple food delivery. We bring your favourite restaurants to your door — warm,
            fresh and on time.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold">Discover</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li>
              <Link href="/restaurants" className="transition hover:text-coral-600">
                All restaurants
              </Link>
            </li>
            <li>
              <Link href="/restaurants?cuisine=Italian" className="transition hover:text-coral-600">
                Italian
              </Link>
            </li>
            <li>
              <Link href="/restaurants?cuisine=Indian" className="transition hover:text-coral-600">
                Indian
              </Link>
            </li>
            <li>
              <Link href="/restaurants?cuisine=Japanese" className="transition hover:text-coral-600">
                Japanese
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold">Account</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li>
              <Link href="/orders" className="transition hover:text-coral-600">
                Your orders
              </Link>
            </li>
            <li>
              <Link href="/cart" className="transition hover:text-coral-600">
                Cart
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold">Support</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li>help@tastytrail.app</li>
            <li>+91 98765 43210</li>
            <li>Mon–Sun, 9am – 11pm</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line px-4 py-5 text-center text-xs text-muted sm:px-6">
        © {new Date().getFullYear()} TastyTrail. Crafted with 🧡 for people who love good food.
      </div>
    </footer>
  );
}
