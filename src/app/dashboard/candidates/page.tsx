"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { 
    Search, 
    User, 
    Mail, 
    FileText, 
    MoreHorizontal,
    Trophy
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface Candidate {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    sessions: {
        status: string;
        score: number | null;
        test: { title: string };
    }[];
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCandidates = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
      const token = localStorage.getItem("token");
      
      const response = await axios.get(`${apiUrl}/admin/candidates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCandidates(response.data.data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Filter Logic
  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Students</h2>
            <p className="text-zinc-400 mt-2">View and manage all candidates across your organization.</p>
        </div>
        
        <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <Input 
                    placeholder="Search students..." 
                    className="pl-9 bg-zinc-900 border-zinc-800 focus-visible:ring-violet-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            {/* You can re-use the AddCandidateModal here if you tweak it to accept a testId selection, 
                or just keep creation inside the specific Test pages for now. */}
        </div>
      </div>

      {/* Stats Cards (Optional) */}
      <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-violet-500/10 rounded-full text-violet-400">
                      <User className="w-6 h-6" />
                  </div>
                  <div>
                      <p className="text-2xl font-bold text-white">{candidates.length}</p>
                      <p className="text-xs text-zinc-500">Total Students</p>
                  </div>
              </CardContent>
          </Card>
      </div>

      {/* Main Table */}
      <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/50">
          <Table>
              <TableHeader className="bg-zinc-900">
                  <TableRow className="border-zinc-800 hover:bg-zinc-900">
                      <TableHead className="text-zinc-400">Name</TableHead>
                      <TableHead className="text-zinc-400">Tests Taken</TableHead>
                      <TableHead className="text-zinc-400">Avg. Score</TableHead>
                      <TableHead className="text-zinc-400">Latest Activity</TableHead>
                      <TableHead className="text-zinc-400">Joined</TableHead>
                      <TableHead className="text-right text-zinc-400">Actions</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {loading ? (
                      <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                              Loading students...
                          </TableCell>
                      </TableRow>
                  ) : filteredCandidates.length === 0 ? (
                      <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                              No students found.
                          </TableCell>
                      </TableRow>
                  ) : (
                      filteredCandidates.map((candidate) => {
                          // Calc stats
                          const completedSessions = candidate.sessions.filter(s => s.score !== null);
                          const avgScore = completedSessions.length > 0 
                            ? completedSessions.reduce((acc, curr) => acc + (curr.score || 0), 0) / completedSessions.length 
                            : 0;
                          const latestSession = candidate.sessions[0]; // Assuming order from backend or we sort

                          return (
                              <TableRow key={candidate.id} className="border-zinc-800 hover:bg-zinc-800/50">
                                  <TableCell>
                                      <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                                              {candidate.name.substring(0, 2).toUpperCase()}
                                          </div>
                                          <div>
                                              <div className="font-medium text-white">{candidate.name}</div>
                                              <div className="text-xs text-zinc-500 flex items-center gap-1">
                                                  <Mail className="w-3 h-3" /> {candidate.email}
                                              </div>
                                          </div>
                                      </div>
                                  </TableCell>
                                  <TableCell>
                                      <div className="flex items-center gap-2">
                                          <FileText className="w-4 h-4 text-zinc-500" />
                                          <span className="text-zinc-300">{candidate.sessions.length} Tests</span>
                                      </div>
                                  </TableCell>
                                  <TableCell>
                                      {completedSessions.length > 0 ? (
                                          <Badge variant="outline" className={`
                                              ${avgScore >= 70 ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10' : 'border-amber-500/20 text-amber-400 bg-amber-500/10'}
                                          `}>
                                              {avgScore.toFixed(1)}%
                                          </Badge>
                                      ) : (
                                          <span className="text-zinc-600 text-xs">N/A</span>
                                      )}
                                  </TableCell>
                                  <TableCell>
                                      {latestSession ? (
                                          <div className="text-xs">
                                              <p className="text-zinc-300 truncate max-w-[120px]">{latestSession.test.title}</p>
                                              <p className="text-zinc-500">{latestSession.status.replace("_", " ")}</p>
                                          </div>
                                      ) : (
                                          <span className="text-zinc-600 text-xs">-</span>
                                      )}
                                  </TableCell>
                                  <TableCell className="text-zinc-500 text-xs">
                                      {format(new Date(candidate.createdAt), "MMM d, yyyy")}
                                  </TableCell>
                                  <TableCell className="text-right">
                                      <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                                                  <MoreHorizontal className="h-4 w-4" />
                                              </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800 text-zinc-300">
                                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                                              <DropdownMenuItem>View History</DropdownMenuItem>
                                          </DropdownMenuContent>
                                      </DropdownMenu>
                                  </TableCell>
                              </TableRow>
                          );
                      })
                  )}
              </TableBody>
          </Table>
      </div>
    </div>
  );
}