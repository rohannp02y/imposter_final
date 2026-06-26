"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Settings,
  Users,
  Copy,
  Check,
  LogOut,
  Loader2,
  Crown,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import { useGameStore } from "@/store/gameStore";
import type { GameState, PlayerState } from "@/types";

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("#EF4444");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);

  const { game, setGame, setLocalPlayerId } = useGameStore();
  const { emit, on, isConnected } = useSocket(userId);
  const initializedRef = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem("imposter_user");
    if (stored) {
      const user = JSON.parse(stored);
      setUserId(user.id);
      setUsername(user.username);
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  useEffect(() => {
    if (!userId || !code || initializedRef.current) return;
    initializedRef.current = true;

    setLocalPlayerId(userId);

    emit("room:join", { code, userId, username, avatar });

    emit("game:state", { code });
  }, [userId, code, username, avatar, emit, setLocalPlayerId]);

  useEffect(() => {
    if (!on) return;

    const cleanupJoined = on("room:joined", (data: unknown) => {
      const d = data as { game: GameState };
      setGame(d.game);
      setJoined(true);
    });

    const cleanupUpdated = on("room:updated", (data: unknown) => {
      const d = data as GameState;
      setGame(d);
    });

    const cleanupError = on("room:error", (data: unknown) => {
      const d = data as { message: string };
      setError(d.message);
    });

    const cleanupStarted = on("game:started", (data: unknown) => {
      const d = data as GameState;
      setGame(d);
      router.push(`/game/${code}/play`);
    });

    const cleanupState = on("game:state", (data: unknown) => {
      const d = data as GameState;
      if (d) {
        setGame(d);
        setJoined(true);
      }
    });

    return () => {
      cleanupJoined();
      cleanupUpdated();
      cleanupError();
      cleanupStarted();
      cleanupState();
    };
  }, [on, code, setGame, router]);

  const handleReady = () => {
    emit("room:ready", { code, userId });
  };

  const handleStart = () => {
    emit("game:start", { code, userId });
  };

  const handleLeave = () => {
    emit("room:leave", { code, userId });
    router.push("/game/lobby");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isHost = game?.hostId === userId;
  const currentPlayer = game?.players.find((p) => p.userId === userId);
  const allReady = game?.players.every((p) => p.isReady || p.userId === game.hostId);

  if (error) {
    return (
      <div className="min-h-screen pt-20 pb-8 px-4 flex items-center justify-center">
        <div className="card p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p className="text-white/50 mb-6">{error}</p>
          <button
            onClick={() => router.push("/game/lobby")}
            className="btn-primary"
          >
            Back to Lobby
          </button>
        </div>
      </div>
    );
  }

  if (!joined || !game) {
    return (
      <div className="min-h-screen pt-20 pb-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-imposter-red animate-spin mx-auto mb-4" />
          <p className="text-white/50">Connecting to room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold">Waiting Room</h1>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isConnected ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span className="text-sm text-white/50">
                      {isConnected ? "Connected" : "Disconnected"}
                    </span>
                  </div>
                </div>

                <div className="bg-imposter-dark-lighter rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-white/50">Room Code</div>
                      <div className="text-3xl font-mono font-bold tracking-widest text-imposter-red">
                        {code}
                      </div>
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className="btn-ghost"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <div className="text-sm text-white/50 mt-2">
                    Share this code with friends to join
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Players ({game.players.length}/{game.settings.maxPlayers})
                    </h2>
                  </div>

                  <div className="space-y-2">
                    {game.players.map((player) => (
                      <PlayerCard
                        key={player.id}
                        player={player}
                        isHost={player.userId === game.hostId}
                        isSelf={player.userId === userId}
                      />
                    ))}
                  </div>

                  {Array.from({
                    length: game.settings.maxPlayers - game.players.length,
                  }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-white/10 mt-2"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <span className="text-white/20">?</span>
                      </div>
                      <span className="text-white/20">Waiting for player...</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleLeave}
                    className="btn-secondary flex-1"
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />
                    Leave
                  </button>

                  {!isHost && (
                    <button
                      onClick={handleReady}
                      className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all ${
                        currentPlayer?.isReady
                          ? "bg-green-500 text-white"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {currentPlayer?.isReady ? (
                        <>
                          <CheckCircle className="w-4 h-4 inline mr-2" />
                          Ready
                        </>
                      ) : (
                        "Ready Up"
                      )}
                    </button>
                  )}

                  {isHost && (
                    <button
                      onClick={handleStart}
                      disabled={game.players.length < game.settings.minPlayers || !allReady}
                      className="btn-primary flex-1 disabled:opacity-50"
                    >
                      <Play className="w-4 h-4 inline mr-2" />
                      Start Game
                    </button>
                  )}
                </div>

                {game.players.length < game.settings.minPlayers && (
                  <p className="text-center text-sm text-white/40 mt-4">
                    Need at least {game.settings.minPlayers} players to start
                  </p>
                )}
              </div>
            </div>

            <div className="lg:w-80">
              <div className="card p-6">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Game Settings
                </h2>

                <div className="space-y-3 text-sm">
                  <SettingRow label="Map" value={game.settings.mapName} />
                  <SettingRow
                    label="Imposters"
                    value={game.settings.numImposters.toString()}
                  />
                  <SettingRow
                    label="Tasks"
                    value={`${game.settings.taskCount} per player`}
                  />
                  <SettingRow
                    label="Discussion"
                    value={`${game.settings.discussionTime}s`}
                  />
                  <SettingRow
                    label="Voting"
                    value={`${game.settings.votingTime}s`}
                  />
                  <SettingRow
                    label="Kill Cooldown"
                    value={`${game.settings.killCooldown}s`}
                  />
                  <SettingRow
                    label="Mode"
                    value={game.settings.isPassAndPlay ? "Pass & Play" : "Online"}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function PlayerCard({
  player,
  isHost,
  isSelf,
}: {
  player: PlayerState;
  isHost: boolean;
  isSelf: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
        isSelf ? "bg-imposter-red/10 border border-imposter-red/30" : "bg-white/5"
      }`}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
        style={{ backgroundColor: player.color }}
      >
        {player.username[0]?.toUpperCase()}
      </div>
      <div className="flex-1">
        <div className="font-medium flex items-center gap-2">
          {player.username}
          {isSelf && (
            <span className="text-xs bg-imposter-red/20 text-imposter-red px-2 py-0.5 rounded-full">
              You
            </span>
          )}
        </div>
      </div>
      {isHost && (
        <Crown className="w-4 h-4 text-yellow-400" />
      )}
      <div
        className={`w-3 h-3 rounded-full ${
          player.isReady ? "bg-green-500" : "bg-white/20"
        }`}
      />
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-white/50">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
