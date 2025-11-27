"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; 
import { format } from "date-fns";
import { FileText, Clock, MoreVertical, Loader2 } from "lucide-react";
import { CreateTestModal } from "@/components/tests/create-test-modal";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Test {
  id: string;
  title: string;
  description: string | null;
  durationMin: number;
  createdAt: string;
}

export default function TestsPage() {
  const router = useRouter();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch Logic ---
  const fetchTests = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
      const token = localStorage.getItem("token");
      
      const response = await axios.get(`${apiUrl}/admin/tests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTests(response.data.data);
    } catch (error) {
      console.error("Failed to fetch tests", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // --- FIXED: Handler now accepts the specific ID ---
  const handleCardClick = (testId: string) => {
    router.push(`/dashboard/tests/${testId}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Question Banks</h2>
            <p className="text-zinc-400 mt-2">Manage your AI evaluation tests and knowledge bases.</p>
        </div>
        {/* Pass refresh function to modal so list updates after create */}
        <CreateTestModal onSuccess={fetchTests} />
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-zinc-500">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : tests.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/50">
            <FileText className="h-10 w-10 text-zinc-600 mb-4" />
            <p className="text-zinc-400">No tests found. Create your first one!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <Card 
                key={test.id} 
                // --- FIXED: Arrow function passes the ID correctly ---
                onClick={() => handleCardClick(test.id)}
                className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all text-white cursor-pointer group relative"
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1 pr-4">
                    <CardTitle className="text-lg font-semibold truncate group-hover:text-violet-400 transition-colors">
                        {test.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-xs text-zinc-500">
                        {test.description || "No description provided."}
                    </CardDescription>
                </div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="-mr-2 h-8 w-8 text-zinc-500 hover:text-white z-10"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent card click when clicking the menu
                        // Add dropdown logic here later if needed
                    }}
                >
                    <MoreVertical className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-zinc-400 mt-4">
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-violet-500" />
                        {test.durationMin} mins
                    </div>
                    <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4 text-emerald-500" />
                        Questions Ready
                    </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-zinc-800/50 pt-4 text-xs text-zinc-500 flex justify-between">
                <span>Created {format(new Date(test.createdAt), "MMM d, yyyy")}</span>
                <span className="text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                    View Details →
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}