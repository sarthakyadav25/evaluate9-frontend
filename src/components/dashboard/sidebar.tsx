"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; 
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Shield,
  CreditCard
} from "lucide-react";

const sidebarItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Question Banks",
    href: "/dashboard/tests",
    icon: FileText,
  },
  {
    title: "Candidates",
    href: "/dashboard/candidates",
    icon: Users,
  },
  {
    title: "Proctoring Settings",
    href: "/dashboard/proctoring",
    icon: Shield,
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r border-zinc-800 bg-black min-h-screen hidden md:flex flex-col">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-4 border-b border-zinc-800 overflow-hidden">
        {/* mix-blend-screen: Makes the black background of the JPG transparent 
            object-contain: Ensures the logo fits without stretching
            object-left: Aligns the logo to the left
        */}
        <div className="relative w-48 h-12">
            <img 
                src="/evaluateIX_final_logo.png" 
                alt="EvaluateIX" 
                className="w-full h-full object-contain object-left mix-blend-screen filter brightness-110 contrast-125" 
            />
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-6 space-y-1 px-3">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200",
                isActive
                  ? "bg-violet-500/10 text-violet-400 shadow-[0_0_15px_rgba(124,58,237,0.1)]"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  isActive ? "text-violet-400" : "text-zinc-500 group-hover:text-white"
                )}
              />
              {item.title}
            </Link>
          );
        })}
      </div>

      {/* Footer Area */}
      <div className="p-4 border-t border-zinc-800">
        <div className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-800">
           <p className="text-xs text-zinc-500 font-mono">v1.0.0-beta</p>
        </div>
      </div>
    </div>
  );
}