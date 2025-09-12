"use client";
import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export default function Protected({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login"); // redirect guest → /login
    }
  }, [user, loading, router]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return null; // show nothing while redirecting

  return <>{children}</>;
}
