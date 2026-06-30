"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Gamepad2,
  Users,
  Plus,
  ArrowRight,
  Search,
  Globe,
  Lock,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import type { RoomInfo } from "@/types";
import { playSound } from "@/lib/sounds";

export default function LobbyPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);

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

    const cleanupRooms = on("room:list", (data: unknown) => {
      setRooms(data as RoomInfo[]);
      setLoading(false);
    });

    const cleanupJoined = on("room:joined", (data: unknown) => {
      const d = data as { code: string };
      router.push(`/game/${d.code}`);
    });

    const cleanupError = on("room:error", (data: unknown) => {
      const d = data as { message: string };
      alert(d.message);
      setJoining(false);
    });

    return () => {
      cleanupRooms();
      cleanupJoined();
      cleanupError();
    };
  }, [on]);

  const handleJoin = () => {
    if (!roomCode.trim()) return;
    playSound("player_join");
    setJoining(true);
    emit("room:join", {
      code: roomCode.toUpperCase(),
      userId,
      username,
      avatar: "#EF4444",
      color: "#EF4444",
    });
  };

  const handleRefresh = () => {
    playSound("button_click");
    setLoading(true);
    emit("room:list", {});
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-center mb-2">
            <span className="text-gradient">Game Lobby</span>
          </h1>
          <p className="text-white/50 text-center mb-8">
            Join a room or create your own
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Link href="/game/create" className="block">
                <div className="card p-6 hover:border-imposter-red/30 transition-all cursor-pointer group h-full">
                  <div className="w-14 h-14 rounded-xl bg-imposter-red/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="w-7 h-7 text-imposter-red" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Create Room</h3>
                  <p className="text-white/50 text-sm mb-4">
                    Set up a new game with custom rules and invite your friends
                  </p>
                  <div className="flex items-center gap-2 text-imposter-red text-sm font-medium">
                    <span>Create Game</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                <div className="w-14 h-14 rounded-xl bg-imposter-blue/20 flex items-center justify-center mb-4">
                  <Search className="w-7 h-7 text-imposter-blue" />
                </div>
                <h3 className="text-xl font-bold mb-2">Join Room</h3>
                <p className="text-white/50 text-sm mb-4">
                  Enter a room code to join an existing game
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="input-field flex-1 uppercase tracking-widest font-mono text-center"
                    placeholder="ROOM CODE"
                    maxLength={6}
                  />
                  <button
                    onClick={handleJoin}
                    disabled={joining || !roomCode.trim()}
                    className="btn-primary px-4 disabled:opacity-50"
                  >
                    {joining ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <ArrowRight className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Globe className="w-5 h-5 text-imposter-green" />
                  Public Rooms
                </h3>
                <button
                  onClick={handleRefresh}
                  className="btn-ghost text-sm flex items-center gap-1"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>
              </div>

              {rooms.length === 0 ? (
                <div className="text-center py-12 text-white/30">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No public rooms available</p>
                  <p className="text-sm mt-1">Create one and invite friends!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {rooms.map((room) => (
                    <div
                      key={room.code}
                      className="flex items-center justify-between bg-imposter-dark-lighter/50 rounded-xl p-4 hover:bg-imposter-dark-lighter transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-imposter-red/20 flex items-center justify-center">
                          {room.isPublic ? (
                            <Globe className="w-5 h-5 text-imposter-green" />
                          ) : (
                            <Lock className="w-5 h-5 text-white/50" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{room.hostName}&apos;s Room</div>
                          <div className="text-sm text-white/50">
                            {room.code} • {room.mapName}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-white/50">
                          <span className="text-white font-medium">
                            {room.playerCount}
                          </span>
                          /{room.maxPlayers} players
                        </div>
                        <button
                          onClick={() => {
                            setRoomCode(room.code);
                            handleJoin();
                          }}
                          className="btn-primary py-2 px-4 text-sm"
                        >
                          Join
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center"
          >
            <Link
              href="/game/pass-and-play/setup"
              className="text-white/50 hover:text-white transition-colors text-sm"
            >
              Want to play locally? Try <span className="text-imposter-red font-medium">Pass & Play</span> mode →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
