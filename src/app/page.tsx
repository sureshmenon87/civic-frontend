// src/app/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./components/AuthProvider";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  const handlePrimary = () => {
    if (user) {
      router.push("/reports");
    } else {
      router.push("/login");
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center">
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* left: content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Civic Violation
            </h1>
            <p className="text-lg text-slate-600 mb-6">
              Report civic issues quickly — take a photo, add a location, and
              track resolution. Help your community get things fixed faster.
            </p>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-indigo-50 text-indigo-600 font-semibold">
                  ✓
                </span>
                <span className="text-sm text-slate-700">
                  Quick reporting — create a report in seconds
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-indigo-50 text-indigo-600 font-semibold">
                  ✓
                </span>
                <span className="text-sm text-slate-700">
                  Attach photos and exact location
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-indigo-50 text-indigo-600 font-semibold">
                  ✓
                </span>
                <span className="text-sm text-slate-700">
                  Track status and history
                </span>
              </li>
            </ul>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrimary}
                className="px-6 py-3 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                Get started
              </button>

              <button
                onClick={() => router.push("/secondary")}
                className="px-4 py-2 border rounded text-sm text-slate-700 hover:bg-slate-100"
                aria-label="Learn how it works"
              >
                Learn how it works
              </button>
            </div>
          </div>

          {/* right: illustrative card or screenshot */}
          <div className="flex items-center justify-center">
            {/* For a quick demo use an image placeholder or a small UI mock */}
            <div className="w-full max-w-md bg-white rounded-xl shadow p-4">
              <div className="h-44 bg-gray-50 rounded mb-3 flex items-center justify-center text-sm text-gray-400">
                App preview / screenshot
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-5/6" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* Optional: small footer note */}
        <p className="mt-12 text-sm text-slate-500 text-center">
          Built for fast, auditable civic reporting — demo backend at{" "}
          <span className="font-mono">http://localhost:4000</span>
        </p>
      </section>
    </main>
  );
}
