"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

export const AIContentChecker = () => {
    return (
        <section className="py-24 bg-[#0a0a0a] text-white relative">
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] to-[#0a0a0a]" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
                        >
                            Detect AI-Written <br />
                            <span className="text-purple-500">Content Instantly</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-400 text-lg mb-8"
                        >
                            Maintain the integrity of your assessments. Our proprietary model analyzes sentence structure, perplexity, and burstiness to identify AI-generated text with high accuracy.
                        </motion.p>

                        <div className="space-y-4">
                            {[
                                "Real-time analysis during the test",
                                "Detailed report with confidence scores",
                                "Plagiarism detection integration",
                                "Support for multiple languages"
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                    className="flex items-center gap-3"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-purple-500" />
                                    <span className="text-gray-300">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 w-full">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative bg-[#111] rounded-2xl p-6 border border-white/10 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <span className="text-xs text-gray-500 font-mono">analysis_result.json</span>
                            </div>

                            <div className="space-y-4 font-mono text-sm">
                                <div className="p-4 rounded bg-red-500/10 border border-red-500/20">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-red-400 font-bold">AI Probability: High</span>
                                        <XCircle className="w-4 h-4 text-red-400" />
                                    </div>
                                    <p className="text-gray-400">
                                        "The implementation of the binary search tree demonstrates optimal time complexity..."
                                    </p>
                                </div>

                                <div className="p-4 rounded bg-green-500/10 border border-green-500/20">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-green-400 font-bold">Human Probability: High</span>
                                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                                    </div>
                                    <p className="text-gray-400">
                                        "I struggled a bit with the edge cases, specifically when the array was empty, so I added a check..."
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
