"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";
import { toast } from "sonner";
import { ChevronRight, Send, Lock, Clock } from "lucide-react";
import { useExamSocket } from "@/hooks/use-exam-socket";
import { useProctoring } from "@/hooks/use-proctoring";
import { useFaceDetection } from "@/hooks/use-face-detection";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export default function ExamRoomPage() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null); // <--- Ref for Face Detection
  
  const { 
      socket, 
      isConnected, 
      questions, 
      submitExam, 
      isFinished, 
      resumeData, 
      syncProgress 
  } = useExamSocket();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // 1. Activate Proctoring
  const { violationCount, reportViolation } = useProctoring({
      socket,
      isExamActive: !isFinished && isConnected
  });

  // 2. Activate Face Detection
  useFaceDetection(
      webcamRef,
      (type) => reportViolation(type),
      !isFinished && isConnected
  );

  // 3. Handle Resume / Hydration
  useEffect(() => {
      if (resumeData) {
          setAnswers(resumeData.answers);
          setCurrentIndex(resumeData.index);
          toast.info("Session Resumed", { 
              description: "We restored your previous answers.",
              duration: 5000 
          });
      }
  }, [resumeData]);

  useEffect(() => {
      if(isFinished) {
          router.push("/exam/thank-you");
      }
  }, [isFinished, router]);

  const handleAnswerChange = (val: string) => {
      const qId = questions[currentIndex]?.id;
      if(qId) {
          setAnswers(prev => ({ ...prev, [qId]: val }));
      }
  };

  const handleNext = () => {
      const currentQ = questions[currentIndex];
      const currentAns = answers[currentQ.id];

      // Sync progress to backend before moving
      syncProgress(currentQ.id, currentAns, currentIndex + 1);

      if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1);
          window.scrollTo(0, 0); 
      }
  };

  const handleSubmit = () => {
      if(confirm("Are you sure you want to submit your test?")) {
          // Sync final answer first just in case
          const currentQ = questions[currentIndex];
          const currentAns = answers[currentQ.id];
          syncProgress(currentQ.id, currentAns, currentIndex); // Index doesn't matter much here
          
          submitExam(answers);
      }
  };

  if (questions.length === 0) {
      return (
          <div className="h-screen bg-zinc-950 flex items-center justify-center text-white">
              <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-t-2 border-violet-500 rounded-full animate-spin" />
                  <p className="text-zinc-500 font-mono text-sm">Securely Loading Exam...</p>
              </div>
          </div>
      );
  }

  const currentQ = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const currentAnswer = answers[currentQ.id] || "";
  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden font-sans">
        
        {/* --- LEFT SIDEBAR --- */}
        <div className="hidden md:flex w-80 border-r border-zinc-800 bg-black flex-col z-20">
            <div className="p-6 border-b border-zinc-800">
                <div className="flex items-center gap-2 font-bold text-lg text-white/90 mb-6">
                    <span className="w-3 h-3 rounded-full bg-violet-600 shadow-[0_0_12px_rgba(124,58,237,0.5)]" />
                    EvaluateIX
                </div>
                
                <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl mb-4 group">
                     {/* Webcam with Ref */}
                     <Webcam 
                        ref={webcamRef}
                        audio={false} 
                        className="w-full h-full object-cover mirrored" 
                        mirrored 
                        width={320}
                        height={180}
                        videoConstraints={{ facingMode: "user" }}
                     />
                     
                     <div className="absolute top-3 right-3 flex gap-2">
                        <Badge variant="destructive" className="text-[10px] px-2 h-5 font-bold tracking-wider animate-pulse">REC</Badge>
                     </div>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
                    <span>Violations: <span className={violationCount > 0 ? "text-red-500" : "text-emerald-500"}>{violationCount}/3</span></span>
                    <span className="text-violet-400">ID: {currentQ.id.substring(0,6)}...</span>
                </div>
            </div>

            <ScrollArea className="flex-1 bg-zinc-950/50">
                <div className="p-6">
                    <div className="mb-4 flex items-center justify-between text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                        <span>Progress</span>
                        <span>{currentIndex + 1}/{questions.length}</span>
                    </div>
                    <div className="grid grid-cols-5 gap-2.5">
                        {questions.map((q, idx) => {
                            const isCurrent = idx === currentIndex;
                            const isPast = idx < currentIndex;
                            return (
                                <div
                                    key={q.id}
                                    className={`
                                        h-10 rounded-lg flex items-center justify-center text-xs font-bold border transition-all duration-300
                                        ${isCurrent 
                                            ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-900/20 scale-105" 
                                            : isPast 
                                                ? "bg-zinc-900 border-zinc-800 text-zinc-500"
                                                : "bg-black border-zinc-800 text-zinc-700"
                                        }
                                    `}
                                >
                                    {isPast ? <Lock className="w-3 h-3 opacity-50" /> : idx + 1}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
                 <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> Time Remaining</span>
                    <span className="font-mono text-white text-sm font-bold">45:00</span>
                 </div>
            </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="flex-1 flex flex-col relative bg-zinc-950">
            <div className="h-1 bg-zinc-900 w-full">
                <div 
                    className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 transition-all duration-500 ease-out" 
                    style={{ width: `${progressPercentage}%` }} 
                />
            </div>

            <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md sticky top-0 z-10">
                <span className="text-zinc-400 text-sm font-medium">Question {currentIndex + 1}</span>
                <Badge variant="outline" className="border-violet-500/30 text-violet-300 bg-violet-500/10">Active Session</Badge>
            </div>

            <div className="flex-1 max-w-3xl mx-auto w-full p-8 md:p-12 overflow-y-auto flex flex-col">
                <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 key={currentIndex}">
                    <div className="space-y-6">
                        <h2 className="text-2xl md:text-3xl font-medium leading-snug text-white/90">
                            {currentQ.content}
                        </h2>
                    </div>
                    <div className="w-full h-px bg-zinc-800/50" />
                    <div className="space-y-3 flex-1 flex flex-col">
                        <label className="text-sm font-medium text-zinc-500 uppercase tracking-wider flex justify-between">
                            <span>Your Answer</span>
                            <span className={currentAnswer.length > 50 ? "text-emerald-500" : "text-zinc-600"}>
                                {currentAnswer.length} chars
                            </span>
                        </label>
                        <Textarea 
                            value={currentAnswer}
                            onChange={(e) => handleAnswerChange(e.target.value)}
                            placeholder="Type your response here..."
                            className="flex-1 min-h-[300px] bg-zinc-900/30 border-zinc-800 focus-visible:ring-violet-500/50 focus-visible:border-violet-500 resize-none text-lg leading-relaxed p-6 rounded-xl transition-all"
                            autoFocus
                        />
                    </div>
                </div>
            </div>

            <div className="h-24 border-t border-zinc-800 bg-black p-8 flex items-center justify-end">
                {isLastQuestion ? (
                    <Button 
                        onClick={handleSubmit} 
                        size="lg"
                        disabled={currentAnswer.length < 5} 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white w-full md:w-48 shadow-[0_0_20px_rgba(16,185,129,0.3)] text-base font-semibold"
                    >
                        Finish Exam <Send className="w-4 h-4 ml-2" />
                    </Button>
                ) : (
                    <Button 
                        onClick={handleNext} 
                        size="lg"
                        disabled={currentAnswer.length < 2} 
                        className="bg-white text-black hover:bg-zinc-200 w-full md:w-40 text-base font-semibold shadow-lg shadow-white/5"
                    >
                        Next <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                )}
            </div>
        </div>
    </div>
  );
}