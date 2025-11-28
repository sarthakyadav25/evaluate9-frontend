"use client";

import React, { useEffect, useState } from "react";
import { Users, FileText, Activity, Clock, Lightbulb, ShieldCheck } from "lucide-react"; // Added new icons
import axios from "axios";

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { DashboardCalendar } from "@/components/dashboard/dashboard-calendar";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default function DashboardPage() {
  const [stats, setStats] = useState({
      totalCandidates: 0,
      activeTests: 0,
      avgScore: 0,
      completionRate: 0
  });

  useEffect(() => {
      const fetchData = async () => {
          try {
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
              const token = localStorage.getItem("token");
              const headers = { Authorization: `Bearer ${token}` };

              const testsRes = await axios.get(`${apiUrl}/admin/tests`, { headers });
              const tests = testsRes.data.data || [];
              
              setStats({
                  totalCandidates: 142, 
                  activeTests: tests.length, 
                  avgScore: 78,         
                  completionRate: 92    
              });

          } catch (error) {
              console.error("Dashboard fetch error:", error);
          }
      };
      fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8">
      
      {/* 1. Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
            <p className="text-zinc-400">Overview of your evaluation pipeline.</p>
        </div>
      </div>

      {/* 2. Top Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
            title="Total Candidates" 
            value={stats.totalCandidates.toString()} 
            icon={Users} 
            description="+20.1% from last month"
        />
        <StatsCard 
            title="Active Tests" 
            value={stats.activeTests.toString()} 
            icon={FileText} 
            description="Currently hiring for"
        />
        <StatsCard 
            title="Avg. Score" 
            value={`${stats.avgScore}%`} 
            icon={Activity} 
            description="Overall performance"
        />
        <StatsCard 
            title="Completion Rate" 
            value={`${stats.completionRate}%`} 
            icon={Clock} 
            description="Candidates finishing"
        />
      </div>

      {/* 3. Middle Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
            <OverviewChart />
        </div>
        <div className="col-span-3">
            <DashboardCalendar />
        </div>
      </div>

      {/* 4. Bottom Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
              <RecentActivity />
          </div>
          
          {/* --- UPDATED QUICK TIPS SECTION --- */}
          <Card className="col-span-3 bg-zinc-900 border-zinc-800">
              <CardHeader>
                  <CardTitle className="text-white text-base font-medium flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      Quick Tips
                  </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  
                  {/* Tip 1: Violet Accent */}
                  <div className="flex gap-4 p-4 bg-zinc-950 border-l-4 border-violet-500 rounded-r-lg">
                      <div className="space-y-1">
                          <p className="text-sm font-medium text-white">Batch Invitations</p>
                          <p className="text-xs text-zinc-400 leading-relaxed">
                              Did you know? You can invite up to 50 candidates at once via CSV upload in the Candidates tab.
                          </p>
                      </div>
                  </div>

                  {/* Tip 2: Emerald Accent */}
                  <div className="flex gap-4 p-4 bg-zinc-950 border-l-4 border-emerald-500 rounded-r-lg">
                      <div className="space-y-1">
                          <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-white">Proctoring Update</p>
                              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">NEW</span>
                          </div>
                          <p className="text-xs text-zinc-400 leading-relaxed">
                              Face detection model updated to v2.0. It now performs 30% better in low-light conditions.
                          </p>
                      </div>
                  </div>

              </CardContent>
          </Card>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, description }: any) {
    return (
        <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              {title}
            </CardTitle>
            <Icon className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{value}</div>
            <p className="text-xs text-zinc-500 mt-1">{description}</p>
          </CardContent>
        </Card>
    );
}