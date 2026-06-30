"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GamepadIcon, GlobeIcon, ArrowRightIcon } from "@/components/icons/SvgIcons";

export default function LobbyPage() {
  return (
    <div className="min-h-screen pt-20 pb-8 px-6 md:px-12 lg:px-24 relative">
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      <div className="max-w-[1400px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-ink-muted text-xs font-mono uppercase tracking-[0.3em] block mb-4">
            Online
          </span>
          <h1 className="text-display text-[clamp(2.5rem,5vw,4rem)] leading-[0.9] text-ink-primary mb-4">
            Connect
          </h1>
          <p className="text-ink-secondary text-lg font-light mb-16 max-w-md">
            Play with friends across the network.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <Link href="/game/create" className="block group">
                <div className="card-surface p-8 h-full hover:border-crimson/20 transition-colors duration-500">
                  <div className="w-12 h-12 rounded-xl bg-crimson/10 flex items-center justify-center mb-6 group-hover:bg-crimson/20 transition-colors">
                    <GamepadIcon size={20} className="text-crimson" />
                  </div>
                  <h3 className="text-editorial text-xl text-ink-primary mb-2">Create Room</h3>
                  <p className="text-ink-secondary text-sm mb-6">
                    Set up a game and invite others to join.
                  </p>
                  <div className="flex items-center gap-2 text-crimson text-xs font-mono uppercase tracking-wider">
                    <span>Initialize</span>
                    <ArrowRightIcon size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="card-surface p-8 h-full">
                <div className="w-12 h-12 rounded-xl bg-ink-ghost/30 flex items-center justify-center mb-6">
                  <GlobeIcon size={20} className="text-ink-muted" />
                </div>
                <h3 className="text-editorial text-xl text-ink-primary mb-2">Quick Match</h3>
                <p className="text-ink-secondary text-sm mb-6">
                  Find opponents automatically.
                </p>
                <div className="bg-canvas rounded-lg p-4 border border-hairline">
                  <p className="text-ink-muted text-xs font-mono text-center">
                    Coming soon
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-12"
          >
            <Link
              href="/game/pass-and-play/setup"
              className="text-ink-muted hover:text-ink-primary text-xs font-mono uppercase tracking-wider transition-colors"
            >
              Or play locally →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
