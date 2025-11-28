"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check for token in storage
    const token = localStorage.getItem("token");
    
    if (!token) {
      // No token? Redirect to login immediately
      router.push("/auth/login");
    } else {
      // Token exists? Allow access
      // (Optional: You could verify token expiry here with jwt-decode)
      setIsAuthorized(true);
    }
  }, [router]);

  // Show nothing (or a loader) while checking to prevent flash of content
  if (!isAuthorized) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white">
        <Loader2 className="h-10 w-10 animate-spin text-violet-500 mb-4" />
        <p className="text-zinc-500 text-sm animate-pulse">Verifying secure access...</p>
      </div>
    );
  }

  return <>{children}</>;
}