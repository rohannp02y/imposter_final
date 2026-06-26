"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Gamepad2,
  Users,
  Globe,
  Lock,
  Loader2,
} from "lucide-react";

interface RoomInfo {
  code: string;
  hostName: string;
  playerCount: number;
  maxPlayers: number;
  status: string;
  isPublic: boolean;
  mapName: string;
}

export default function LobbyPage() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const [publicRooms, setPublicRooms] = useState<RoomInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"create" | "join" | "browse">("create");

  const fetchPublicRooms = useCallback(async () => {
    try {
      const response = await fetch("/api/games");
      const data = await response.json();
      if (Array.isArray(data)) {
        setPublicRooms(data);
      }
    } catch {
      console.error("Failed to fetch rooms");
    }
  }, []);

  useEffect(() => {
    fetchPublicRooms();
    const interval = setInterval(fetchPublicRooms, 5000);
    return () => clearInterval(interval);
  }, [fetchPublicRooms]);

  const handleCreateRoom = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/session");
      const session = await response.json();

      if (!session?.user) {
        router.push("/auth/login");
        return;
      }

      router.push("/game/create");
    } catch {
      router.push("/game/create");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!joinCode.trim()) return;
    setLoading(true);
    try {
      router.push(`/game/${joinCode.toUpperCase()}`);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPlay = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/games");
      const rooms = await response.json();

      if (Array.isArray(rooms) && rooms.length > 0) {
        const availableRoom = rooms.find(
          (r: RoomInfo) => r.playerCount < r.maxPlayers && r.status === "WAITING"
        );

        if (availableRoom) {
          router.push(`/game/${availableRoom.code}`);
          return;
        }
      }

      handleCreateRoom();
    } catch {
      handleCreateRoom();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Game Lobby</span>
          </h1>
          <p className="text-white/50">
            Create a room, join friends, or find a public match
          </p>
        </motion.div>

        <div className="flex justify-center gap-2 mb-8">
          {(["create", "join", "browse"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl font-medium transition-all ${
                activeTab === tab
                  ? "bg-imposter-red text-white"
                  : "bg-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              {tab === "create" && <Plus className="w-4 h-4 inline mr-2" />}
              {tab === "join" && <Search className="w-4 h-4 inline mr-2" />}
              {tab === "browse" && <Globe className="w-4 h-4 inline mr-2" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "create" && (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="card p-6 sm:p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-imposter-red" />
                  Create New Room
                </h2>

                <div className="space-y-4">
                  <button
                    onClick={handleCreateRoom}
                    disabled={loading}
                    className="btn-primary w-full py-4 text-lg disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                    ) : (
                      <Gamepad2 className="w-5 h-5 inline mr-2" />
                    )}
                    Create Private Room
                  </button>

                  <button
                    onClick={handleQuickPlay}
                    disabled={loading}
                    className="btn-secondary w-full py-4 text-lg disabled:opacity-50"
                  >
                    <Globe className="w-5 h-5 inline mr-2" />
                    Quick Play
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "join" && (
            <motion.div
              key="join"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="card p-6 sm:p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Search className="w-5 h-5 text-imposter-red" />
                  Join Room
                </h2>

                <div className="flex gap-4">
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="Enter room code"
                    className="input-field flex-1 text-center text-2xl tracking-widest font-mono"
                    maxLength={6}
                    onKeyDown={(e) => e.key === "Enter" && handleJoinRoom()}
                  />
                  <button
                    onClick={handleJoinRoom}
                    disabled={loading || !joinCode.trim()}
                    className="btn-primary disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Join"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "browse" && (
            <motion.div
              key="browse"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="card p-6 sm:p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-imposter-red" />
                  Public Rooms
                </h2>

                {publicRooms.length === 0 ? (
                  <div className="text-center py-12 text-white/40">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No public rooms available</p>
                    <p className="text-sm mt-2">Create one and make it public!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {publicRooms.map((room) => (
                      <div
                        key={room.code}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                        onClick={() => router.push(`/game/${room.code}`)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-imposter-red/20 flex items-center justify-center">
                            <Gamepad2 className="w-5 h-5 text-imposter-red" />
                          </div>
                          <div>
                            <div className="font-medium">{room.hostName}&apos;s Room</div>
                            <div className="text-sm text-white/50 flex items-center gap-2">
                              <span className="font-mono">{room.code}</span>
                              <span>•</span>
                              <span>{room.mapName}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-medium">
                              {room.playerCount}/{room.maxPlayers}
                            </div>
                            <div className="text-xs text-white/50">players</div>
                          </div>
                          <div
                            className={`w-3 h-3 rounded-full ${
                              room.playerCount < room.maxPlayers
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
