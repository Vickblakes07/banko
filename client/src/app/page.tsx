import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-slate-50 to-slate-100 px-4 dark:from-slate-900 dark:to-slate-950">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-sky-600 dark:text-sky-400">
          Banko
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Banking, simplified.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-slate-600 dark:text-slate-400">
          Sign in to view balances, activity, and secure account tools.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/login"
          className="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        >
          Create account
        </Link>
      </div>
    </main>
  );
}
