"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// 1. Simple Validation Schema
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

    try {
      // 2. API Call to Backend
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email: values.email,
        password: values.password,
      });

      // 3. Success Handling
      const { token, user } = response.data.data;

      // Save critical session data
      localStorage.setItem("token", token);
      localStorage.setItem("tenantId", user.tenantId);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userEmail", user.email);

      toast.success("Welcome back!", {
        description: "Redirecting to your dashboard...",
        duration: 2000,
      });

      // 4. Redirect
      setTimeout(() => router.push("/dashboard"), 800);

    } catch (error: any) {
      console.error(error);
      toast.error("Login Failed", {
        description: error.response?.data?.error || "Invalid email or password.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h2>
        <p className="text-zinc-400">Sign in to your organization workspace.</p>
      </div>

      {/* Social Auth (Visual) */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-11 bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white">
          <FcGoogle className="mr-2 h-5 w-5" /> Google
        </Button>
        <Button variant="outline" className="h-11 bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white">
          <FaGithub className="mr-2 h-5 w-5" /> Github
        </Button>
      </div>

      <div className="relative flex items-center gap-4 py-2">
        <Separator className="flex-1 bg-zinc-800" />
        <span className="text-xs uppercase text-zinc-500">Or continue with</span>
        <Separator className="flex-1 bg-zinc-800" />
      </div>

      {/* Login Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-300">Work Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="name@company.com" 
                    {...field} 
                    className="h-11 bg-zinc-900 border-zinc-800 text-white focus-visible:ring-violet-500 placeholder:text-zinc-600" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-300">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      {...field} 
                      className="h-11 bg-zinc-900 border-zinc-800 text-white focus-visible:ring-violet-500 pr-10 placeholder:text-zinc-600" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-zinc-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full h-11 bg-white text-black hover:bg-zinc-200 font-semibold mt-6 transition-all" 
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Verifying..." : "Sign In"}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <span className="text-zinc-500">Don't have an account? </span>
        <Link href="/auth/register" className="text-violet-400 hover:text-violet-300 font-medium hover:underline transition-all">
          Create Organization
        </Link>
      </div>
    </div>
  );
}