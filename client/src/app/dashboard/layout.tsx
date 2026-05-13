"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth-storage";
import { useAuth } from "@/components/AuthProvider";
import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { hydrated } = useAuth();

  useEffect(() => {
    if (!hydrated) return;
    if (!getToken()) router.replace("/login");
  }, [hydrated, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
      </div>
    );
  }

  if (!getToken()) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row dark:bg-slate-950">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </div>
    </div>
  );
}
