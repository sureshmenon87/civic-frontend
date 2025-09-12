"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type ReportPhoto = {
  key: string;
  thumbKey?: string;
  url?: string | null;
  mime?: string;
};

type Report = {
  _id: string;
  title: string;
  description?: string;
  photos?: ReportPhoto[];
  reporterId?: string;
  categories?: string[];
  createdAt: string;
  // add any other fields your API returns
};

type ApiResponse = {
  data: Report[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
};

const DEFAULT_LIMITS = [6, 8, 12];
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

function parseNumber(v: string | null, fallback: number) {
  if (!v) return fallback;
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export default function ReportList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // read from query params (strings)
  const qpPage = searchParams.get("page");
  const qpLimit = searchParams.get("limit");
  const qpSort = searchParams.get("sort") || "newest";
  const qpCat = searchParams.get("cat") || "all";

  const page = parseNumber(qpPage, 1);
  const limit = parseNumber(qpLimit, 8);
  const sort = qpSort;
  const catFilter = qpCat;

  const [reports, setReports] = useState<Report[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // helper to set query params (keeps other params unless overridden)
  const setQuery = useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      Object.entries(updates).forEach(([k, v]) => {
        if (v === null || v === undefined) params.delete(k);
        else params.set(k, String(v));
      });
      // push new URL preserving route path
      const newQuery = params.toString();
      router.push(`/reports${newQuery ? `?${newQuery}` : ""}`);
    },
    [router, searchParams]
  );

  // fetch function
  const load = useCallback(async () => {
    // cancel previous
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const ac = new AbortController();
    abortRef.current = ac;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      params.set("sort", sort);
      if (catFilter && catFilter !== "all") params.set("category", catFilter);

      const url = `${API_BASE}/api/v1/reports?${params.toString()}`;
      const res = await fetch(url, {
        signal: ac.signal,
        credentials: "include",
      });
      if (!res.ok) {
        // handle errors gracefully
        console.error("Failed to fetch reports", res.status);
        setReports([]);
        setTotal(null);
        return;
      }
      const json: ApiResponse = await res.json();
      setReports(json.data || []);
      setTotal(json.meta?.total ?? null);
    } catch (err: any) {
      if (err?.name === "AbortError") {
        // aborted
      } else {
        console.error("load reports error", err);
      }
    } finally {
      setLoading(false);
    }
  }, [page, limit, sort, catFilter]);

  // initial + when query params change
  useEffect(() => {
    load();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [load]);

  // auto-refresh every 60s if enabled
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => {
      load();
    }, 60000);
    return () => clearInterval(id);
  }, [autoRefresh, load]);

  // pagination helpers
  const goToPage = (p: number) => setQuery({ page: p });
  const nextPage = () => goToPage(page + 1);
  const prevPage = () => goToPage(Math.max(1, page - 1));

  // change sort or limit: reset to page 1
  const onChangeLimit = (newLimit: number) =>
    setQuery({ limit: newLimit, page: 1 });
  const onChangeSort = (newSort: string) =>
    setQuery({ sort: newSort, page: 1 });
  const onChangeCat = (newCat: string) => setQuery({ cat: newCat, page: 1 });

  // small helpers for rendering image (thumb fallback to key)
  const photoUrl = (p?: ReportPhoto) => {
    if (!p) return "/placeholder-200.png";
    // prefer thumbKey if available
    const key = p.thumbKey ?? p.key ?? null;
    if (!key) return "/placeholder-200.png";
    return `${API_BASE}/api/v1/reports/download/${encodeURIComponent(key)}`;
  };

  const totalPages = total ? Math.max(1, Math.ceil(total / limit)) : 1;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => load()}
            className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
            aria-label="Refresh reports"
          >
            Refresh
          </button>

          <label className="text-sm flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            <span className="select-none">Auto-refresh</span>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={sort}
            onChange={(e) => onChangeSort(e.target.value)}
            className="border rounded p-1"
            aria-label="Sort"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="nearest">Nearest</option>
          </select>

          <select
            value={String(limit)}
            onChange={(e) => onChangeLimit(parseInt(e.target.value, 10))}
            className="border rounded p-1"
            aria-label="Page size"
          >
            {DEFAULT_LIMITS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* filters - category quick pills */}
      <div className="mb-4 flex flex-wrap gap-2">
        {[
          "all",
          "other",
          "roads",
          "sanitation",
          "street-lighting",
          "water",
        ].map((c) => (
          <button
            key={c}
            onClick={() => onChangeCat(c)}
            className={`px-3 py-1 rounded ${
              catFilter === c ? "bg-indigo-600 text-white" : "bg-white border"
            }`}
          >
            {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {/* reports grid */}
      <div>
        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20">No reports found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((r) => (
              <article
                key={r._id}
                className="bg-white rounded shadow p-4 flex gap-4 items-start"
              >
                <Link href={`/reports/${r._id}`}>
                  <img
                    src={photoUrl(r.photos?.[0])}
                    alt={r.title}
                    className="w-28 h-20 object-cover rounded"
                    style={{ minWidth: 112 }}
                  />
                </Link>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <Link
                      href={`/reports/${r._id}`}
                      className="font-semibold text-lg underline"
                    >
                      {r.title}
                    </Link>
                    {/* small avatar & delete icon would go here (conditioned on user) */}
                  </div>

                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(r.createdAt).toLocaleString()}
                  </div>
                  <p className="mt-2 text-gray-700">{r.description}</p>

                  <div className="mt-3 flex items-center gap-2">
                    {(r.categories || []).slice(0, 3).map((c) => (
                      <span
                        key={c}
                        className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs"
                      >
                        {c}
                      </span>
                    ))}

                    <span className="text-sm text-gray-500 ml-auto">
                      {/* comment count placeholder; replace with actual count */}
                      <svg
                        className="inline-block w-4 h-4 mr-1"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M20 2H4a2 2 0 0 0-2 2v15.17l4-4H20a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"
                        />
                      </svg>
                      0
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Page {page} of {totalPages}
          {total !== null && <span className="ml-3">({total} reports)</span>}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              try {
                sessionStorage.setItem(
                  "reportsScroll",
                  String(window.scrollY || 0)
                );
              } catch {}
              prevPage();
            }}
            disabled={page <= 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <button
            onClick={() => {
              try {
                sessionStorage.setItem(
                  "reportsScroll",
                  String(window.scrollY || 0)
                );
              } catch {}
              nextPage();
            }}
            disabled={page >= totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
