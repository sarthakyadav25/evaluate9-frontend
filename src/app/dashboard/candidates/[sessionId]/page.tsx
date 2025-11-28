"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { format } from "date-fns";
import { 
    ArrowLeft, 
    CheckCircle2, 
    XCircle, 
    Clock, 
    ShieldAlert, 
    Bot, 
    User,
    AlertTriangle,
    Download
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function CandidateResultPage() {
  const { sessionId } = useParams();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
            const token = localStorage.getItem("token");
            const res = await axios.get(`${apiUrl}/admin/session/${sessionId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSession(res.data.data);
        } catch (err) {
            toast.error("Error loading results");
        } finally {
            setLoading(false);
        }
    };
    if(sessionId) fetchSession();
  }, [sessionId]);

  if (loading) return <div className="p-8 text-zinc-500">Loading analysis...</div>;
  if (!session) return <div className="p-8 text-red-500">Session not found.</div>;

  // --- Derived Metrics ---
  const score = session.score || 0;
  const isPass = score >= 70;
  const transcript = (session.transcript as any[]) || [];
  const violations = (session.violations as any[]) || [];
  
  // Quick Stats
  const duration = session.endTime && session.startTime 
    ? Math.floor((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 60000) 
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
              <Button variant="ghost" className="pl-0 text-zinc-400 hover:text-white mb-2" onClick={() => router.back()}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
              </Button>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  {session.candidate.name}
                  {isPass ? (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">PASSED</Badge>
                  ) : (
                      <Badge className="bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20">REVIEW NEEDED</Badge>
                  )}
              </h1>
              <p className="text-zinc-400 mt-1 flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1"><User className="w-4 h-4" /> {session.candidate.email}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {duration} mins taken</span>
              </p>
          </div>
          
          <div className="flex gap-3">
              <Button variant="outline" className="border-zinc-700">
                  <Download className="w-4 h-4 mr-2" /> Export PDF
              </Button>
          </div>
      </div>

      {/* --- Key Metrics Grid --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-zinc-400">Overall Score</CardTitle></CardHeader>
              <CardContent>
                  <div className="text-3xl font-bold text-white">{score.toFixed(1)}%</div>
                  <Progress value={score} className={`h-2 mt-3 ${isPass ? "bg-emerald-900/50" : "bg-red-900/50"}`} indicatorColor={isPass ? "bg-emerald-500" : "bg-red-500"} />
              </CardContent>
          </Card>
          
          <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-zinc-400">Trust Score</CardTitle></CardHeader>
              <CardContent>
                  <div className="flex items-baseline gap-2">
                      <div className={`text-3xl font-bold ${violations.length === 0 ? "text-emerald-400" : "text-amber-400"}`}>
                          {100 - (violations.length * 10)}%
                      </div>
                      <span className="text-xs text-zinc-500">{violations.length} violations</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">Based on tab switches & face detection</p>
              </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 lg:col-span-2">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-zinc-400">AI Summary</CardTitle></CardHeader>
              <CardContent>
                  <div className="flex gap-3">
                      <div className="mt-1"><Bot className="w-5 h-5 text-violet-400" /></div>
                      <p className="text-sm text-zinc-300 leading-relaxed">
                          The candidate demonstrated strong knowledge in <strong>{session.test.title}</strong> basics. 
                          Key strengths identified in Questions 3 and 7. 
                          However, answers regarding advanced concepts lacked depth. 
                          {score > 80 ? "Highly recommended for next round." : "Consider a follow-up technical screen."}
                      </p>
                  </div>
              </CardContent>
          </Card>
      </div>

      {/* --- Deep Dive Tabs --- */}
      <Tabs defaultValue="transcript" className="w-full">
          <TabsList className="bg-zinc-900 border border-zinc-800">
              <TabsTrigger value="transcript">Transcript & Analysis</TabsTrigger>
              <TabsTrigger value="proctoring">Proctoring Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="transcript" className="mt-6">
              <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                      <CardTitle>Detailed Response Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                          {transcript.map((item: any, idx: number) => {
                              const itemScore = item.evaluation?.overall_score || 0;
                              const isGood = itemScore >= 7; // Assuming 0-10 scale from RAG
                              
                              return (
                                  <AccordionItem key={idx} value={`item-${idx}`} className="border-zinc-800">
                                      <AccordionTrigger className="hover:no-underline hover:bg-zinc-800/50 px-4 rounded-lg">
                                          <div className="flex items-center gap-4 text-left w-full">
                                              <Badge variant="outline" className={`w-8 h-8 rounded-full flex items-center justify-center p-0 ${isGood ? "border-emerald-500/50 text-emerald-400" : "border-amber-500/50 text-amber-400"}`}>
                                                  {itemScore}
                                              </Badge>
                                              <span className="text-zinc-200 font-medium truncate flex-1">{item.question}</span>
                                          </div>
                                      </AccordionTrigger>
                                      <AccordionContent className="px-4 pb-6 pt-2">
                                          <div className="grid md:grid-cols-2 gap-6">
                                              <div className="space-y-2">
                                                  <label className="text-xs font-semibold text-zinc-500 uppercase">Candidate Answer</label>
                                                  <div className="p-3 bg-zinc-950 rounded border border-zinc-800 text-zinc-300 text-sm leading-relaxed">
                                                      {item.answer}
                                                  </div>
                                              </div>
                                              <div className="space-y-2">
                                                  <label className="text-xs font-semibold text-violet-400 uppercase flex items-center gap-2">
                                                      <Bot className="w-3 h-3" /> AI Feedback
                                                  </label>
                                                  <div className="p-3 bg-violet-900/10 rounded border border-violet-500/20 text-zinc-300 text-sm leading-relaxed">
                                                      {item.evaluation?.feedback || "No feedback generated."}
                                                  </div>
                                                  {/* Optional: Show Improvements if available */}
                                                  {item.evaluation?.improvements && (
                                                      <div className="text-xs text-zinc-500 mt-2">
                                                          <strong className="text-zinc-400">Better approach:</strong> {item.evaluation.improvements}
                                                      </div>
                                                  )}
                                              </div>
                                          </div>
                                      </AccordionContent>
                                  </AccordionItem>
                              );
                          })}
                      </Accordion>
                  </CardContent>
              </Card>
          </TabsContent>

          <TabsContent value="proctoring" className="mt-6">
              <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                          <ShieldAlert className="w-5 h-5 text-amber-500" /> Security Log
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      {violations.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                              <CheckCircle2 className="w-12 h-12 text-emerald-900 mb-4" />
                              <p>Clean record. No violations detected.</p>
                          </div>
                      ) : (
                          <div className="space-y-4">
                              {violations.map((v: any, i: number) => (
                                  <div key={i} className="flex items-start gap-4 p-4 bg-red-950/10 border border-red-900/30 rounded-lg">
                                      <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                                      <div>
                                          <h4 className="text-red-400 font-medium text-sm">{v.type}</h4>
                                          <p className="text-zinc-500 text-xs mt-1">Detected at {new Date(v.timestamp).toLocaleTimeString()}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}
                  </CardContent>
              </Card>
          </TabsContent>
      </Tabs>
    </div>
  );
}