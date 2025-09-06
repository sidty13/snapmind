"use client";
import HeroSection from "@/app/components/HeroSection";
import CategoryGrid from "@/app/components/CategoryGrid";
import Navbar from "@/app/components/Navbar";
import AuroraBackground from "@/app/components/AuroraBackground";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col bg-zinc-900 text-white overflow-hidden">
      <AuroraBackground />
      <Navbar />
      <HeroSection />
      <CategoryGrid />
    </main>
  );
}
