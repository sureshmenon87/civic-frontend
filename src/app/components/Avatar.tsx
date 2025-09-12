// src/app/components/Avatar.tsx
"use client";
import React, { useState, useEffect } from "react";

type Props = {
  src?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
  proxy?: boolean; // if true, proxy via backend: /api/v1/avatar/proxy?url=...
};

export default function Avatar({
  src,
  name,
  size = 40,
  className = "",
  proxy = true,
}: Props) {
  const [ok, setOk] = useState<boolean>(!!src);
  const [url, setUrl] = useState<string | null>(src ?? null);

  useEffect(() => {
    setOk(!!src);
    setUrl(src ?? null);
  }, [src]);

  // If the URL is external and you prefer to proxy it through backend to avoid CORS/429,
  // set `proxy=true` and implement backend route /api/v1/avatar/proxy?url=ENCODED_URL
  const finalUrl =
    proxy && url ? `/api/v1/avatar/proxy?url=${encodeURIComponent(url)}` : url;

  const initials =
    (name || "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join("") || "U";

  if (!finalUrl || !ok) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-full bg-gray-200 inline-flex items-center justify-center ${className}`}
        aria-hidden
      >
        <span className="text-sm font-medium text-gray-700">{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={finalUrl}
      alt={name ?? "avatar"}
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
      onError={() => setOk(false)}
      style={{ width: size, height: size }}
    />
  );
}
