"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { getToken } from "@/lib/auth-storage";
import { ApiError } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const { hydrated, register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!hydrated) return;
    if (getToken()) router.replace("/dashboard");
  }, [hydrated, router]);

  function validate() {
    const next: Record<string, string> = {};
    if (fullName.trim().length < 2) next.fullName = "Please enter your full name";
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email";
    if (password.length < 8) next.password = "Use at least 8 characters";
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      await register(fullName.trim(), email.trim(), password);
    } catch (err) {
      if (err instanceof ApiError && err.body?.errors?.length) {
        setError(err.body.errors.map((x) => x.msg).join(". "));
      } else {
        setError(err instanceof Error ? err.message : "Could not create account");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-card dark:border-slate-700 dark:bg-slate-900 dark:shadow-card-dark">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-sky-600 dark:text-sky-400">Banko</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Open your account</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Create credentials to access the dashboard.</p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-200">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-500/30 transition focus:ring-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            {fieldErrors.fullName && <p className="mt-1 text-xs text-rose-600">{fieldErrors.fullName}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-500/30 transition focus:ring-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            {fieldErrors.email && <p className="mt-1 text-xs text-rose-600">{fieldErrors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-500/30 transition focus:ring-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            {fieldErrors.password && <p className="mt-1 text-xs text-rose-600">{fieldErrors.password}</p>}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-70"
          >
            {submitting && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {submitting ? "Creating…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
