// src/app/components/CommentItem.tsx
"use client";
import React from "react";
import { apiFetch } from "@/lib/api";
import Avatar from "./Avatar";
import { useAuth } from "./AuthProvider";

export default function CommentItem({
  comment,
  onDeleted,
  onUpdated,
}: {
  comment: any;
  onDeleted?: (id: string) => void;
  onUpdated?: (c: any) => void;
}) {
  const { user } = useAuth();

  const remove = async () => {
    if (!confirm("Delete comment?")) return;
    const r = await apiFetch(`/api/v1/comments/${comment._id}`, {
      method: "DELETE",
    });
    if (r.ok) onDeleted?.(comment._id);
    else alert("Delete failed");
  };

  const canDelete =
    user && (user.sub === comment.userId || user.role === "admin");

  return (
    <div className="bg-white p-3 rounded shadow-sm">
      <div className="flex items-start gap-3">
        <Avatar
          src={comment.authorAvatar || null}
          name={comment.authorName || comment.name || "A"}
          size={40}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="font-semibold">
              {comment.authorName || comment.name || "Anonymous"}
            </div>
            <div className="text-sm text-gray-500">
              {new Date(comment.createdAt).toLocaleString()}
            </div>
          </div>
          <div className="mt-1 text-gray-700">{comment.text}</div>
        </div>
        {canDelete ? (
          <button onClick={remove} className="ml-2 text-red-600">
            🗑
          </button>
        ) : null}
      </div>
    </div>
  );
}
