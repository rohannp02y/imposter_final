"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { initAudio } from "@/lib/sounds";
import {
  GamepadIcon,
  GlobeIcon,
  UsersIcon,
  ShieldIcon,
  TagsIcon,
  SettingsIcon,
  MessageIcon,
  BarChartIcon,
  SmartphoneIcon,
  ChevronRightIcon,
  SparklesIcon,
  NepalFlagIcon,
} from "@/components/icons/SvgIcons";
import { IconCard } from "@/components/icons/IconCard";

const features = [
  {
    icon: <GlobeIcon size={28} />,
    title: "Nepal & Global Packs",
    description: "422+ Nepal words across 9 categories — celebrities, food, places, festivals, slang",
    gradient: "green" as const,
  },
  {
    icon: <UsersIcon size={28} />,
    title: "Pass & Play",
    description: "Local multiplayer on one device. Pass the phone, reveal roles, find the imposter!",
    gradient: "teal" as const,
  },
  {
    icon: <ZapIcon size={28} />,
    title: "Real-time Games",
    description: "Play online with friends via room codes or quick play matchmaking",
    gradient: "cyan" as const,
  },
  {
    icon: <ShieldIcon size={28} />,
    title: "Social Deduction",
    description: "Give clues, discuss, and vote to find the hidden imposter among your crew",
    gradient: "blue" as const,
  },
  {
    icon: <TagsIcon size={28} />,
    title: "Custom Categories",
    description: "Create your own word categories with custom hints and emojis",
    gradient: "purple" as const,
  },
  {
    icon: <SettingsIcon size={28} />,
    title: "Admin Panel",
    description: "Manage categories, players, and game settings from the admin dashboard",
    gradient: "magenta" as const,
  },
  {
    icon: <MessageIcon size={28} />,
    title: "Live Chat & Timer",
    description: "Discussion timer with countdown, voting system, and results reveal",
    gradient: "red" as const,
  },
  {
    icon: <BarChartIcon size={28} />,
    title: "Stats & Leaderboards",
    description: "Track wins, ELO rating, crew vs imposter performance",
    gradient: "orange" as const,
  },
  {
    icon: <SmartphoneIcon size={28} />,
    title: "Mobile Ready",
    description: "Convert to a native mobile app with React Native",
    gradient: "yellow" as const,
  },
];

const nepalWords = [
  "Momo", "Dal Bhat", "Sel Roti", "Dhaka Topi", "Namaste",
  "Bhai", "Chhora", "Didi", "Aamaa", "Bau",
];

function ZapIcon({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

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
        <div className="absolute inset-0 bg-gradient-to-b from-accent-primary/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-60 right-1/4 w-[200px] h-[200px] bg-blue-500/10 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-3 bg-accent-primary/20 border border-accent-primary/30 rounded-full px-5 py-2.5 mb-8">
              <NepalFlagIcon size={20} className="text-accent-primary" />
              <span className="text-sm text-accent-primary font-medium">
                Nepal Edition — Pass the phone, find the imposter!
              </span>
              <SparklesIcon size={16} className="text-accent-primary" />
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
            Pass the phone, find the imposter — <span className="text-accent-primary font-semibold">kasto suspense!</span>{" "}
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
              <GamepadIcon size={24} />
              Play Pass & Play
              <ChevronRightIcon size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/game/lobby"
              className="btn-secondary text-lg px-10 py-5 inline-flex items-center justify-center gap-3 group"
            >
              <GlobeIcon size={24} />
              Play Online
              <ChevronRightIcon size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 text-white/40 text-sm"
          >
            <div className="flex items-center gap-2">
              <NepalFlagIcon size={16} className="text-accent-primary" />
              <span>422+ Nepal words</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <TagsIcon size={16} className="text-accent-primary" />
              <span>13 categories</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <UsersIcon size={16} className="text-accent-primary" />
              <span>3-10 players</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <GlobeIcon size={16} className="text-accent-primary" />
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
                className="px-3 py-1 rounded-full bg-white/5 border border-border text-white/40 text-xs hover:bg-white/10 hover:text-white/60 transition-colors cursor-default"
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
                className="card p-6 hover:border-accent-primary/30 transition-all group"
              >
                <IconCard
                  icon={feature.icon}
                  gradient={feature.gradient}
                  size="md"
                  className="mb-4"
                />
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
            <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-transparent to-purple-500/10" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Play?
              </h2>
              <p className="text-white/50 mb-8 max-w-lg mx-auto text-lg">
                Gather 3-10 friends, pass the phone, and find the imposter.
                No peeking, bhai!
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

      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-white/30 text-sm">
          <div className="flex items-center gap-2">
            <NepalFlagIcon size={16} className="text-accent-primary" />
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
