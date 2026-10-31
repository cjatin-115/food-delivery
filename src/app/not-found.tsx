import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto grid max-w-xl place-items-center px-4 py-28 text-center sm:px-6">
      <span className="text-6xl">🍽️</span>
      <h1 className="mt-6 text-4xl font-extrabold tracking-tight">Nothing on the menu here</h1>
      <p className="mt-3 text-muted">
        The page you were looking for doesn&apos;t exist — but plenty of good food does.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-coral-500 px-7 py-3.5 text-sm font-bold text-white shadow-soft transition hover:bg-coral-600 active:scale-95"
      >
        Back to home
      </Link>
    </main>
  );
}
