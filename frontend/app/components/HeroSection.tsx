"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HeroSection() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.7 }}
        className="text-4xl md:text-6xl font-bold"
      >
        SnapMind 🧠
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-lg md:text-2xl max-w-xl text-neutral-200"
      >
        Unlocking insights from images using{" "}
        <span className="text-pink-300 font-semibold">AI</span>
      </motion.p>
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        onClick={() => router.push("/upload")}
        className="bg-white text-black font-medium px-6 py-3 rounded-full shadow-lg hover:bg-gray-100 transition"
      >
        Get Started
      </motion.button>
    </div>
  );
}
