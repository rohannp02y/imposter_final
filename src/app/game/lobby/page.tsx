"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  GlobeIcon,
  GamepadIcon,
  UsersIcon,
  ArrowRightIcon,
} from "@/components/icons/SvgIcons";
import { IconCard } from "@/components/icons/IconCard";

export default function LobbyPage() {
  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-center mb-2">
            <span className="text-gradient">Play Online</span>
          </h1>
          <p className="text-white/50 text-center mb-8">
            Connect with friends and play together
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Link href="/game/create" className="block">
                <div className="card p-6 hover:border-accent-primary/30 transition-all cursor-pointer group h-full">
                  <IconCard
                    icon={<GamepadIcon size={28} />}
                    gradient="blue"
                    size="lg"
                    className="mb-4"
                  />
                  <h3 className="text-xl font-bold mb-2">Create Room</h3>
                  <p className="text-white/50 text-sm mb-4">
                    Set up a new game with custom rules and invite your friends
                  </p>
                  <div className="flex items-center gap-2 text-accent-primary text-sm font-medium">
                    <span>Create Game</span>
                    <ArrowRightIcon size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="card p-6 h-full">
                <IconCard
                  icon={<UsersIcon size={28} />}
                  gradient="purple"
                  size="lg"
                  className="mb-4"
                />
                <h3 className="text-xl font-bold mb-2">Quick Play</h3>
                <p className="text-white/50 text-sm mb-4">
                  Find a match automatically and jump into the action
                </p>
                <div className="bg-surface-hover rounded-xl p-4 text-center">
                  <GlobeIcon size={32} className="text-white/30 mx-auto mb-2" />
                  <p className="text-white/40 text-sm">
                    Online multiplayer coming soon!
                  </p>
                  <p className="text-white/30 text-xs mt-1">
                    For now, try Pass & Play mode
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <Link
              href="/game/pass-and-play/setup"
              className="text-white/50 hover:text-white transition-colors text-sm"
            >
              Want to play locally? Try <span className="text-accent-primary font-medium">Pass & Play</span> mode
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
