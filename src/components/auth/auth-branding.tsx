import React from "react";

export function AuthBranding() {
  return (
    <div className="hidden lg:flex w-1/2 relative bg-zinc-900 overflow-hidden items-center justify-center p-12 h-full min-h-screen">
      {/* --- Background Effects --- */}
      <div className="absolute inset-0 w-full h-full bg-black">
        {/* Purple/Blue Gradient Blobs */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-violet-600/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-indigo-600/20 rounded-full blur-[120px]" />
        
        {/* Noise Texture - Gives it that premium 'grainy' look */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* --- Content Layer --- */}
      <div className="relative z-10 text-white max-w-lg space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-zinc-700 bg-zinc-800/50 backdrop-blur-md px-3 py-1 rounded-full text-sm text-zinc-300 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
          EvaluateIX Platform
        </div>

        {/* Hero Text */}
        <h1 className="text-5xl font-bold tracking-tight leading-tight">
          Hire the top 1% with <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-cyan-400">
            AI Precision.
          </span>
        </h1>

        <p className="text-lg text-zinc-400 leading-relaxed">
          Automate technical interviews with our RAG-powered bot. 
          Get deep insights, anti-cheat protection, and unbiased scoring instantly.
        </p>

        {/* Feature List / Stepper */}
        <div className="mt-8 space-y-4">
          <FeatureStep number={1} text="Create Organization" active />
          <FeatureStep number={2} text="Upload Question Bank" />
          <FeatureStep number={3} text="Start Hiring" />
        </div>
      </div>
    </div>
  );
}

// Sub-component for clean code
function FeatureStep({ number, text, active = false }: { number: number; text: string; active?: boolean }) {
  return (
    <div className="flex items-center gap-4 group cursor-default">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
          active
            ? "bg-white text-black shadow-lg shadow-white/20 scale-110"
            : "bg-zinc-800 text-zinc-500 border border-zinc-700"
        }`}
      >
        {number}
      </div>
      <span className={`font-medium ${active ? "text-white" : "text-zinc-500"}`}>{text}</span>
    </div>
  );
}