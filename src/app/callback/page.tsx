// src/app/callback/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { tryRefresh } from "../../lib/api";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const ok = await tryRefresh(); // POST /auth/refresh (uses cookie)
      if (ok) {
        router.replace("/");
      } else {
        router.replace("/"); // failed, go back to login
      }
    })();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-medium">Signing you in…</h3>
        <p className="text-sm text-slate-500 mt-2">
          If nothing happens, close this window and try again.
        </p>
      </div>
    </div>
  );
}
