// src/app/components/ImageModal.tsx
"use client";
import React, { useEffect } from "react";

export default function ImageModal({
  url,
  onClose,
}: {
  url: string | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!url) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = url ? "hidden" : "";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [url, onClose]);

  if (!url) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* image container (stop click propagation) */}
      <div
        className="relative z-[100000] max-w-[95vw] max-h-[95vh] p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={url}
          alt="full"
          className="max-w-full max-h-[85vh] rounded shadow-lg block"
          style={{ display: "block" }}
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
