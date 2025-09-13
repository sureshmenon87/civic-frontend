// src/app/reports/[id]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import DeleteModal from "@/app/components/DeleteModal";
import Avatar from "@/app/components/Avatar";
import ImageModal from "@/app/components/ImageModal";
import { apiFetch } from "@/lib/api";
import CommentItem from "@/app/components/CommentItem";
import ReportBack from "../ReportBack";
import CommentBox from "@/app/components/CommentBox";

export default function ReportDetailPage() {
  const params = useParams() as { id: string };
  const id = params.id;
  const router = useRouter();

  const [report, setReport] = useState<any | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageOpen, setImageOpen] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function load() {
    setLoading(true);
    const r = await apiFetch(`/api/v1/reports/${id}`);
    if (!r.ok) {
      setLoading(false);
      return;
    }
    const j = await r.json();
    const rep = j.data?.report || j.data;
    setReport(rep);

    const c = await apiFetch(`/api/v1/comments/report/${id}`);
    if (c.ok) {
      const cj = await c.json();
      setComments(cj.data || []);
    }

    setLoading(false);
  }

  function goBack() {
    // back to reports but keep scroll position (list page reads sessionStorage)
    router.back();
  }

  async function handleDeleteConfirm() {
    const res = await apiFetch(`/api/v1/reports/${id}`, { method: "DELETE" });
    if (res.ok) {
      // clear session scroll? optional
      router.push("/reports");
    } else {
      alert("Delete failed");
    }
  }

  async function handleCommentUpdated(updated: any) {
    setComments((s) => s.map((c) => (c._id === updated._id ? updated : c)));
  }

  async function handleCommentDeleted(deletedId: string) {
    setComments((s) => s.filter((c) => c._id !== deletedId));
  }

  if (loading) return <div className="p-6">Loading...</div>;
  if (!report) return <div className="p-6">Not found</div>;

  const photo = report.photos?.[0];
  const key = photo?.key || photo?._id || photo?.filename || null;
  const imgUrl = key
    ? `${
        process.env.NEXT_PUBLIC_API_BASE
      }/api/v1/reports/download/${encodeURIComponent(key)}`
    : null;

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <ReportBack />
          <h1 className="text-2xl font-semibold">{report.title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <Avatar
            src={report.reporterAvatar}
            name={report.reporterName}
            size={36}
            proxy={true}
          />
          <button
            className="text-red-600"
            onClick={() => setConfirmDeleteOpen(true)}
            title="Delete"
          >
            🗑
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={report.title}
              className="w-full rounded-md object-cover max-h-[420px]"
              onClick={() => setImageOpen(imgUrl)}
            />
          ) : (
            <div className="w-full h-72 bg-gray-100 rounded" />
          )}
          <p className="mt-3 text-gray-700">{report.description}</p>
        </div>

        <div>
          <div className="h-64 rounded border overflow-hidden">
            <MapContainer
              center={[
                report.location.coordinates[1],
                report.location.coordinates[0],
              ]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker
                position={[
                  report.location.coordinates[1],
                  report.location.coordinates[0],
                ]}
              />
            </MapContainer>
          </div>

          <div className="mt-3 text-sm text-gray-600">
            Categories: {report.categories?.join(", ")}
          </div>
          <div className="mt-1 text-sm text-gray-600">
            Posted: {new Date(report.createdAt).toLocaleString()}
          </div>
        </div>
      </div>
      <CommentBox reportId={report._id} />

      <section className="bg-white rounded p-4">
        <h3 className="font-semibold">Comments ({comments.length})</h3>
        <div className="mt-3 space-y-3">
          {comments.map((c) => (
            <CommentItem
              key={c._id}
              comment={c}
              onUpdated={handleCommentUpdated}
              onDeleted={handleCommentDeleted}
            />
          ))}

          {/* Add a simple comment form if required (or reuse existing) */}
        </div>
      </section>

      <ImageModal url={imageOpen} onClose={() => setImageOpen(null)} />
      <DeleteModal
        open={confirmDeleteOpen}
        title="Delete report"
        message="Are you sure you want to delete this report? This action is irreversible."
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={() => handleDeleteConfirm()}
      />
    </main>
  );
}
