"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function AdminSecurityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAdminAuthenticated, lockAdminPortal } = useStore();

  // Redirect unauthenticated users to the single unified /login page
  useEffect(() => {
    if (!isAdminAuthenticated) {
      router.replace("/login");
    }
  }, [isAdminAuthenticated, router]);

  // Automatic 15-minute inactivity session lock when authenticated
  useEffect(() => {
    if (!isAdminAuthenticated) return;
    let inactivityTimer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        lockAdminPortal();
        router.replace("/login");
      }, 15 * 60 * 1000);
    };

    resetTimer();
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [isAdminAuthenticated, lockAdminPortal, router]);

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="p-6 border-2 border-black bg-white text-center space-y-2 font-mono text-xs uppercase">
          <Lock className="w-5 h-5 mx-auto" />
          <p className="font-bold">Protected Admin Route — Redirecting to Sign In...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
