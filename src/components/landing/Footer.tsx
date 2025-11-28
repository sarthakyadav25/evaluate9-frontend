"use client";

import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
    return (
        <footer className="bg-[#050505] text-white border-t border-white/10 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-white mb-4">
                            EvaluateIX
                        </h3>
                        <p className="text-gray-400 mb-6 max-w-sm">
                            Empowering companies to build the best teams with AI-driven interview assessments and integrity checks.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Github, Linkedin, Instagram].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-purple-500/20 hover:text-purple-400 transition-all border border-white/10"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="font-semibold mb-6 text-lg">Product</h4>
                        <ul className="space-y-4 text-gray-400">
                            {["Features", "Pricing", "Integrations", "Enterprise", "Changelog"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="hover:text-purple-400 transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6 text-lg">Company</h4>
                        <ul className="space-y-4 text-gray-400">
                            {["About Us", "Careers", "Blog", "Contact", "Partners"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="hover:text-purple-400 transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6 text-lg">Resources</h4>
                        <ul className="space-y-4 text-gray-400">
                            {["Documentation", "API Reference", "Community", "Help Center", "Status"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="hover:text-purple-400 transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="border-t border-white/10 pt-12 pb-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <h4 className="text-xl font-semibold mb-2">Subscribe to our newsletter</h4>
                            <p className="text-gray-400">Get the latest updates and resources delivered to your inbox.</p>
                        </div>
                        <div className="flex w-full md:w-auto gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:border-purple-500 transition-colors"
                            />
                            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} EvaluateIX. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-sm text-gray-500">
                        <Link href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-purple-400 transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-purple-400 transition-colors">Cookie Settings</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
