"use client";

import { motion } from "framer-motion";
import { Brain, FileText, Search, ShieldCheck } from "lucide-react";

const features = [
    {
        icon: <Brain className="w-8 h-8 text-purple-400" />,
        title: "AI-Driven Question Generation",
        description: "Generate tailored interview questions based on your specific knowledge base and requirements.",
    },
    {
        icon: <Search className="w-8 h-8 text-indigo-400" />,
        title: "RAG Knowledge Pipeline",
        description: "Ingest and retrieve information from your documents to evaluate answers with context-aware AI.",
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
        title: "AI Content Detection",
        description: "Ensure authenticity with our advanced AI content checker that flags AI-generated responses.",
    },
    {
        icon: <FileText className="w-8 h-8 text-blue-400" />,
        title: "Automated Grading",
        description: "Save time with instant, consistent, and unbiased evaluation of candidate answers.",
    },
];

export const Features = () => {
    return (
        <section className="py-24 bg-[#050505] text-white relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Powerful Features</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Everything you need to conduct efficient and effective technical interviews.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors group"
                        >
                            <div className="mb-4 p-3 rounded-lg bg-white/5 w-fit group-hover:bg-purple-500/20 transition-colors">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
