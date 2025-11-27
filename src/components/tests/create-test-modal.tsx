"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Upload, FileText, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 1. Validation Schema
// Max file size: 5MB for MVP
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_TYPES = ["application/pdf"];

const formSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  durationMin: z.string().refine((val) => !isNaN(Number(val)), "Must be a number"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  file: z
    .any()
    .refine((files) => files?.length == 1, "PDF is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_TYPES.includes(files?.[0]?.type),
      "Only .pdf files are accepted."
    ),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateTestModal({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      durationMin: "30",
      difficulty: "medium",
    },
  });

  // Helper to handle file input in React Hook Form
  const fileRef = form.register("file");

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

    try {
      // 2. Construct FormData for Multipart Upload
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description || "");
      formData.append("durationMin", values.durationMin);
      
      // 3. Construct the botConfig JSON
      // This maps to your RAG Metadata
      const botConfig = {
        role: "Interviewer",
        company: "EvaluateIX", // You could pull this from tenant context if needed
        difficulty: values.difficulty,
        topics: ["General", "Technical"] // Placeholder for now
      };
      formData.append("botConfig", JSON.stringify(botConfig));

      // 4. Append File
      formData.append("file", values.file[0]);

      // 5. Send Request
      await axios.post(`${apiUrl}/admin/tests`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Backend Middleware needs this
        },
      });

      toast.success("Test Created Successfully", {
        description: "RAG ingestion started. Questions are being generated...",
      });

      setOpen(false);
      form.reset();
      if (onSuccess) onSuccess();

    } catch (error: any) {
      console.error(error);
      toast.error("Failed to Create Test", {
        description: error.response?.data?.error || "Server error. Check your PDF.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all">
           + New Question Bank
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Upload Question Bank</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Upload a PDF (e.g., Job Description or Technical Manual). We will generate interview questions from it.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Test Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Senior React Developer" {...field} className="bg-zinc-900 border-zinc-800 focus-visible:ring-violet-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Difficulty & Duration Row */}
            <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">Difficulty</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-zinc-900 border-zinc-800">
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="durationMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">Duration (Min)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="bg-zinc-900 border-zinc-800 focus-visible:ring-violet-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                        placeholder="Internal notes about this role..." 
                        className="resize-none bg-zinc-900 border-zinc-800 focus-visible:ring-violet-500" 
                        {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Custom File Input */}
            <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Knowledge Base (PDF)</FormLabel>
                  <FormControl>
                    <div className="relative group">
                        <Input 
                            type="file" 
                            accept=".pdf" 
                            className="hidden" 
                            id="file-upload"
                            {...fileRef} 
                            // React Hook Form needs 'onChange' to register the file
                            onChange={(e) => {
                                fileRef.onChange(e);
                            }}
                        />
                        <label 
                            htmlFor="file-upload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-800 rounded-lg cursor-pointer hover:border-violet-500/50 hover:bg-zinc-900/50 transition-all"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-3 text-zinc-500 group-hover:text-violet-400" />
                                <p className="text-sm text-zinc-500 group-hover:text-zinc-300">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-zinc-600">PDF only (MAX. 5MB)</p>
                            </div>
                        </label>
                    </div>
                  </FormControl>
                  {/* Show selected filename if available */}
                  {form.watch("file")?.[0] && (
                      <div className="flex items-center gap-2 text-xs text-emerald-400 mt-2 bg-emerald-400/10 p-2 rounded border border-emerald-400/20">
                          <FileText className="w-4 h-4" />
                          {form.watch("file")[0].name}
                      </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Ingesting & Generating..." : "Create Test"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}