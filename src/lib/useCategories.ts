// src/lib/useCategories.ts
"use client";

import useSWR from "swr";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useCategories() {
  const { data, error } = useSWR(`${API_BASE}/api/v1/categories`, fetcher, {
    revalidateOnFocus: false,
  });

  return {
    categories: data?.data || [],
    loading: !data && !error,
    error,
  };
}
