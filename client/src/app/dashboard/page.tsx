"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { BalanceCard } from "@/components/BalanceCard";
import { TransactionsTable } from "@/components/TransactionsTable";
import { WithdrawModal } from "@/components/WithdrawModal";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function DashboardPage() {
  const { me, meLoading, meError, refreshMe } = useAuth();
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Account summary and recent movements.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => refreshMe()}
              disabled={meLoading}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={() => setWithdrawOpen(true)}
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
            >
              Withdraw
            </button>
          </div>
        </div>

        {meError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
            {meError}{" "}
            <Link href="/login" className="font-semibold underline">
              Sign in again
            </Link>
          </div>
        )}

        {meLoading && !me && (
          <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <LoadingSpinner />
          </div>
        )}

        {me && (
          <>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <BalanceCard account={me.account} />
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-900 dark:shadow-card-dark">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Account details</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Account name
                    </dt>
                    <dd className="mt-0.5 font-medium text-slate-900 dark:text-slate-100">
                      {me.account.accountName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Account number
                    </dt>
                    <dd className="mt-0.5 font-mono text-slate-900 dark:text-slate-100">
                      {me.account.accountNumber.replace(/(.{4})/g, "$1 ").trim()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Member
                    </dt>
                    <dd className="mt-0.5 text-slate-900 dark:text-slate-100">{me.user.fullName}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <TransactionsTable rows={me.transactions} />
          </>
        )}
      </div>

      <WithdrawModal open={withdrawOpen} onClose={() => setWithdrawOpen(false)} />
    </>
  );
}
