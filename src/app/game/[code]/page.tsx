"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { GamepadIcon, ArrowRightIcon, HomeIcon } from "@/components/icons/SvgIcons";

export default function RoomPage() {
  const params = useParams();
  const code = params.code as string;

  return (
    <div className="min-h-screen pt-20 pb-8 px-6 flex items-center justify-center relative">
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="card-surface p-8 text-center">
          <div className="w-12 h-12 bg-crimson/10 rounded-xl flex items-center justify-center mx-auto mb-6">
            <GamepadIcon size={20} className="text-crimson" />
          </div>
          <h1 className="text-display text-2xl text-ink-primary mb-2">Room {code}</h1>
          <p className="text-ink-muted text-sm font-mono mb-8">Online play coming soon</p>

          <div className="space-y-3">
            <Link href="/game/pass-and-play/setup" className="btn-primary w-full flex items-center justify-center gap-2">
              <GamepadIcon size={16} /> Play Locally
            </Link>
            <Link href="/" className="btn-ghost w-full flex items-center justify-center gap-2">
              <HomeIcon size={16} /> Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
