// src/app/components/CategorySelect.tsx
"use client";

import React from "react";
import { useCategories } from "@/lib/useCategories";

export default function CategorySelect({
  value = [],
  onChange,
}: {
  value?: string[];
  onChange: (val: string[]) => void;
}) {
  const { categories, loading, error } = useCategories();

  // categories: array of { key, title, description? }
  const toggle = (k: string) => {
    if (value.includes(k)) onChange(value.filter((v) => v !== k));
    else onChange([...value, k]);
  };

  if (loading)
    return <div className="text-sm text-gray-500">Loading categories…</div>;
  if (error)
    return (
      <div className="text-sm text-red-600">Failed to load categories</div>
    );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {categories.map((c: any) => {
          const active = value.includes(c.key);
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => toggle(c.key)}
              className={`px-3 py-1 rounded-full border text-sm transition ${
                active
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-700"
              }`}
              title={c.description || ""}
            >
              {c.title}
            </button>
          );
        })}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Select one or more categories
      </div>
    </div>
  );
}
