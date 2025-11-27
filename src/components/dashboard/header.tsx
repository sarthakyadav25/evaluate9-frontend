"use client";

import React from "react";
import { UserNav } from "@/components/dashboard/user-nav"; // <--- Import logic
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="h-16 border-b border-zinc-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between px-6 transition-all duration-200">
      
      {/* Left: Global Search (Visual Placeholder for now) */}
      <div className="hidden md:flex items-center gap-2 w-full max-w-md">
        <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <Input 
                placeholder="Search candidates, tests..." 
                className="pl-9 h-9 bg-zinc-900/50 border-zinc-800 text-zinc-300 focus-visible:ring-violet-500/50 placeholder:text-zinc-600 w-64 focus:w-full transition-all duration-300" 
            />
        </div>
      </div>

      {/* Mobile Breadcrumb Placeholder (Visible only on small screens) */}
      <div className="md:hidden text-sm text-zinc-400 font-medium">
        EvaluateIX
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <button className="relative group text-zinc-400 hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-violet-500 border border-black" />
        </button>

        <div className="h-6 w-px bg-zinc-800" />

        {/* Modular User Nav */}
        <UserNav />
      </div>
    </header>
  );
}