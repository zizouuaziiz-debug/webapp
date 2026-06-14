import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: number; name: string; email: string;
  balance: number; pendingBalance: number;
  vipLevel: number; referralCode: string;
  isAdmin: boolean; isBanned: boolean; createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, referralCode?: string) => Promise<void>;
  loginWithGoogle: (credential: string, referralCode?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
const API = "/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("clickearn_token"));

  useEffect(() => {
    if (token) refreshUser();
  }, []);

  async function apiFetch(path: string, init?: RequestInit) {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${API}${path}`, { ...init, headers: { ...headers, ...(init?.headers as any) } });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Request failed");
    }
    return res.json();
  }

  async function login(email: string, password: string) {
    const data = await apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    localStorage.setItem("clickearn_token", data.token);
    setToken(data.token);
    setUser(data.user);
  }

  async function register(name: string, email: string, password: string, referralCode?: string) {
    const data = await apiFetch("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password, referralCode }) });
    localStorage.setItem("clickearn_token", data.token);
    setToken(data.token);
    setUser(data.user);
  }

  async function loginWithGoogle(credential: string, referralCode?: string) {
    const body: any = { credential };
    if (referralCode) body.referralCode = referralCode;
    const data = await fetch(`${API}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(async r => {
      if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.error || "Google sign-in failed"); }
      return r.json();
    });
    localStorage.setItem("clickearn_token", data.token);
    setToken(data.token);
    setUser(data.user);
  }

  async function refreshUser() {
    try {
      const storedToken = localStorage.getItem("clickearn_token");
      if (!storedToken) return;
      const res = await fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${storedToken}` } });
      if (!res.ok) { logout(); return; }
      const u = await res.json();
      setUser(u);
    } catch { logout(); }
  }

  function logout() {
    localStorage.removeItem("clickearn_token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, loginWithGoogle, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
