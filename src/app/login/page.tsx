// src/app/login/page.tsx
"use client";

import React, { useEffect } from "react";
import { useAuth } from "../components/AuthProvider";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/reports"); // if already logged in, go straight to reports
    }
  }, [user, router]);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to Civic Violation</h1>
      <p className="text-gray-600 mb-6">
        Please sign in with Google to continue
      </p>
      <button
        onClick={login}
        className="px-6 py-2 bg-indigo-600 text-white rounded shadow"
      >
        Login with Google
      </button>
    </div>
  );
}
