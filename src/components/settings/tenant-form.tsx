"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Building, Globe, Palette } from "lucide-react";

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const tenantSchema = z.object({
  companyName: z.string().min(2, "Company name is required."),
  domain: z.string().optional(),
  brandColor: z.string().regex(/^#/, "Must be a valid hex code").optional(),
});

type TenantFormValues = z.infer<typeof tenantSchema>;

export function TenantForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      companyName: "Acme Corp",
      domain: "acme.com",
      brandColor: "#7c3aed",
    },
  });

  async function onSubmit(data: TenantFormValues) {
    setIsLoading(true);
    // Simulate API Call
    setTimeout(() => {
        toast.success("Organization updated", { description: "Tenant settings saved successfully." });
        setIsLoading(false);
    }, 1500);
  }

  return (
    <div className="space-y-6">
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle>Organization Profile</CardTitle>
                <CardDescription>Manage your company branding and details.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                        <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Name</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Building className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                            <Input placeholder="Acme Corp" {...field} className="pl-9 bg-black border-zinc-800" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="domain"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Primary Domain</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                            <Input placeholder="acme.com" {...field} className="pl-9 bg-black border-zinc-800" />
                                        </div>
                                    </FormControl>
                                    <FormDescription>Used for candidate email verification (optional).</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Separator className="my-4 bg-zinc-800" />
                        
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-white">Branding</h4>
                            <p className="text-xs text-zinc-500">Customize the candidate exam portal experience.</p>
                        </div>

                        <FormField
                            control={form.control}
                            name="brandColor"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Brand Color (Hex)</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-2">
                                            <div 
                                                className="w-10 h-10 rounded border border-zinc-700 shadow-inner"
                                                style={{ backgroundColor: field.value }} 
                                            />
                                            <div className="relative flex-1">
                                                <Palette className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                                <Input {...field} className="pl-9 bg-black border-zinc-800 font-mono" />
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isLoading} className="bg-white text-black hover:bg-zinc-200 mt-2">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Organization
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}