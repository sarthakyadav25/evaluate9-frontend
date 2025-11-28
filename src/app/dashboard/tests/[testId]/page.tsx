"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { 
    ArrowLeft, 
    Calendar, 
    Copy, 
    MoreHorizontal, 
    ShieldAlert, 
    User,
    FileText
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { AddCandidateModal } from "@/components/candidates/add-candidate-modal";
import { toast } from "sonner";

interface CandidateSession {
    id: string; // Session ID
    status: string;
    score: number | null;
    candidate: {
        id: string;
        name: string;
        email: string;
        accessKey: string;
    };
    createdAt: string;
}

export default function TestDetailsPage() {
  const { testId } = useParams();
  const router = useRouter();
  
  const [candidates, setCandidates] = useState<CandidateSession[]>([]);
  const [testTitle, setTestTitle] = useState("Loading Test...");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
    const token = localStorage.getItem("token");

    try {
        const candidatesRes = await axios.get(`${apiUrl}/admin/candidates/${testId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setCandidates(candidatesRes.data.data);

        const testsRes = await axios.get(`${apiUrl}/admin/tests`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const currentTest = testsRes.data.data.find((t: any) => t.id === testId);
        if (currentTest) setTestTitle(currentTest.title);

    } catch (error) {
        console.error(error);
        toast.error("Failed to load data");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (testId) fetchData();
  }, [testId]);

  // --- Function Definition ---
  const copyMagicLink = (accessKey: string) => {
      const fullLink = `${window.location.origin}/exam/${accessKey}`;
      navigator.clipboard.writeText(fullLink);
      toast.success("Magic Link copied!");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* --- Header --- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
              <Button variant="link" className="p-0 h-auto text-zinc-400 hover:text-white mb-2" onClick={() => router.back()}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back to Question Banks
              </Button>
              <h1 className="text-3xl font-bold tracking-tight text-white">{testTitle}</h1>
              <div className="flex items-center gap-4 text-sm text-zinc-500">
                  <span className="flex items-center gap-1"><User className="w-4 h-4" /> {candidates.length} Candidates</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Created recently</span>
              </div>
          </div>

          <AddCandidateModal testId={testId as string} onSuccess={fetchData} />
      </div>

      {/* --- Candidates Table --- */}
      <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/50">
          <Table>
              <TableHeader className="bg-zinc-900">
                  <TableRow className="border-zinc-800 hover:bg-zinc-900">
                      <TableHead className="text-zinc-400">Candidate</TableHead>
                      <TableHead className="text-zinc-400">Status</TableHead>
                      <TableHead className="text-zinc-400">Score</TableHead>
                      <TableHead className="text-zinc-400">Invited On</TableHead>
                      <TableHead className="text-right text-zinc-400">Actions</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {candidates.length === 0 ? (
                      <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                              No candidates found. Invite someone to get started.
                          </TableCell>
                      </TableRow>
                  ) : (
                      candidates.map((session) => (
                          <TableRow 
                            key={session.id} 
                            className="border-zinc-800 hover:bg-zinc-800/50 cursor-pointer group"
                            onClick={() => router.push(`/dashboard/candidates/${session.id}`)}
                          >
                              <TableCell>
                                  <div className="font-medium text-white group-hover:text-violet-400 transition-colors">
                                    {session.candidate.name}
                                  </div>
                                  <div className="text-xs text-zinc-500">{session.candidate.email}</div>
                              </TableCell>
                              <TableCell>
                                  <StatusBadge status={session.status} />
                              </TableCell>
                              <TableCell>
                                  {session.score !== null ? (
                                      <span className={session.score >= 70 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                                          {session.score.toFixed(1)}%
                                      </span>
                                  ) : (
                                      <span className="text-zinc-600">-</span>
                                  )}
                              </TableCell>
                              <TableCell className="text-zinc-500 text-sm">
                                  {session.createdAt ? format(new Date(session.createdAt), "MMM d, yyyy") : "-"}
                              </TableCell>
                              <TableCell className="text-right">
                                  <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 text-zinc-400 hover:text-white"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                              <MoreHorizontal className="h-4 w-4" />
                                          </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800 text-zinc-300">
                                          
                                          <DropdownMenuItem onClick={() => router.push(`/dashboard/candidates/${session.id}`)}>
                                              <FileText className="mr-2 h-4 w-4 text-violet-400" /> View Analysis
                                          </DropdownMenuItem>
                                          
                                          <DropdownMenuSeparator className="bg-zinc-800" />
                                          
                                          {/* --- FIXED: Correct Function Name --- */}
                                          <DropdownMenuItem onClick={() => copyMagicLink(session.candidate.accessKey)}>
                                              <Copy className="mr-2 h-4 w-4" /> Copy Magic Link
                                          </DropdownMenuItem>
                                          <DropdownMenuItem className="text-red-400 hover:text-red-300">
                                              <ShieldAlert className="mr-2 h-4 w-4" /> Revoke Access
                                          </DropdownMenuItem>
                                      </DropdownMenuContent>
                                  </DropdownMenu>
                              </TableCell>
                          </TableRow>
                      ))
                  )}
              </TableBody>
          </Table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        SCHEDULED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        IN_PROGRESS: "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse",
        COMPLETED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        TERMINATED: "bg-red-500/10 text-red-400 border-red-500/20",
    };

    return (
        <Badge variant="outline" className={`${styles[status] || "bg-zinc-800 text-zinc-400"} border`}>
            {status.replace("_", " ")}
        </Badge>
    );
}