// src/app/components/CommentItem.tsx
"use client";
import React, { useState } from "react";
import DeleteModal from "./DeleteModal";
import { apiFetch } from "@/lib/api"; // ensure this exists
import { useAuth } from "./AuthProvider";

type CommentProps = {
  comment: {
    _id: string;
    text: string;
    userId?: string | null;
    name?: string | null;
    createdAt: string;
  };
  onUpdated?: (c: any) => void;
  onDeleted?: (id: string) => void;
};

export default function CommentItem({
  comment,
  onUpdated,
  onDeleted,
}: CommentProps) {
  const { user } = useAuth(); // expects { user: { sub, role, name, ... } } or null
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(comment.text);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const currentUserId = user?.sub;
  const currentUserRole = user?.role;
  const canEdit =
    currentUserId && String(comment.userId) === String(currentUserId);
  const canDelete = canEdit || currentUserRole === "admin";

  async function saveEdit() {
    if (!text.trim()) return alert("Comment can't be empty");
    setSaving(true);
    try {
      const res = await apiFetch(`/api/v1/comments/${comment._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Failed");
      const j = await res.json();
      onUpdated?.(j.data || j);
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function doDelete() {
    try {
      const res = await apiFetch(`/api/v1/comments/${comment._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      onDeleted?.(comment._id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    } finally {
      setConfirmOpen(false);
    }
  }

  return (
    <div className="border rounded p-3 bg-white">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="text-sm font-medium">
            {comment.name || "Anonymous"}
          </div>

          {!editing ? (
            <div className="text-gray-800 mt-1 whitespace-pre-wrap">
              {comment.text}
            </div>
          ) : (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              className="w-full mt-2 border rounded p-2"
              disabled={saving}
            />
          )}

          <div className="text-xs text-gray-400 mt-2">
            {new Date(comment.createdAt).toLocaleString()}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {canEdit && !editing && (
            <button
              className="text-sm text-indigo-600"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
          )}

          {editing && (
            <div className="flex gap-2">
              <button
                className="px-2 py-1 bg-indigo-600 text-white rounded"
                onClick={saveEdit}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                className="px-2 py-1 bg-gray-100 rounded"
                onClick={() => {
                  setEditing(false);
                  setText(comment.text);
                }}
              >
                Cancel
              </button>
            </div>
          )}

          {canDelete && (
            <button
              className="text-sm text-red-600"
              onClick={() => setConfirmOpen(true)}
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <DeleteModal
        open={confirmOpen}
        title="Delete comment"
        message="Are you sure you want to delete this comment?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={doDelete}
      />
    </div>
  );
}
