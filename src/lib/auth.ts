// src/lib/auth.ts
export const ACCESS_TOKEN_KEY = "civic_access_token";

export function saveAccessToken(token: string) {
  try {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch {}
}

export function getAccessToken(): string | null {
  try {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function clearAccessToken() {
  try {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {}
}
