"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { initAudio, playSound } from "@/lib/sounds";
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
  ChevronRight,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Nepal & Global Packs",
    description: "422+ Nepal words across 9 categories — celebrities, food, places, festivals, slang",
    color: "text-imposter-red",
    bg: "bg-imposter-red/20",
  },
  {
    icon: Users,
    title: "Pass & Play",
    description: "Local multiplayer on one device. Pass the phone, reveal roles, find the imposter!",
    color: "text-imposter-blue",
    bg: "bg-imposter-blue/20",
  },
  {
    icon: Zap,
    title: "Real-time Multiplayer",
    description: "Play online with friends via room codes or quick play matchmaking",
    color: "text-imposter-green",
    bg: "bg-imposter-green/20",
  },
  {
    icon: Shield,
    title: "Social Deduction",
    description: "Give clues, discuss, and vote to find the hidden imposter among your crew",
    color: "text-imposter-purple",
    bg: "bg-imposter-purple/20",
  },
  {
    icon: Tags,
    title: "Custom Categories",
    description: "Create your own word categories with custom hints and emojis",
    color: "text-imposter-yellow",
    bg: "bg-imposter-yellow/20",
  },
  {
    icon: Settings,
    title: "Admin Panel",
    description: "Manage categories, players, and game settings from the admin dashboard",
    color: "text-pink-400",
    bg: "bg-pink-500/20",
  },
  {
    icon: MessageCircle,
    title: "Live Chat & Timer",
    description: "Discussion timer with countdown, voting system, and results reveal",
    color: "text-cyan-400",
    bg: "bg-cyan-500/20",
  },
  {
    icon: BarChart3,
    title: "Stats & Leaderboards",
    description: "Track wins, ELO rating, crew vs imposter performance",
    color: "text-orange-400",
    bg: "bg-orange-500/20",
  },
  {
    icon: Smartphone,
    title: "Mobile Ready",
    description: "Convert to a native mobile app with React Native",
    color: "text-teal-400",
    bg: "bg-teal-500/20",
  },
];

const nepalWords = [
  "Momo", "Dal Bhat", "Sel Roti", "Dhaka Topi", "Namaste",
  "Bhai", "Chhora", "Didi", "Aamaa", "Bau",
];

export default function HomePage() {
  useEffect(() => {
    const handleInteraction = () => {
      initAudio();
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
    window.addEventListener("click", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);
    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-imposter-red/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-imposter-red/15 rounded-full blur-3xl" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-imposter-purple/10 rounded-full blur-3xl" />
        <div className="absolute top-60 right-1/4 w-[200px] h-[200px] bg-imposter-blue/10 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-imposter-red/20 border border-imposter-red/30 rounded-full px-5 py-2.5 mb-8 backdrop-blur-sm">
              <span className="text-lg">🇳🇵</span>
              <span className="text-sm text-imposter-red font-medium">
                Nepal Edition — Pass the phone, find the imposter!
              </span>
              <Sparkles className="w-4 h-4 text-imposter-yellow" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl sm:text-8xl font-extrabold mb-6 tracking-tight"
          >
            <span className="text-gradient">IMPOSTER</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Pass the phone, find the imposter — <span className="text-imposter-red font-semibold">kasto suspense!</span>{" "}
            A social deduction party game with Nepal&apos;s best words, food, festivals, and slang.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Link
              href="/game/pass-and-play/setup"
              className="btn-primary text-lg px-10 py-5 inline-flex items-center justify-center gap-3 group"
            >
              <span className="text-2xl">🎮</span>
              Play Pass & Play
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/game/lobby"
              className="btn-secondary text-lg px-10 py-5 inline-flex items-center justify-center gap-3 group"
            >
              <span className="text-2xl">🌐</span>
              Play Online
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 text-white/40 text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🇳🇵</span>
              <span>422+ Nepal words</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-lg">🌍</span>
              <span>13 categories</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-lg">🎲</span>
              <span>3-10 players</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-lg">🗺️</span>
              <span>3 maps</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 flex flex-wrap justify-center gap-2"
          >
            {nepalWords.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.8 + i * 0.05 }}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs hover:bg-white/10 hover:text-white/60 transition-colors cursor-default"
              >
                {word}
              </motion.span>
            ))}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="card p-6 hover:border-imposter-red/30 transition-all group"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-imposter-red/10 via-transparent to-imposter-purple/10" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Play? 🇳🇵
              </h2>
              <p className="text-white/50 mb-8 max-w-lg mx-auto text-lg">
                Gather 3-10 friends, pass the phone, and find the imposter.
                No peeking, bhai! 👀
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/game/pass-and-play/setup"
                  className="btn-primary text-lg px-8 py-4"
                >
                  Start Pass & Play
                </Link>
                <Link href="/admin" className="btn-secondary text-lg px-8 py-4">
                  Admin Panel
                </Link>
              </div>
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
            <Link href="/admin" className="hover:text-white transition-colors">
              Admin
            </Link>
            <Link
              href="/leaderboard"
              className="hover:text-white transition-colors"
            >
              Leaderboard
            </Link>
            <Link
              href="/custom"
              className="hover:text-white transition-colors"
            >
              Custom Categories
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
