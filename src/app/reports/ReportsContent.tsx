"use client";
import React, { useEffect, useState } from "react";
import ReportCard from "../components/ReportCard";
import { useCategories } from "@/lib/useCategories";
import { useAuth } from "../components/AuthProvider";
import { apiFetch } from "@/lib/api";

export default function ReportsPage() {
  const { user, loading } = useAuth();
  const { categories } = useCategories();
  const [reports, setReports] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [sort, setSort] = useState("newest");
  const [catFilter, setCatFilter] = useState<string | "">("");
  const [loadingList, setLoadingList] = useState(false);
  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    if (!loading) load();
  }, [loading, page, limit, sort, catFilter]);

  async function load() {
    setLoadingList(true);
    try {
      const q = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sort,
      });
      if (catFilter) q.set("category", catFilter);
      const res = await apiFetch(`/api/v1/reports?${q.toString()}`);
      const json = await res.json();
      setReports(json.data || []);
      setMeta(json.meta || null);
    } catch (err) {
      console.error(err);
      setReports([]);
    } finally {
      setLoadingList(false);
    }
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Reports</h1>
        <div className="flex gap-3 items-center">
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="border rounded p-1"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded p-1"
          >
            <option value={6}>6</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCatFilter("")}
            className={`px-2 py-1 rounded text-sm ${
              catFilter === "" ? "bg-indigo-600 text-white" : "bg-white"
            }`}
          >
            All
          </button>
          {categories.map((c: any) => (
            <button
              key={c.key}
              onClick={() => setCatFilter(c.key)}
              className={`px-2 py-1 rounded text-sm ${
                catFilter === c.key ? "bg-indigo-600 text-white" : "bg-white"
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      {loadingList ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded shadow p-4 h-44 animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((r) => (
            <ReportCard
              key={r._id}
              report={r}
              onDeleted={(id) =>
                setReports((prev) => prev.filter((x) => x._id !== id))
              }
            />
          ))}
        </div>
      )}

      {meta && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {meta.page} of {meta.pages}
          </div>
          <div className="flex gap-2">
            <button
              disabled={meta.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 border rounded"
            >
              Prev
            </button>
            <button
              disabled={meta.page >= meta.pages}
              onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
              className="px-3 py-1 border rounded"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
