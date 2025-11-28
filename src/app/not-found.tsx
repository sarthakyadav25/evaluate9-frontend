import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white relative overflow-hidden font-sans">
      
      {/* --- Background Ambient Glow --- */}
      <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Noise Texture (Optional, matches your branding) */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay"></div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-8 p-6">
        
        {/* Big 404 Typography */}
        <h1 className="text-[120px] md:text-[180px] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-zinc-700 via-zinc-800 to-transparent opacity-50 select-none">
          404
        </h1>
        
        <div className="space-y-3 -mt-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Page not found
          </h2>
          <p className="text-lg text-zinc-500 max-w-[500px]">
            The page you are looking for doesn't exist, has been moved, or is restricted.
          </p>
        </div>

        {/* Action Button */}
        <Button asChild className="bg-white text-black hover:bg-zinc-200 h-12 px-8 text-base font-medium transition-all">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Return to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}