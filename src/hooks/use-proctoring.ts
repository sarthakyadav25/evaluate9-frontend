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

  // --- 1. Violation Reporter (Now Exported) ---
  const reportViolation = useCallback((type: "TAB_SWITCH" | "NO_FACE" | "MULTIPLE_FACES") => {
    if (!socket || !isExamActive) return;

    // Emit to Backend
    socket.emit("report_violation", { type });

    // UI Feedback
    const messages = {
        TAB_SWITCH: "Tab switching detected. Please stay on this screen.",
        NO_FACE: "Face not found. Please look at the camera.",
        MULTIPLE_FACES: "Multiple faces detected. Ensure you are alone."
    };

    toast.warning("Proctoring Alert", {
        description: messages[type],
        duration: 4000,
    });
  }, [socket, isExamActive]);

  // --- 2. Tab & Blur Listeners ---
  useEffect(() => {
    if (!isExamActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) reportViolation("TAB_SWITCH");
    };

    const handleBlur = () => {
       // Optional: reportViolation("TAB_SWITCH");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [isExamActive, reportViolation]);

  // --- 3. Socket Listeners ---
  useEffect(() => {
    if (!socket) return;

    socket.on("proctor_warning", (data: { message: string; count: number; max: number }) => {
        setViolationCount(data.count);
        toast.error(`Strike ${data.count}/${data.max}`, { description: data.message });
    });

    socket.on("exam_terminated", (data: { reason: string }) => {
        router.push(`/exam/terminated?reason=${encodeURIComponent(data.reason)}`);
    });

    return () => {
        socket.off("proctor_warning");
        socket.off("exam_terminated");
    };
  }, [socket, router]);

  return {
    violationCount,
    reportViolation // <--- Exported
  };
}