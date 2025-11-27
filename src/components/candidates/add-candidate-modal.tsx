"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, UserPlus, Upload, Copy, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// --- Zod Schemas ---
const singleSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
});

const bulkSchema = z.object({
  file: z
    .any()
    .refine((files) => files?.length == 1, "CSV file is required.")
    .refine((files) => files?.[0]?.type === "text/csv" || files?.[0]?.name.endsWith(".csv"), "Only .csv files are accepted."),
});

interface AddCandidateModalProps {
  testId: string;
  onSuccess: () => void;
}

export function AddCandidateModal({ testId, onSuccess }: AddCandidateModalProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("single");
  const [loading, setLoading] = useState(false);
  
  // State to show the generated link after success
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [bulkStats, setBulkStats] = useState<{ added: number; errors: number } | null>(null);

  // --- Forms ---
  const singleForm = useForm<z.infer<typeof singleSchema>>({
    resolver: zodResolver(singleSchema),
    defaultValues: { name: "", email: "" },
  });

  const bulkForm = useForm<z.infer<typeof bulkSchema>>({
    resolver: zodResolver(bulkSchema),
  });
  const fileRef = bulkForm.register("file");

  // --- Handlers ---
  const onSingleSubmit = async (values: z.infer<typeof singleSchema>) => {
    setLoading(true);
    setGeneratedLink(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${apiUrl}/admin/candidates`,
        { testId, ...values },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Backend returns: { success: true, data: {...}, magicLink: "..." }
      const link = response.data.magicLink;
      setGeneratedLink(link);
      
      toast.success("Candidate Added", { description: "You can now copy the invite link." });
      onSuccess();
      singleForm.reset();
    } catch (error: any) {
      toast.error("Error", { description: error.response?.data?.error || "Failed to add candidate" });
    } finally {
      setLoading(false);
    }
  };

  const onBulkSubmit = async (values: z.infer<typeof bulkSchema>) => {
    setLoading(true);
    setBulkStats(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("testId", testId);
      formData.append("file", values.file[0]);

      const response = await axios.post(
        `${apiUrl}/admin/candidates/bulk`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      const { processed, errors } = response.data;
      setBulkStats({ added: processed.length, errors: errors.length });
      
      if (errors.length > 0) {
        toast.warning(`Partial Success`, { description: `${processed.length} added, ${errors.length} failed.` });
      } else {
        toast.success("Bulk Upload Complete", { description: `${processed.length} candidates invited.` });
      }
      onSuccess();
      bulkForm.reset();
    } catch (error: any) {
      toast.error("Upload Failed", { description: error.response?.data?.error });
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      toast.success("Copied to clipboard!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
        setOpen(val);
        if(!val) { setGeneratedLink(null); setBulkStats(null); } // Reset on close
    }}>
      <DialogTrigger asChild>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]">
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Candidates
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite Candidates</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Add candidates to this test. They will receive a unique access link.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-900">
            <TabsTrigger value="single">Single Invite</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Upload (CSV)</TabsTrigger>
          </TabsList>

          {/* --- Tab 1: Single --- */}
          <TabsContent value="single" className="space-y-4 py-4">
            {!generatedLink ? (
                <Form {...singleForm}>
                <form onSubmit={singleForm.handleSubmit(onSingleSubmit)} className="space-y-4">
                    <FormField
                    control={singleForm.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Candidate Name</FormLabel>
                        <FormControl>
                            <Input placeholder="John Doe" {...field} className="bg-zinc-900 border-zinc-800" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={singleForm.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                            <Input placeholder="john@example.com" {...field} className="bg-zinc-900 border-zinc-800" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Invite Link
                    </Button>
                </form>
                </Form>
            ) : (
                <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                    <Alert className="bg-emerald-500/10 border-emerald-500/50 text-emerald-400">
                        <Check className="h-4 w-4" />
                        <AlertTitle>Candidate Added!</AlertTitle>
                        <AlertDescription>
                            Share this link with the candidate to start the exam.
                        </AlertDescription>
                    </Alert>
                    
                    <div className="flex items-center gap-2">
                        <Input readOnly value={generatedLink} className="bg-zinc-900 border-zinc-700 text-zinc-300 font-mono text-xs" />
                        <Button size="icon" variant="outline" onClick={copyLink} className="border-zinc-700 hover:bg-zinc-800">
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>

                    <Button variant="ghost" onClick={() => { setGeneratedLink(null); singleForm.reset(); }} className="w-full text-zinc-400">
                        Add Another
                    </Button>
                </div>
            )}
          </TabsContent>

          {/* --- Tab 2: Bulk --- */}
          <TabsContent value="bulk" className="space-y-4 py-4">
             {!bulkStats ? (
                <Form {...bulkForm}>
                    <form onSubmit={bulkForm.handleSubmit(onBulkSubmit)} className="space-y-4">
                        <div className="p-6 border-2 border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center text-center">
                            <Upload className="h-8 w-8 text-zinc-500 mb-2" />
                            <p className="text-sm text-zinc-400">Upload CSV (headers: email, name)</p>
                            <Input 
                                type="file" 
                                accept=".csv" 
                                className="mt-4 bg-zinc-900 text-xs w-full max-w-[250px]" 
                                {...fileRef}
                            />
                        </div>
                        <Button type="submit" className="w-full bg-white text-black" disabled={loading}>
                            {loading ? "Uploading..." : "Process CSV"}
                        </Button>
                    </form>
                </Form>
             ) : (
                <div className="text-center space-y-4">
                    <div className="text-xl font-bold text-white">Upload Results</div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-emerald-500/10 p-4 rounded border border-emerald-500/20">
                            <div className="text-2xl font-bold text-emerald-400">{bulkStats.added}</div>
                            <div className="text-xs text-emerald-500 uppercase">Success</div>
                        </div>
                        <div className="bg-red-500/10 p-4 rounded border border-red-500/20">
                            <div className="text-2xl font-bold text-red-400">{bulkStats.errors}</div>
                            <div className="text-xs text-red-500 uppercase">Errors</div>
                        </div>
                    </div>
                    <Button variant="outline" onClick={() => setBulkStats(null)} className="w-full border-zinc-700 text-white">
                        Upload Another
                    </Button>
                </div>
             )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}