// src/app/components/ImageModal.tsx
"use client";
import React from "react";

export default function ImageModal({
  url,
  onClose,
}: {
  url: string | null;
  onClose: () => void;
}) {
  if (!url) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="z-10 max-w-4xl max-h-[90vh] overflow-auto">
        <img src={url} alt="full" className="max-w-full max-h-[90vh] rounded" />
      </div>
    </div>
  );
}
