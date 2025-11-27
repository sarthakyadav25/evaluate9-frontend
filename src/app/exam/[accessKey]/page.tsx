"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Webcam from "react-webcam";
import { toast } from "sonner";
import { Loader2, Camera, Mic, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ExamLobby() {
  const { accessKey } = useParams();
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);

  // --- State ---
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [data, setData] = useState<any>(null); // Candidate & Test Data
  const [error, setError] = useState<string | null>(null);
  
  // System Checks
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [micAllowed, setMicAllowed] = useState(false); // Simple boolean for now

  // --- 1. Verify Access Key on Mount ---
  useEffect(() => {
    const verifyCandidate = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
        // Backend Endpoint: /exam/verify/:accessKey
        const response = await axios.get(`${apiUrl}/exam/verify/${accessKey}`);
        
        if (response.data.success) {
            setData(response.data.data);
            // Save the CANDIDATE token (crucial for Socket connection later)
            localStorage.setItem("examToken", response.data.data.token);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.error || "Invalid or Expired Link");
      } finally {
        setLoading(false);
      }
    };

    if (accessKey) verifyCandidate();
  }, [accessKey]);

  // --- 2. Handle Camera User Media ---
  const handleUserMedia = () => {
    setCameraAllowed(true);
    setMicAllowed(true); // React Webcam usually requests both
    toast.success("System Check Passed", { description: "Camera and Microphone detected." });
  };

  const handleUserMediaError = (err: any) => {
    console.error(err);
    setCameraAllowed(false);
    toast.error("Camera Access Denied", { description: "You must allow camera access to proceed." });
  };

  // --- 3. Proceed to Exam ---
  const startExam = () => {
      setVerifying(true);
      // Simulate a final handshake or setup
      setTimeout(() => {
          // Navigate to the actual exam room
          // We pass the accessKey purely for URL aesthetics or if needed again
          router.push(`/exam/${accessKey}/room`);
      }, 1000);
  };

  // --- Render: Loading / Error States ---
  if (loading) {
    return (
        <div className="h-screen flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
            <p className="text-zinc-500 animate-pulse">Verifying secure access...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="h-screen flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-8 bg-zinc-900 border-red-900/50 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h1 className="text-xl font-bold text-white mb-2">Access Denied</h1>
                <p className="text-zinc-400 mb-6">{error}</p>
                <Button variant="outline" onClick={() => window.location.reload()} className="border-zinc-700 hover:bg-zinc-800">
                    Try Again
                </Button>
            </Card>
        </div>
    );
  }

  // --- Render: Main Lobby ---
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
        
        {/* Left: Branding & Info */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative overflow-hidden">
            <div className="relative z-10 space-y-6">
                <div className="inline-block px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium">
                    {data.tenant.name} • Technical Assessment
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                    Welcome, <br/>
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-cyan-400">
                        {data.candidate.name.split(" ")[0]}
                    </span>
                </h1>
                <div className="space-y-4 text-zinc-400 text-lg max-w-md">
                    <p>You are about to start <strong>{data.test.title}</strong>.</p>
                    <ul className="space-y-2 text-sm border-l-2 border-zinc-800 pl-4">
                        <li>⏱️ Duration: <strong>{data.test.duration} mins</strong></li>
                        <li>🤖 Interviewer: <strong>AI Bot</strong></li>
                        <li>🛡️ Proctoring: <strong>Enabled</strong> (Camera & Tab Monitoring)</li>
                    </ul>
                </div>
            </div>
            
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-violet-900/10 to-transparent pointer-events-none" />
        </div>

        {/* Right: System Check */}
        <div className="w-full md:w-1/2 bg-zinc-900 border-l border-zinc-800 p-8 md:p-16 flex flex-col justify-center">
            <Card className="bg-black/50 border-zinc-800 p-6 space-y-6 backdrop-blur-xl">
                <div>
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Camera className="w-5 h-5 text-violet-500" /> System Check
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1">
                        We need to verify your camera and microphone before beginning.
                    </p>
                </div>

                {/* Camera Preview */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                    <Webcam
                        ref={webcamRef}
                        audio={true}
                        onUserMedia={handleUserMedia}
                        onUserMediaError={handleUserMediaError}
                        className="w-full h-full object-cover"
                        mirrored={true}
                    />
                    {!cameraAllowed && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 z-10 text-center p-4">
                            <p className="text-zinc-400 mb-2">Waiting for permissions...</p>
                            <Button variant="outline" onClick={() => window.location.reload()}>Request Access</Button>
                        </div>
                    )}
                    {cameraAllowed && (
                        <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Stream Active
                        </div>
                    )}
                </div>

                {/* Checklist */}
                <div className="space-y-3">
                    <CheckItem label="Camera Access" checked={cameraAllowed} />
                    <CheckItem label="Microphone Access" checked={micAllowed} />
                    <CheckItem label="Stable Connection" checked={true} />
                </div>

                {/* Start Button */}
                <Button 
                    className="w-full h-12 text-lg bg-white text-black hover:bg-zinc-200 transition-all"
                    disabled={!cameraAllowed || verifying}
                    onClick={startExam}
                >
                    {verifying ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                        <>Start Interview <ArrowRight className="w-5 h-5 ml-2" /></>
                    )}
                </Button>
            </Card>
        </div>
    </div>
  );
}

// Sub-component for checklist
function CheckItem({ label, checked }: { label: string; checked: boolean }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
            <span className="text-sm text-zinc-300">{label}</span>
            {checked ? (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
            ) : (
                <div className="w-5 h-5 rounded-full border-2 border-zinc-700 border-t-zinc-500 animate-spin" />
            )}
        </div>
    );
}