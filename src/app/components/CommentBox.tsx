// src/app/components/CommentBox.tsx
"use client";
import React, { useState } from "react";
import { apiFetch } from "@/lib/api"; // your helper for fetch with credentials
import { useAuth } from "../components/AuthProvider"; // however you expose auth

export default function CommentBox({
  reportId,
  onPosted,
}: {
  reportId: string;
  onPosted?: (c: any) => void;
}) {
  const [text, setText] = useState("");
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!text.trim()) return alert("Comment required");
    setLoading(true);
    const body: any = { text };
    if (!user) {
      body.name = "Anonymous";
    } else {
      body.name = user.name;
    }
    const r = await apiFetch(`/api/v1/comments/report/${reportId}`, {
      method: "POST",
      credentials: "include", // if you use cookies / refresh tokens
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);
    if (!r.ok) return alert("Failed to post");
    const json = await r.json();
    setText("");
    onPosted?.(json.data);
  };

  return (
    <section className="bg-white rounded p-4 mb-4">
      <h3 className="font-semibold mb-2">Add comment</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border rounded p-2"
      />
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={submit}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          {loading ? "Posting..." : "Post comment"}
        </button>
      </div>
    </section>
  );
}
