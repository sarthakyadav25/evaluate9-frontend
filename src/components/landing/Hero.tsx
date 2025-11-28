"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5], [25, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);

  return (
    <section ref={containerRef} className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#050505] text-white pt-20">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 z-10 flex flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-white to-purple-400"
        >
          Master Your Interviews with <br />
          <span className="text-purple-500">AI-Powered Precision</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10"
        >
          EvaluateIX combines advanced RAG technology with AI content detection to streamline your hiring process and ensure authentic assessments.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="relative w-full max-w-5xl mt-12" style={{ perspective: "1000px" }}>
            <motion.div
              style={{
                rotateX: rotateX,
                scale: scale,
                transformStyle: "preserve-3d"
              }}
              className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a0a]"
            >
              <Image
                src="/assets/dashboard-screenshot.jpg"
                alt="EvaluateIX Dashboard"
                width={1200}
                height={800}
                className="w-full h-auto object-cover"
                priority
              />

              {/* Gradient Overlay for blending */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-50" />
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
