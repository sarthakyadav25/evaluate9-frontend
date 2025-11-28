import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { AIContentChecker } from "@/components/landing/AIContentChecker";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { CTA } from "@/components/landing/CTA";
import { Testimonials } from "@/components/landing/Testimonials";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      <Navbar />
      <Hero />
      <Features />
      <AIContentChecker />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
