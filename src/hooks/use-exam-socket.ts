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

    // --- NEW: Receive ALL questions at once ---
    // Backend needs to emit this instead of 'receive_message'
    socketInstance.on("init_questions", (data: { questions: Question[] }) => {
        console.log("Received Questions:", data.questions);
        setQuestions(data.questions);
    });

    // Fallback: If backend still sends one-by-one (Legacy support)
    // We treat it as a single question array for now
    socketInstance.on("receive_message", (data) => {
        if(data.sender === 'AI') {
            setQuestions(prev => {
                if(prev.length === 0) return [{ id: "1", content: data.message }];
                return prev;
            });
        }
    });

    socketInstance.on("interview_finished", () => {
        setIsFinished(true);
        toast.success("Exam Submitted Successfully!");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // --- Batch Submission ---
  const submitExam = useCallback((answers: Record<string, string>) => {
    if (!socket) return;
    
    // Emit the new batch event
    socket.emit("submit_batch", { answers });
    
    // Optimistic finish
    setIsFinished(true);
  }, [socket]);

  return {
    socket,
    isConnected,
    questions,
    submitExam,
    isFinished
  };
}