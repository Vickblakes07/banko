import type { DashboardTransaction } from "@/lib/types";

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Math.abs(amount));
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function TransactionsTable({ rows }: { rows: DashboardTransaction[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400">
        No transactions yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card dark:border-slate-700 dark:bg-slate-900 dark:shadow-card-dark">
      <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Recent activity</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Latest credits and debits</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((t) => {
              const isCredit = t.type === "credit";
              return (
                <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-300">
                    {formatDate(t.date)}
                  </td>
                  <td className="px-4 py-3 text-slate-900 dark:text-slate-100">{t.description}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        isCredit
                          ? "rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                          : "rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
                      }
                    >
                      {isCredit ? "Credit" : "Debit"}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-medium tabular-nums ${
                      isCredit ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {isCredit ? "+" : "−"}
                    {formatMoney(t.amount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
