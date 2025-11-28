"use client";

import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

export interface Question {
  id: string;
  content: string;
}

export function useExamSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  // NEW: State to hold restored progress
  const [resumeData, setResumeData] = useState<{ answers: Record<string, string>, index: number } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("examToken");
    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace("/api/v1", "");

    if (!token) return;

    const socketInstance = io(backendUrl, {
      auth: { token },
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    socketInstance.on("connect", () => {
      console.log("✅ Socket Connected");
      setIsConnected(true);
      socketInstance.emit("start_interview"); 
    });

    socketInstance.on("disconnect", () => setIsConnected(false));

    // --- UPDATED: Handle Init & Resume ---
    socketInstance.on("init_questions", (data: { 
        questions: Question[], 
        savedAnswers?: Record<string, string>, 
        savedIndex?: number 
    }) => {
        setQuestions(data.questions);
        
        // If the server sent back saved progress, store it
        if (data.savedAnswers || typeof data.savedIndex === 'number') {
            setResumeData({
                answers: data.savedAnswers || {},
                index: data.savedIndex || 0
            });
        }
    });

    socketInstance.on("interview_finished", () => {
        setIsFinished(true);
        toast.success("Exam Submitted Successfully!");
    });

    socketInstance.on("error", (data: { message: string }) => {
        toast.error("System Error", { description: data.message });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // --- NEW: Sync Progress Action ---
  const syncProgress = useCallback((questionId: string, answer: string, nextIndex: number) => {
      if (!socket) return;
      socket.emit("save_progress", { questionId, answer, index: nextIndex });
  }, [socket]);

  const submitExam = useCallback((answers: Record<string, string>) => {
    if (!socket) return;
    socket.emit("submit_batch", { answers });
    setIsFinished(true); // Optimistic
  }, [socket]);

  return {
    socket,
    isConnected,
    questions,
    submitExam,
    isFinished,
    resumeData, // <--- Exported
    syncProgress // <--- Exported
  };
}