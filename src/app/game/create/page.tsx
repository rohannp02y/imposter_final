"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Gamepad2,
  Users,
  Settings,
  Loader2,
  Copy,
  Check,
  Globe,
  Lock,
} from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import { COLORS } from "@/types";

export default function CreateGamePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
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
    isPublic: false,
    isPassAndPlay: false,
  });

  const { emit, on } = useSocket(userId);

  useEffect(() => {
    const stored = localStorage.getItem("imposter_user");
    if (stored) {
      const user = JSON.parse(stored);
      setUserId(user.id);
      setUsername(user.username);
    } else {
      const tempId = `temp_${Date.now()}`;
      const tempName = `Player${Math.floor(Math.random() * 9999)}`;
      localStorage.setItem(
        "imposter_user",
        JSON.stringify({ id: tempId, username: tempName })
      );
      setUserId(tempId);
      setUsername(tempName);
    }
  }, []);

  useEffect(() => {
    if (!on) return;

    const cleanupCreated = on("room:created", (data: unknown) => {
      const d = data as { code: string };
      setRoomCode(d.code);
      setCreated(true);
    });

    const cleanupError = on("room:error", (data: unknown) => {
      const d = data as { message: string };
      alert(d.message);
      setLoading(false);
    });

    return () => {
      cleanupCreated();
      cleanupError();
    };
  }, [on]);

  const handleCreate = async () => {
    if (!userId || !username) return;
    setLoading(true);

    emit("room:create", {
      userId,
      username,
      avatar: selectedColor,
      color: selectedColor,
      settings,
    });
  };

  const handleCopyCode = () => {
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
            <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Room Created!</h2>
            <p className="text-white/50 mb-6">Share this code with your friends</p>

            <div className="bg-imposter-dark-lighter rounded-xl p-6 mb-6">
              <div className="text-sm text-white/50 mb-2">Room Code</div>
              <div className="text-4xl font-mono font-bold tracking-widest text-imposter-red">
                {roomCode}
              </div>
            </div>

            <button
              onClick={handleCopyCode}
              className="btn-secondary w-full mb-4"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 inline mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 inline mr-2" />
                  Copy Code
                </>
              )}
            </button>

            <button
              onClick={() => router.push(`/game/${roomCode}`)}
              className="btn-primary w-full"
            >
              Enter Room
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
                <Gamepad2 className="w-5 h-5 text-imposter-red" />
                Your Character
              </h2>

              <div className="flex items-center gap-6">
                <div
                  className="w-20 h-20 rounded-full border-4 border-white/20 flex items-center justify-center"
                  style={{ backgroundColor: selectedColor }}
                >
                  <span className="text-2xl font-bold text-white">
                    {username[0]?.toUpperCase()}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="text-sm text-white/50 mb-2">Name</div>
                  <div className="font-medium">{username}</div>
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
                <Settings className="w-5 h-5 text-imposter-red" />
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

                <div>
                  <label className="text-sm text-white/50 block mb-2">
                    Game Mode
                  </label>
                  <select
                    value={settings.isPassAndPlay ? "pass" : "online"}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        isPassAndPlay: e.target.value === "pass",
                      })
                    }
                    className="input-field"
                  >
                    <option value="online">Online</option>
                    <option value="pass">Pass & Play</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={settings.isPublic}
                  onChange={(e) =>
                    setSettings({ ...settings, isPublic: e.target.checked })
                  }
                  className="w-5 h-5 rounded bg-imposter-dark-lighter border-white/20 text-imposter-red focus:ring-imposter-red"
                />
                <label htmlFor="isPublic" className="flex items-center gap-2">
                  {settings.isPublic ? (
                    <Globe className="w-4 h-4 text-green-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-white/50" />
                  )}
                  <span className="text-sm">
                    {settings.isPublic ? "Public Room" : "Private Room"}
                  </span>
                </label>
              </div>
            </div>

            <button
              onClick={handleCreate}
              disabled={loading}
              className="btn-primary w-full py-4 text-lg disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
              ) : (
                <Gamepad2 className="w-5 h-5 inline mr-2" />
              )}
              Create Room
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
