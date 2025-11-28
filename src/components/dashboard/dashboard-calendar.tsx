"use client";

import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function DashboardCalendar() {
  // Mock dates for "Scheduled Tests"
  // In real app, fetch these from DB
  const today = new Date();
  const scheduledDays = [
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
  ];

  return (
    <Card className="bg-zinc-900 border-zinc-800 h-full">
        <CardHeader className="pb-2">
            <CardTitle className="text-white text-base font-medium flex items-center justify-between">
                <span>Schedule</span>
                <Badge variant="outline" className="bg-violet-500/10 text-violet-400 border-violet-500/20 text-[10px]">
                    2 Upcoming
                </Badge>
            </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
            <Calendar
                mode="multiple"
                selected={scheduledDays}
                className="rounded-md border-0 text-zinc-300"
                modifiers={{
                    booked: scheduledDays
                }}
                modifiersStyles={{
                    booked: { 
                        color: "white", 
                        backgroundColor: "rgba(124, 58, 237, 0.5)", // Violet
                        fontWeight: "bold"
                    }
                }}
            />
        </CardContent>
    </Card>
  );
}