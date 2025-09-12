// src/app/reports/create/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Protected from "@/app/components/Protected";
import CategorySelect from "@/app/components/CategorySelect";
import { useAuth } from "@/app/components/AuthProvider";
import { apiFetch } from "@/lib/api";

export default function CreateReportPageWrapper() {
  // wrap with Protected so only authenticated users can access
  return (
    <Protected>
      <CreateReportPage />
    </Protected>
  );
}

function CreateReportPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [lng, setLng] = useState("");
  const [lat, setLat] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // basic client-side validation
    if (!title.trim()) return setError("Title is required");
    if (!lng || !lat) return setError("Location (lng/lat) is required");
    if (!categories || categories.length === 0)
      return setError("Please select at least one category");

    setLoading(true);
    try {
      const fd = new FormData();
      // simple scalar fields
      fd.append("title", title.trim());
      fd.append("description", description.trim());
      fd.append("locationLng", String(lng));
      fd.append("locationLat", String(lat));
      // categories as JSON string (server should JSON.parse if necessary)
      fd.append("categories", JSON.stringify(categories));
      // file field name must match multer config ("file")
      if (file) fd.append("file", file);

      const res = await apiFetch("/api/v1/reports", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error || `Create failed (${res.status})`);
        setLoading(false);
        return;
      }

      // success - redirect to reports list
      router.push("/reports");
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Create Report</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded shadow p-6 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="e.g. Garbage piled near park"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={4}
            placeholder="Optional details for the authority"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Categories</label>
          <CategorySelect value={categories} onChange={setCategories} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Longitude</label>
            <input
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="77.58"
              inputMode="decimal"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Latitude</label>
            <input
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="12.97"
              inputMode="decimal"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Photo (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create report"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/reports")}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
        </div>

        <div className="text-xs text-gray-500 mt-2">
          Reporting as:{" "}
          <span className="font-medium">{user?.name ?? "Unknown"}</span>
        </div>
      </form>
    </main>
  );
}
