"use client";
import React from "react";
import { motion } from "framer-motion";

const categories = [
  { name: "Food", emoji: "🍔", color: "bg-pink-500" },
  { name: "Pets", emoji: "🐶", color: "bg-yellow-400" },
  { name: "Nature", emoji: "🌿", color: "bg-green-500" },
  { name: "Art", emoji: "🎨", color: "bg-indigo-500" },
  { name: "Fashion", emoji: "👗", color: "bg-purple-500" },
];

export default function CategoryGrid() {
  return (
    <section className="px-6 pb-20 max-w-6xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
        Categories We Review
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index, duration: 0.4 }}
            className={`rounded-xl p-6 flex flex-col items-center justify-center ${cat.color} shadow-lg text-white hover:scale-105 transition-transform cursor-pointer`}
          >
            <span className="text-3xl mb-2">{cat.emoji}</span>
            <span className="font-semibold">{cat.name}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
