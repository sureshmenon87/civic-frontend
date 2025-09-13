// simple toast using state + timeout
"use client";
import React, { useEffect } from "react";
export function Toast({
  message,
  onClose,
}: {
  message: string | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div className="fixed right-4 top-4 bg-black text-white px-4 py-2 rounded shadow z-50">
      {message}
    </div>
  );
}
