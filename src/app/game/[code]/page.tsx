"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GamepadIcon, ArrowRightIcon, HomeIcon } from "@/components/icons/SvgIcons";
import Link from "next/link";

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  const [username, setUsername] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("imposter_user");
    if (stored) {
      const user = JSON.parse(stored);
      setUsername(user.username);
    }
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-accent-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <GamepadIcon size={32} className="text-accent-primary" />
          </div>

          <h1 className="text-2xl font-bold mb-2">Room: {code}</h1>
          <p className="text-white/50 mb-6">
            Online multiplayer is coming soon!
          </p>

          <div className="bg-surface rounded-xl p-6 mb-6">
            <p className="text-white/40 text-sm">
              For now, try <span className="text-accent-primary font-medium">Pass & Play</span> mode
              to play with friends on the same device.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/game/pass-and-play/setup"
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <GamepadIcon size={18} />
              Play Pass & Play
              <ArrowRightIcon size={16} />
            </Link>

            <Link
              href="/"
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <HomeIcon size={18} />
              Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
