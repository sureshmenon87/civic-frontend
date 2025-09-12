// src/app/components/ReportCard.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import ImageModal from "./ImageModal";
import Avatar from "./Avatar";
import { FaTrashAlt, FaCommentAlt } from "react-icons/fa";
import { useAuth } from "./AuthProvider";

export default function ReportCard({
  report,
  onDelete,
}: {
  report: any;
  onDelete?: (id: string) => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const photo = report.photos?.[0];
  const key = photo?.key || photo?._id || photo?.filename || null;
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "";
  const imgUrl = key
    ? `${apiBase}/api/v1/reports/download/${encodeURIComponent(key)}`
    : null;

  const { user } = useAuth();
  const canDelete =
    user && (user.sub === report.reporterId || user.role === "admin");

  return (
    <>
      <article className="bg-white rounded-lg shadow-sm overflow-hidden flex gap-4 p-4 items-start hover:shadow-md transition">
        {/* thumbnail */}
        <div className="w-28 h-28 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={report.title}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setOpen(imgUrl)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>

        {/* content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <Link
                href={`/reports/${report._id}`}
                className="text-lg font-semibold hover:underline"
              >
                {report.title}
              </Link>
              {/* date (not a link, no underline) */}
              <div className="text-sm text-gray-500 mt-1">
                {new Date(report.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* avatar small */}
              <Avatar
                src={report.reporterAvatar}
                name={report.reporterName}
                size={36}
                className="ring-1 ring-white"
              />
              {canDelete && (
                <button
                  onClick={() => onDelete?.(report._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrashAlt />
                </button>
              )}
            </div>
          </div>

          {/* description — no underline, truncated */}
          <p className="text-sm text-gray-700 mt-3 line-clamp-2">
            {report.description}
          </p>

          {/* chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            {Array.isArray(report.categories) &&
              report.categories.map((c: string) => (
                <span
                  key={c}
                  className="inline-block text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100"
                >
                  {formatCategoryTitle(c)}
                </span>
              ))}
          </div>

          {/* footer: comment count, etc */}
          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaCommentAlt className="text-gray-500" />
              <span>{report.commentsCount ?? 0}</span>
            </div>
          </div>
        </div>
      </article>

      <ImageModal url={open} onClose={() => setOpen(null)} />
    </>
  );
}

function formatCategoryTitle(raw: string) {
  if (!raw) return raw;
  const replaced = raw.replace(/[-_]/g, " ");
  const words = replaced.match(/[A-Za-z0-9]+/g) || [];
  return words.map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}
