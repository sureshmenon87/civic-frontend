"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ReportBack() {
  const router = useRouter();
  const sp = useSearchParams();

  const goBackToList = () => {
    // prefer browser history
    if (window.history.length > 1) {
      router.back();
      return;
    }
    // fallback push with query state
    const page = sp.get("page");
    const limit = sp.get("limit");
    const sort = sp.get("sort");
    const cat = sp.get("cat");
    const params = new URLSearchParams();
    if (page) params.set("page", page);
    if (limit) params.set("limit", limit);
    if (sort) params.set("sort", sort);
    if (cat) params.set("cat", cat);
    router.push(`/reports${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <button
      onClick={goBackToList}
      aria-label="Back to reports"
      className="inline-flex items-center gap-2 px-2 py-1 border rounded bg-white hover:bg-gray-50"
    >
      {/* simple left-arrow icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M7.707 14.707a1 1 0 0 1-1.414 0L1.586 10l4.707-4.707a1 1 0 0 1 1.414 1.414L4.414 10l3.293 3.293a1 1 0 0 1 0 1.414z"
          clipRule="evenodd"
        />
      </svg>
      Back
    </button>
  );
}
