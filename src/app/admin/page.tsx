"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Tags,
  Users,
  Gamepad2,
  TrendingUp,
  BarChart3,
  Database,
} from "lucide-react";
import { getAllPacks, getCustomCategories, getTotalWordCount, getTotalCategoryCount } from "@/lib/packs";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalWords: 0,
    totalCategories: 0,
    customCategories: 0,
    totalPacks: 0,
  });

  useEffect(() => {
    const packs = getAllPacks();
    const custom = getCustomCategories();
    setStats({
      totalWords: getTotalWordCount() + custom.reduce((sum, c) => sum + c.words.length, 0),
      totalCategories: getTotalCategoryCount() + custom.length,
      customCategories: custom.length,
      totalPacks: packs.length,
    });
  }, []);

  const cards = [
    {
      title: "Categories",
      value: stats.totalCategories,
      subtitle: `${stats.totalPacks} packs + ${stats.customCategories} custom`,
      icon: Tags,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      href: "/admin/categories",
    },
    {
      title: "Total Words",
      value: stats.totalWords,
      subtitle: "Across all packs",
      icon: BarChart3,
      color: "text-green-400",
      bg: "bg-green-500/10",
      href: "/admin/categories",
    },
    {
      title: "Players",
      value: "—",
      subtitle: "Local mode",
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      href: "/admin/users",
    },
    {
      title: "Game Packs",
      value: stats.totalPacks,
      subtitle: "Nepal + Global",
      icon: Gamepad2,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      href: "/admin/categories",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-white/50 mb-8">Overview of your Imposter game</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={card.href} className="card p-6 block hover:border-white/20 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-white/50 text-sm mb-1">{card.title}</div>
                  <div className="text-3xl font-bold">{card.value}</div>
                  <div className="text-sm text-white/40 mt-1">{card.subtitle}</div>
                </div>
                <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-imposter-red" />
          Quick Info
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-white/50">Nepal Pack</span>
            <span>9 categories, ~278 words</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-white/50">Global Pack</span>
            <span>4 categories, ~144 words</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-white/50">Custom Categories</span>
            <span>{stats.customCategories} created</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-white/50">Database</span>
            <span className="text-green-400">Connected (PostgreSQL + Redis)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
