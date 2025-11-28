"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, User, Mail, Camera } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email().readonly(), // Email usually shouldn't change easily
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false);

  // Mock initial data - In prod, fetch from /api/v1/auth/me
  const defaultValues: ProfileFormValues = {
    name: "Admin User",
    email: "admin@evaluateix.com",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  // Hydrate form (simulated)
  useEffect(() => {
      const storedEmail = localStorage.getItem("userEmail");
      if(storedEmail) form.setValue("email", storedEmail);
  }, [form]);

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    
    // Simulate API Call
    setTimeout(() => {
        toast.success("Profile updated", { description: "Your changes have been saved." });
        setIsLoading(false);
    }, 1000);
    
    // Real implementation:
    // await axios.put('/api/v1/admin/profile', data);
  }

  return (
    <div className="space-y-6">
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your public profile details.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-6 mb-8">
                    <div className="relative group cursor-pointer">
                        <Avatar className="w-20 h-20 border-2 border-zinc-800 group-hover:border-violet-500 transition-colors">
                            <AvatarImage src="/avatars/01.png" />
                            <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xl">AD</AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-medium text-white">Profile Picture</h3>
                        <p className="text-sm text-zinc-500">Click to upload a new avatar.</p>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                            <Input placeholder="Your name" {...field} className="pl-9 bg-black border-zinc-800" />
                                        </div>
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
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                            <Input {...field} disabled className="pl-9 bg-zinc-950 border-zinc-800 text-zinc-500" />
                                        </div>
                                    </FormControl>
                                    <FormDescription>Email cannot be changed directly.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isLoading} className="bg-violet-600 hover:bg-violet-700 text-white">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}