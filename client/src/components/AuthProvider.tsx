"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { clearToken, getToken, setToken as persistToken } from "@/lib/auth-storage";
import { apiFetch } from "@/lib/api";
import type { MeResponse } from "@/lib/types";

type AuthUser = { id: string; email: string; fullName: string };

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  me: MeResponse | null;
  hydrated: boolean;
  meLoading: boolean;
  meError: string | null;
  refreshMe: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [meLoading, setMeLoading] = useState(false);
  const [meError, setMeError] = useState<string | null>(null);

  const refreshMe = useCallback(async () => {
    const t = getToken();
    if (!t) {
      setMe(null);
      setUser(null);
      return;
    }
    setMeLoading(true);
    setMeError(null);
    try {
      const data = await apiFetch<MeResponse>("/api/account/me", { method: "GET" });
      setMe(data);
      setUser(data.user);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load account";
      setMeError(msg);
      setMe(null);
      setUser(null);
      clearToken();
      setTokenState(null);
    } finally {
      setMeLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = getToken();
    setTokenState(t);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !token) return;
    refreshMe();
  }, [hydrated, token, refreshMe]);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await apiFetch<{ token: string; user: AuthUser }>("/api/auth/login", {
        method: "POST",
        auth: false,
        body: JSON.stringify({ email, password }),
      });
      persistToken(data.token);
      setTokenState(data.token);
      setUser(data.user);
      router.push("/dashboard");
    },
    [router]
  );

  const register = useCallback(
    async (fullName: string, email: string, password: string) => {
      const data = await apiFetch<{ token: string; user: AuthUser }>("/api/auth/register", {
        method: "POST",
        auth: false,
        body: JSON.stringify({ fullName, email, password }),
      });
      persistToken(data.token);
      setTokenState(data.token);
      setUser(data.user);
      router.push("/dashboard");
    },
    [router]
  );

  const logout = useCallback(() => {
    clearToken();
    setTokenState(null);
    setUser(null);
    setMe(null);
    router.push("/login");
  }, [router]);

  const value = useMemo(
    () => ({
      token,
      user,
      me,
      hydrated,
      meLoading,
      meError,
      refreshMe,
      login,
      register,
      logout,
    }),
    [token, user, me, hydrated, meLoading, meError, refreshMe, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
