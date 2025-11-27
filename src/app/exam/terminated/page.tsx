"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { ShieldAlert, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExamTerminated() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "Policy Violation";

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto ring-1 ring-red-500/30">
            <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        
        <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Session Terminated</h1>
            <p className="text-red-400 font-medium">{reason}</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg text-sm text-zinc-400">
            <p>Our proctoring system detected multiple violations of the assessment integrity policy.</p>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-500">
                <Lock className="w-3 h-3" />
                <span>Logs have been sent to the administrator.</span>
            </div>
        </div>

        <Button variant="outline" className="w-full border-zinc-800 text-zinc-400 hover:text-white">
            Return Home
        </Button>
      </div>
    </div>
  );
}