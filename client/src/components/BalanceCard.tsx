import type { DashboardAccount } from "@/lib/types";

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function BalanceCard({ account }: { account: DashboardAccount }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-600 to-sky-800 p-6 text-white shadow-lg">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-16 -left-8 h-48 w-48 rounded-full bg-black/10" />
      <div className="relative">
        <p className="text-sm font-medium text-sky-100">Available balance</p>
        <p className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {formatMoney(account.balance, account.currency)}
        </p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-sky-100">
          <div>
            <p className="text-xs uppercase tracking-wide text-sky-200/90">Account</p>
            <p className="font-medium text-white">{account.accountName}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-sky-200/90">Number</p>
            <p className="font-mono text-sm tracking-wide text-white">
              •••• {account.accountNumber.slice(-4)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
