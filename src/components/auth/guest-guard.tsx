"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token) {
      // Already logged in? Send to dashboard
      router.push("/dashboard");
    } else {
      // No token? Allow access to login page
      setIsGuest(true);
    }
  }, [router]);

  if (!isGuest) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
         {/* Minimal loader while redirecting */}
         <Loader2 className="h-8 w-8 animate-spin text-zinc-700" />
      </div>
    );
  }

  return <>{children}</>;
}