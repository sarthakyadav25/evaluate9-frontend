"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Settings,
  User,
  CreditCard,
  ChevronsUpDown
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function UserNav() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@evaluateix.com");

  // Hydrate user info from client storage on mount
  useEffect(() => {
    // Note: In a real app, you'd decode the JWT or hit /api/v1/auth/me
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handleLogout = () => {
    // Clear all auth persistence
    localStorage.removeItem("token");
    localStorage.removeItem("tenantId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    
    router.push("/auth/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-zinc-800">
          <Avatar className="h-9 w-9 ring-2 ring-zinc-800 hover:ring-violet-500/50 transition-all cursor-pointer">
            {/* You can replace this src with a real user image URL later */}
            <AvatarImage src="/avatars/01.png" alt="User" />
            <AvatarFallback className="bg-violet-600 text-white font-medium">
              {email.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56 bg-zinc-950 border-zinc-800 text-zinc-200" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-white">Administrator</p>
            <p className="text-xs leading-none text-zinc-500">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-800" />
        
        <DropdownMenuGroup>
          <DropdownMenuItem className="focus:bg-zinc-900 cursor-pointer">
            <User className="mr-2 h-4 w-4 text-violet-400" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-zinc-900 cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4 text-zinc-400" />
            <span>Billing</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-zinc-900 cursor-pointer">
            <Settings className="mr-2 h-4 w-4 text-zinc-400" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator className="bg-zinc-800" />
        
        <DropdownMenuItem 
          className="text-red-400 focus:text-red-300 focus:bg-red-950/20 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}