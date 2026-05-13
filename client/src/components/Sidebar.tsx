"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "./AuthProvider";

const nav = [{ href: "/dashboard", label: "Overview" }];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="flex w-full flex-col border-b border-slate-200 bg-white lg:h-screen lg:w-64 lg:border-b-0 lg:border-r dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3 px-4 py-4 lg:flex-col lg:items-stretch lg:px-5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 text-sm font-bold text-white">
            B
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Banko</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Private banking</p>
          </div>
        </Link>
        <div className="flex items-center gap-2 lg:justify-between">
          <ThemeToggle />
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-2 pb-2 lg:flex-col lg:px-3 lg:pb-0">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-sky-50 text-sky-800 dark:bg-sky-950/50 dark:text-sky-200"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden border-t border-slate-200 p-4 dark:border-slate-700 lg:block">
        <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
          {user?.fullName ?? "Member"}
        </p>
        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
        <button
          type="button"
          onClick={logout}
          className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Log out
        </button>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-slate-200 px-4 py-3 lg:hidden dark:border-slate-700">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{user?.fullName}</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium dark:border-slate-600"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
