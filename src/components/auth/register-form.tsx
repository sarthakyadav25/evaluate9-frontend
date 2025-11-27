"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner"; // <--- Using Sonner now
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

// 1. Zod Schema
const formSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 2. Form Hook
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      fullName: "",
      email: "",
      password: "",
    },
  });

  // 3. API Submission
  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

    try {
      // API Call
      const response = await axios.post(`${apiUrl}/auth/register`, {
        companyName: values.companyName,
        email: values.email,
        password: values.password,
        // Note: 'fullName' isn't used by backend v1 yet, but good to collect for v2
      });

      // Success Feedback (Sonner)
      toast.success("Organization Created Successfully!", {
        description: `Welcome aboard, ${values.companyName}. Redirecting...`,
        duration: 3000,
      });

      // Save Session
      if (response.data?.data?.token) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("tenantId", response.data.data.tenant.id);
      }

      // Redirect
      setTimeout(() => router.push("/dashboard"), 1000);

    } catch (error: any) {
      console.error(error);
      // Error Feedback (Sonner)
      toast.error("Registration Failed", {
        description: error.response?.data?.error || "Please check your inputs and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-3xl font-bold tracking-tight text-white">Sign Up Account</h2>
        <p className="text-zinc-400">Enter your organization details to get started.</p>
      </div>

      {/* OAuth Buttons (Visual) */}
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

      {/* Actual Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-300">Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="eg. Acme Corp" {...field} className="h-11 bg-zinc-900 border-zinc-800 text-white focus-visible:ring-violet-500 placeholder:text-zinc-600" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-300">Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="eg. Sankalp" {...field} className="h-11 bg-zinc-900 border-zinc-800 text-white focus-visible:ring-violet-500 placeholder:text-zinc-600" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-300">Work Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@company.com" {...field} className="h-11 bg-zinc-900 border-zinc-800 text-white focus-visible:ring-violet-500 placeholder:text-zinc-600" />
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
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <span className="text-zinc-500">Already have an account? </span>
        <Link href="/auth/login" className="text-violet-400 hover:text-violet-300 font-medium hover:underline transition-all">
          Log in
        </Link>
      </div>
    </div>
  );
}