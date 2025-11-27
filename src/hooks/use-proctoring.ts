"use client";

import { useEffect, useCallback, useState } from "react";
import { toast } from "sonner";
import { Socket } from "socket.io-client";
import { useRouter } from "next/navigation";

interface UseProctoringProps {
  socket: Socket | null;
  isExamActive: boolean;
}

export function useProctoring({ socket, isExamActive }: UseProctoringProps) {
  const router = useRouter();
  const [violationCount, setViolationCount] = useState(0);
  const [warnings, setWarnings] = useState<string[]>([]);

  // --- 1. Violation Reporter ---
  const reportViolation = useCallback((type: "TAB_SWITCH" | "NO_FACE" | "MULTIPLE_FACES") => {
    if (!socket || !isExamActive) return;

    console.warn(`[Proctor] Violation Detected: ${type}`);
    
    // Emit to Backend
    socket.emit("report_violation", { type });

    // Optimistic UI Feedback (Immediate Warning)
    toast.warning("Proctoring Alert", {
        description: type === "TAB_SWITCH" 
            ? "Tab switching is monitored. Please stay on this screen." 
            : "Please keep your face visible in the camera frame.",
        duration: 4000,
    });
  }, [socket, isExamActive]);

  // --- 2. Event Listeners (Tab Switch & Blur) ---
  useEffect(() => {
    if (!isExamActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        reportViolation("TAB_SWITCH");
      }
    };

    const handleBlur = () => {
      // Optional: Strict mode triggers on simple focus loss
      // reportViolation("TAB_SWITCH"); 
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [isExamActive, reportViolation]);

  // --- 3. Socket Listeners (Server Consequences) ---
  useEffect(() => {
    if (!socket) return;

    // Warning from Server (Syncs count)
    socket.on("proctor_warning", (data: { message: string; count: number; max: number }) => {
        setViolationCount(data.count);
        setWarnings((prev) => [...prev, data.message]);
        
        toast.error(`Strike ${data.count}/${data.max}`, {
            description: data.message,
            duration: 5000,
        });
    });

    // Termination (The Ban Hammer)
    socket.on("exam_terminated", (data: { reason: string }) => {
        toast.error("Exam Terminated", {
            description: data.reason,
            duration: 10000,
        });
        
        // Force redirect to disqualification page
        router.push(`/exam/terminated?reason=${encodeURIComponent(data.reason)}`);
    });

    return () => {
        socket.off("proctor_warning");
        socket.off("exam_terminated");
    };
  }, [socket, router]);

  return {
    violationCount,
    warnings
  };
}