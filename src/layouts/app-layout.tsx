"use client";
import { startTokenRefreshInterval, stopTokenRefreshInterval } from "@/lib/api";
import React, { useEffect } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    startTokenRefreshInterval();
    return () => {
      stopTokenRefreshInterval();
    };
  }, []);

  return <>{children}</>;
}
