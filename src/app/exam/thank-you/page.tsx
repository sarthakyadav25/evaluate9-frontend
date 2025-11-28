"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TRANSITIONS, VARIANTS } from "@/lib/animations";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        variants={VARIANTS.slideUp}
        transition={TRANSITIONS.dramatic}
        className="max-w-lg w-full space-y-8 relative z-10"
      >
        {/* Success Icon */}
        <div className="flex justify-center">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center ring-1 ring-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
        </div>

        {/* Messaging */}
        <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Assessment Complete
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
                Thank you for completing the evaluation. Your responses have been securely recorded and submitted to the hiring team.
            </p>
        </div>

        {/* Status Card */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Status</span>
                <span className="text-emerald-400 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    Submitted
                </span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Evaluation</span>
                <span className="text-zinc-300">Pending Review</span>
            </div>
            <div className="w-full h-px bg-zinc-800" />
            <p className="text-xs text-zinc-500">
                You may now safely close this window. The recruiter will contact you regarding next steps.
            </p>
        </div>

        {/* Optional Home Button (if you have a landing page) */}
        <div className="pt-4">
            <Button variant="link" className="text-zinc-500 hover:text-white" asChild>
                <Link href="/">
                    Return to Home <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
            </Button>
        </div>
      </motion.div>
    </div>
  );
}