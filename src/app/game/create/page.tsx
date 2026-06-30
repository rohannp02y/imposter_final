"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  GamepadIcon,
  SettingsIcon,
  LoaderIcon,
  CopyIcon,
  CheckIcon,
} from "@/components/icons/SvgIcons";
import { COLORS } from "@/types";
import { playSound } from "@/lib/sounds";

export default function CreateGamePage() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
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
    isPassAndPlay: false,
  });

  const handleCreate = () => {
    if (!username) return;
    playSound("button_click");
    setLoading(true);

    // Generate a room code
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
      <div className="min-h-screen pt-20 pb-8 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-accent-success/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckIcon size={32} className="text-accent-success" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Room Created!</h2>
            <p className="text-white/50 mb-6">Share this code with your friends</p>

            <div className="bg-imposter-dark rounded-xl p-6 mb-6">
              <div className="text-sm text-white/50 mb-2">Room Code</div>
              <div className="text-4xl font-mono font-bold tracking-widest text-accent-primary">
                {roomCode}
              </div>
            </div>

            <button
              onClick={handleCopyCode}
              className="btn-secondary w-full mb-4"
            >
              {copied ? (
                <>
                  <CheckIcon size={16} className="inline mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <CopyIcon size={16} className="inline mr-2" />
                  Copy Code
                </>
              )}
            </button>

            <button
              onClick={() => router.push("/game/pass-and-play/play")}
              className="btn-primary w-full"
            >
              Start Game
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-center mb-8">
            <span className="text-gradient">Create Game</span>
          </h1>

          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <GamepadIcon size={20} className="text-accent-primary" />
                Your Character
              </h2>

              <div className="flex items-center gap-6">
                <div
                  className="w-20 h-20 rounded-full border-4 border-border flex items-center justify-center"
                  style={{ backgroundColor: selectedColor }}
                >
                  <span className="text-2xl font-bold text-white">
                    {username ? username[0]?.toUpperCase() : "?"}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="text-sm text-white/50 mb-2">Name</div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field"
                    placeholder="Enter your name"
                    maxLength={15}
                  />
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm text-white/50 mb-3">Color</div>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? "border-white scale-110"
                          : "border-transparent hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <SettingsIcon size={20} className="text-accent-primary" />
                Game Settings
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/50 block mb-2">
                    Max Players
                  </label>
                  <select
                    value={settings.maxPlayers}
                    onChange={(e) =>
                      setSettings({ ...settings, maxPlayers: Number(e.target.value) })
                    }
                    className="input-field"
                  >
                    {[4, 6, 8, 10, 12, 15].map((n) => (
                      <option key={n} value={n}>
                        {n} Players
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-white/50 block mb-2">
                    Imposters
                  </label>
                  <select
                    value={settings.numImposters}
                    onChange={(e) =>
                      setSettings({ ...settings, numImposters: Number(e.target.value) })
                    }
                    className="input-field"
                  >
                    {[1, 2, 3].map((n) => (
                      <option key={n} value={n}>
                        {n} Imposter{n > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-white/50 block mb-2">
                    Map
                  </label>
                  <select
                    value={settings.mapName}
                    onChange={(e) =>
                      setSettings({ ...settings, mapName: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="skeld">The Skeld</option>
                    <option value="mira">Mira HQ</option>
                    <option value="polus">Polus</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-white/50 block mb-2">
                    Tasks per Player
                  </label>
                  <select
                    value={settings.taskCount}
                    onChange={(e) =>
                      setSettings({ ...settings, taskCount: Number(e.target.value) })
                    }
                    className="input-field"
                  >
                    {[3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n}>
                        {n} Tasks
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-white/50 block mb-2">
                    Discussion Time
                  </label>
                  <select
                    value={settings.discussionTime}
                    onChange={(e) =>
                      setSettings({ ...settings, discussionTime: Number(e.target.value) })
                    }
                    className="input-field"
                  >
                    {[0, 15, 30, 45, 60, 90, 120].map((n) => (
                      <option key={n} value={n}>
                        {n}s
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-white/50 block mb-2">
                    Voting Time
                  </label>
                  <select
                    value={settings.votingTime}
                    onChange={(e) =>
                      setSettings({ ...settings, votingTime: Number(e.target.value) })
                    }
                    className="input-field"
                  >
                    {[15, 20, 30, 45, 60, 90].map((n) => (
                      <option key={n} value={n}>
                        {n}s
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-white/50 block mb-2">
                    Kill Cooldown
                  </label>
                  <select
                    value={settings.killCooldown}
                    onChange={(e) =>
                      setSettings({ ...settings, killCooldown: Number(e.target.value) })
                    }
                    className="input-field"
                  >
                    {[5, 10, 15, 20, 25, 30, 45, 60].map((n) => (
                      <option key={n} value={n}>
                        {n}s
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleCreate}
              disabled={loading || !username}
              className="btn-primary w-full py-4 text-lg disabled:opacity-50"
            >
              {loading ? (
                <LoaderIcon size={20} className="inline mr-2" />
              ) : (
                <GamepadIcon size={20} className="inline mr-2" />
              )}
              Create Room
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
