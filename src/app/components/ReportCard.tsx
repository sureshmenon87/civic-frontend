// src/app/components/ReportCard.tsx
"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { apiFetch } from "@/lib/api"; // adjust path if needed
import DeleteModal from "./DeleteModal";
import { FaTrashAlt } from "react-icons/fa";

type Report = {
  _id: string;
  title: string;
  description?: string;
  photos?: any[]; // might be string[] or object[]
  createdAt: string;
  reporterId?: string;
};

export default function ReportCard({
  report,
  onDeleted,
}: {
  report: Report;
  onDeleted?: (id: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [imgErrored, setImgErrored] = useState(false);

  const rawPhoto = report.photos?.[0];
  const imgKey = (() => {
    if (!rawPhoto) return null;
    if (typeof rawPhoto === "string") return rawPhoto; // if stored as string
    if (rawPhoto.key) return String(rawPhoto.key); // prefer key
    if (rawPhoto._id) return String(rawPhoto._id);
    if (rawPhoto.id) return String(rawPhoto.id);
    if (rawPhoto.filename) return String(rawPhoto.filename);
    return null;
  })();
  const apiBase = (process.env.NEXT_PUBLIC_API_BASE || "") as string;
  const photoUrl = imgKey
    ? `${apiBase}/api/v1/reports/download/${encodeURIComponent(imgKey)}`
    : null;

  async function handleConfirmDelete() {
    setDeleting(true);
    try {
      const res = await apiFetch(`/api/v1/reports/${report._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        alert(body?.error || `Delete failed: ${res.status}`);
      } else {
        onDeleted?.(report._id);
      }
    } catch (err: any) {
      alert(err.message || "Network error");
    } finally {
      setDeleting(false);
      setModalOpen(false);
    }
  }

  return (
    <article className="bg-white rounded-xl shadow p-4 flex gap-4 items-start">
      {photoUrl && !imgErrored ? (
        <img
          src={photoUrl}
          alt="photo"
          className="w-32 h-32 object-cover rounded"
          onError={() => setImgErrored(true)}
        />
      ) : (
        <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-400">
          no photo
        </div>
      )}

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{report.title}</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(report.createdAt), "PPpp")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              title="Delete"
              onClick={() => setModalOpen(true)}
              className="text-red-600 hover:text-red-800"
            >
              <FaTrashAlt />
            </button>
          </div>
        </div>

        <p className="mt-2 text-gray-700">{report.description}</p>
      </div>

      <DeleteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Delete report"
        description="Are you sure you want to delete this report? This cannot be undone."
      />
    </article>
  );
}
