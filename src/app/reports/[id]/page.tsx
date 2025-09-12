// src/app/reports/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import ReportCard from "@/app/components/ReportCard";
import ImageModal from "@/app/components/ImageModal";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/app/components/AuthProvider";
import { FaTrashAlt } from "react-icons/fa"; // icon for delete

export default function ReportDetailPage() {
  const params = useParams() as { id: string };
  const id = params.id;
  const [report, setReport] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageOpen, setImageOpen] = useState<{ url: string | null }>({
    url: null,
  });
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    load();
  }, [id]);

  async function load() {
    setLoading(true);
    const res = await apiFetch(`/api/v1/reports/${id}`);
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const json = await res.json();
    setReport(json.data.report || json.data);
    // load comments
    const cRes = await apiFetch(`/api/v1/comments/report/${id}`);
    if (cRes.ok) {
      const cj = await cRes.json();
      setComments(cj.data || []);
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm("Delete report?")) return; // you wanted an icon; for UX replace with modal if needed
    const res = await apiFetch(`/api/v1/reports/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/reports");
    else alert("Delete failed");
  }

  async function postComment(text: string) {
    const res = await apiFetch(`/api/v1/comments/report/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      const j = await res.json();
      setComments((s) => [...s, j.data]);
    } else {
      alert("Comment failed");
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;
  if (!report) return <div className="p-6">Not found</div>;

  const photo = report.photos?.[0];
  const key = photo?.key || photo?._id || photo?.filename || null;
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "";
  const imgUrl = key
    ? `${apiBase}/api/v1/reports/download/${encodeURIComponent(key)}`
    : null;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-xl font-semibold">{report.title}</h1>
        <div className="flex gap-2 items-center">
          {/* delete icon */}
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800"
            title="Delete"
          >
            <FaTrashAlt />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="mb-3 text-sm text-gray-700">{report.description}</div>

          {imgUrl ? (
            <img
              src={imgUrl}
              alt="photo"
              className="w-full rounded cursor-pointer"
              onClick={() => setImageOpen({ url: imgUrl })}
            />
          ) : (
            <div className="w-full h-48 bg-gray-100 rounded flex items-center justify-center">
              no image
            </div>
          )}
        </div>

        <div>
          <div className="h-64 rounded overflow-hidden border">
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
              >
                <Popup>{report.title}</Popup>
              </Marker>
            </MapContainer>
          </div>

          <div className="mt-3">
            <div className="text-sm text-gray-600 mb-2">
              Categories: {report.categories?.join(", ")}
            </div>
            <div className="text-sm text-gray-500">
              Posted: {new Date(report.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <section className="bg-white rounded p-4">
        <h3 className="font-semibold mb-2">Comments ({comments.length})</h3>
        <CommentList comments={comments} />
        <CommentForm onSubmit={postComment} />
      </section>

      <ImageModal
        url={imageOpen.url}
        onClose={() => setImageOpen({ url: null })}
      />
    </main>
  );
}

// small CommentList + Form components
function CommentList({ comments }: { comments: any[] }) {
  if (!comments.length)
    return <div className="text-sm text-gray-500">No comments</div>;
  return (
    <div className="space-y-2 mb-3">
      {comments.map((c) => (
        <div key={c._id} className="border rounded p-2">
          <div className="text-sm font-medium">
            {c.name || (c.userId ? "User" : "Anonymous")}
          </div>
          <div className="text-sm text-gray-700">{c.text}</div>
          <div className="text-xs text-gray-400">
            {new Date(c.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}

function CommentForm({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSubmit(text.trim());
        setText("");
      }}
    >
      <textarea
        className="w-full border rounded p-2 mb-2"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-end">
        <button className="px-3 py-1 bg-indigo-600 text-white rounded">
          Post comment
        </button>
      </div>
    </form>
  );
}
