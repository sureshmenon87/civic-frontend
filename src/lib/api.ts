// src/lib/api.ts
import { getAccessToken, saveAccessToken, clearAccessToken } from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export async function tryRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include", // must include cookie
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data?.accessToken) {
      saveAccessToken(data.accessToken);
      return true;
    }
  } catch {}
  return false;
}

export async function apiFetch(path: string, opts: RequestInit = {}) {
  const headers = new Headers(opts.headers || {});
  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    const ok = await tryRefresh();
    if (ok) {
      const newToken = getAccessToken();
      if (newToken) headers.set("Authorization", `Bearer ${newToken}`);
      res = await fetch(`${API_BASE}${path}`, {
        ...opts,
        headers,
        credentials: "include",
      });
    } else {
      clearAccessToken();
    }
  }

  return res;
}
