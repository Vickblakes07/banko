"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { LoadingSpinner } from "./LoadingSpinner";

const MESSAGE =
  "Don't withdraw now. Your funds are currently under review. Please try again later.";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function WithdrawModal({ open, onClose }: Props) {
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState<string | null>(null);
  const [notifyError, setNotifyError] = useState<string | null>(null);

  if (!open) return null;

  async function handleNotify() {
    setNotifyLoading(true);
    setNotifyError(null);
    setNotifyMessage(null);
    try {
      const res = await apiFetch<{ success: boolean; message: string }>("/api/account/withdraw-notify", {
        method: "POST",
        body: JSON.stringify({}),
      });
      setNotifyMessage(res.message);
    } catch (e) {
      setNotifyError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setNotifyLoading(false);
    }
  }

  function handleClose() {
    setNotifyMessage(null);
    setNotifyError(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Withdrawal unavailable</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{MESSAGE}</p>
            {notifyMessage && (
              <p className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">{notifyMessage}</p>
            )}
            {notifyError && (
              <p className="mt-3 text-sm font-medium text-rose-600 dark:text-rose-400">{notifyError}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleNotify}
            disabled={notifyLoading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {notifyLoading && <LoadingSpinner className="h-4 w-4 border-white border-t-transparent" />}
            Notify me when available
          </button>
        </div>
      </div>
    </div>
  );
}
