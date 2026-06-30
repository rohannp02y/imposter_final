"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GamepadIcon, SettingsIcon, LoaderIcon, CopyIcon, CheckIcon } from "@/components/icons/SvgIcons";
import { COLORS } from "@/types";
import { playSound } from "@/lib/sounds";

export default function CreateGamePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#EF4444");
  const [copied, setCopied] = useState(false);
  const [created, setCreated] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [settings, setSettings] = useState({
    maxPlayers: 10,
    numImposters: 1,
    mapName: "skeld",
    discussionTime: 60,
    votingTime: 30,
    killCooldown: 25,
    taskCount: 5,
  });

  const handleCreate = () => {
    if (!username) return;
    playSound("button_click");
    setLoading(true);
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setTimeout(() => {
      setRoomCode(code);
      setCreated(true);
      setLoading(false);
      playSound("player_join");
    }, 1000);
  };

  const handleCopyCode = () => {
    playSound("button_click");
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (created && roomCode) {
    return (
      <div className="min-h-screen pt-20 pb-8 px-6 flex items-center justify-center relative">
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm relative z-10"
        >
          <div className="card-surface p-8 text-center">
            <div className="w-12 h-12 bg-crimson/10 rounded-xl flex items-center justify-center mx-auto mb-6">
              <CheckIcon size={20} className="text-crimson" />
            </div>
            <h2 className="text-display text-2xl text-ink-primary mb-2">Room Ready</h2>
            <p className="text-ink-muted text-sm font-mono mb-8">Share this code</p>

            <div className="bg-canvas rounded-lg p-6 mb-6 border border-hairline">
              <div className="text-3xl font-mono font-medium tracking-[0.3em] text-crimson">
                {roomCode}
              </div>
            </div>

            <div className="space-y-3">
              <button onClick={handleCopyCode} className="btn-ghost w-full flex items-center justify-center gap-2">
                {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                {copied ? "Copied" : "Copy Code"}
              </button>
              <button onClick={() => router.push("/game/pass-and-play/play")} className="btn-primary w-full">
                Start Game
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-6 md:px-12 lg:px-24 relative">
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-ink-muted text-xs font-mono uppercase tracking-[0.3em] block mb-4">
            Configuration
          </span>
          <h1 className="text-display text-[clamp(2rem,4vw,3rem)] leading-[0.9] text-ink-primary mb-12">
            Create Room
          </h1>

          <div className="space-y-6">
            <div className="card-surface p-6">
              <div className="flex items-center gap-3 mb-6">
                <GamepadIcon size={16} className="text-crimson" />
                <span className="text-ink-muted text-xs font-mono uppercase tracking-widest">Identity</span>
              </div>

              <div className="flex items-center gap-6 mb-6">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-light"
                  style={{ backgroundColor: selectedColor }}
                >
                  {username ? username[0]?.toUpperCase() : "?"}
                </div>
                <div className="flex-1">
                  <label className="block text-ink-muted text-xs font-mono uppercase tracking-wider mb-2">Name</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field"
                    placeholder="Your name"
                    maxLength={15}
                  />
                </div>
              </div>

              <label className="block text-ink-muted text-xs font-mono uppercase tracking-wider mb-3">Color</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      selectedColor === color ? "border-white scale-110" : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="card-surface p-6">
              <div className="flex items-center gap-3 mb-6">
                <SettingsIcon size={16} className="text-crimson" />
                <span className="text-ink-muted text-xs font-mono uppercase tracking-widest">Parameters</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Players", key: "maxPlayers", values: [4, 6, 8, 10] },
                  { label: "Imposters", key: "numImposters", values: [1, 2, 3] },
                  { label: "Map", key: "mapName", values: ["skeld", "mira", "polus"], labels: ["The Skeld", "Mira HQ", "Polus"] },
                  { label: "Tasks", key: "taskCount", values: [3, 4, 5, 6, 7, 8] },
                  { label: "Discussion", key: "discussionTime", values: [0, 15, 30, 60, 90], suffix: "s" },
                  { label: "Voting", key: "votingTime", values: [15, 20, 30, 45, 60], suffix: "s" },
                  { label: "Cooldown", key: "killCooldown", values: [5, 10, 15, 20, 25, 30], suffix: "s" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-ink-muted text-xs font-mono uppercase tracking-wider mb-2">
                      {field.label}
                    </label>
                    <select
                      value={settings[field.key as keyof typeof settings]}
                      onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                      className="input-field"
                    >
                      {field.values.map((v, i) => (
                        <option key={v} value={v}>
                          {field.labels ? field.labels[i] : `${v}${field.suffix || ""}`}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleCreate}
              disabled={loading || !username}
              className="btn-primary w-full py-4 text-base disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <LoaderIcon size={18} /> : <GamepadIcon size={18} />}
              {loading ? "Initializing..." : "Create Room"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
