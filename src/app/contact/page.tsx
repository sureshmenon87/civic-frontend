// src/app/contact/page.tsx
"use client";
import React, { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setOk(null);
    try {
      const res = await apiFetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, org, message }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setOk(body?.error || `Failed: ${res.status}`);
      } else {
        setOk("Thanks — we received your request. We'll contact you soon.");
        setName("");
        setEmail("");
        setOrg("");
        setMessage("");
      }
    } catch (err: any) {
      setOk(err.message || "Network error");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Contact us — Build this app
      </h1>
      <p className="text-gray-600 mb-4">
        Describe your requirements and we'll get back with an implementation
        plan & estimate.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow space-y-4"
      >
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Organization (optional)
          </label>
          <input
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            className="mt-1 w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Describe your needs
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="mt-1 w-full border rounded p-2"
          />
        </div>

        {ok && <div className="text-sm text-indigo-700">{ok}</div>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={sending}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            {sending ? "Sending..." : "Send request"}
          </button>
        </div>
      </form>
    </main>
  );
}
