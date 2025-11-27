import React from "react";

export default function ExamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-violet-500/30">
      {/* Optional: Minimal Header for branding only */}
      <header className="fixed top-0 left-0 w-full p-6 z-50 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-white/50">
          <span className="w-2 h-2 rounded-full bg-violet-500/50" />
          EvaluateIX
        </div>
      </header>
      
      <main className="h-full">
        {children}
      </main>
    </div>
  );
}