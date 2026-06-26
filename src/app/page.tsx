"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Zap,
  Shield,
  MessageCircle,
  BarChart3,
  Smartphone,
  Globe,
  Tags,
  Settings,
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Nepal & Global Packs",
    description: "278+ Nepal words across 9 categories — celebrities, food, places, festivals, slang",
  },
  {
    icon: Users,
    title: "Pass & Play",
    description: "Local multiplayer on one device. Pass the phone, reveal roles, find the imposter!",
  },
  {
    icon: Zap,
    title: "Real-time Multiplayer",
    description: "Play online with friends via room codes or quick play matchmaking",
  },
  {
    icon: Shield,
    title: "Social Deduction",
    description: "Give clues, discuss, and vote to find the hidden imposter among your crew",
  },
  {
    icon: Tags,
    title: "Custom Categories",
    description: "Create your own word categories with custom hints and emojis",
  },
  {
    icon: Settings,
    title: "Admin Panel",
    description: "Manage categories, players, and game settings from the admin dashboard",
  },
  {
    icon: MessageCircle,
    title: "Live Chat & Timer",
    description: "Discussion timer with countdown, voting system, and results reveal",
  },
  {
    icon: BarChart3,
    title: "Stats & Leaderboards",
    description: "Track wins, ELO rating, crew vs imposter performance",
  },
  {
    icon: Smartphone,
    title: "Mobile Ready",
    description: "Convert to a native mobile app with React Native",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-imposter-red/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-imposter-red/20 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-imposter-red/20 border border-imposter-red/30 rounded-full px-4 py-2 mb-8">
              <span className="text-lg">🇳🇵</span>
              <span className="text-sm text-imposter-red font-medium">
                Nepal Edition — Pass the phone, find the imposter!
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-7xl font-bold mb-6"
          >
            <span className="text-gradient">IMPOSTER</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl sm:text-2xl text-white/60 mb-10 max-w-2xl mx-auto"
          >
            Pass the phone, find the imposter — <span className="text-imposter-red">kasto suspense!</span>{" "}
            🇳🇵 A social deduction party game with Nepal&apos;s best words, food, festivals, and slang.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/game/pass-and-play/setup" className="btn-primary text-lg px-8 py-4">
              🎮 Play Pass & Play
            </Link>
            <Link href="/game/lobby" className="btn-secondary text-lg px-8 py-4">
              🌐 Play Online
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 flex items-center justify-center gap-8 text-white/40 text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🇳🇵</span>
              <span>422+ Nepal words</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🌍</span>
              <span>13 categories</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🎲</span>
              <span>3-10 players</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-center mb-4"
          >
            Everything You Need
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/50 text-center mb-12 max-w-xl mx-auto"
          >
            Nepal&apos;s ultimate party game with all the features you love
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="card p-6 hover:border-imposter-red/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-imposter-red/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-imposter-red" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 sm:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Play? 🇳🇵
            </h2>
            <p className="text-white/50 mb-8 max-w-lg mx-auto">
              Gather 3-10 friends, pass the phone, and find the imposter.
              No peeking, bhai! 👀
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/game/pass-and-play/setup" className="btn-primary text-lg px-8 py-4">
                Start Pass & Play
              </Link>
              <Link href="/admin" className="btn-secondary text-lg px-8 py-4">
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-white/30 text-sm">
          <div className="flex items-center gap-2">
            <span>🇳🇵</span>
            <span>Imposter Nepal Edition</span>
          </div>
          <div className="flex gap-4">
            <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
            <Link href="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
            <Link href="/custom" className="hover:text-white transition-colors">Custom Categories</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
