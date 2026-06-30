"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Play,
  Trash2,
  Plus,
  Settings,
  ArrowRight,
  ArrowLeft,
  Gamepad2,
  Copy,
  Check,
} from "lucide-react";
import { COLORS } from "@/types";
import { playSound } from "@/lib/sounds";

interface Player {
  id: string;
  name: string;
  color: string;
}

const STEPS = {
  PLAYERS: "players",
  SETTINGS: "settings",
  REVEAL: "reveal",
};

export default function PassAndPlaySetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(STEPS.PLAYERS);
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "", color: COLORS[0] },
    { id: "2", name: "", color: COLORS[1] },
  ]);
  const [numImposters, setNumImposters] = useState(1);
  const [taskCount, setTaskCount] = useState(5);
  const [discussionTime, setDiscussionTime] = useState(60);
  const [votingTime, setVotingTime] = useState(30);
  const [killCooldown, setKillCooldown] = useState(25);
  const [mapName, setMapName] = useState("skeld");
  const [revealedPlayers, setRevealedPlayers] = useState<string[]>([]);
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
  const [shuffledPlayers, setShuffledPlayers] = useState<Player[]>([]);
  const [imposterIndices, setImposterIndices] = useState<number[]>([]);

  const usedColors = players.map((p) => p.color);
  const availableColors = COLORS.filter((c) => !usedColors.includes(c));
  const validPlayers = players.filter((p) => p.name.trim());

  const addPlayer = () => {
    if (players.length >= 10) return;
    const nextColor =
      availableColors[0] || COLORS[players.length % COLORS.length];
    setPlayers([
      ...players,
      { id: Date.now().toString(), name: "", color: nextColor },
    ]);
  };

  const removePlayer = (id: string) => {
    if (players.length <= 3) return;
    setPlayers(players.filter((p) => p.id !== id));
  };

  const updatePlayer = (id: string, field: keyof Player, value: string) => {
    setPlayers(
      players.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleStart = () => {
    playSound("button_click");
    const shuffled = [...validPlayers].sort(() => Math.random() - 0.5);
    const indices: number[] = [];
    while (indices.length < numImposters) {
      const idx = Math.floor(Math.random() * shuffled.length);
      if (!indices.includes(idx)) indices.push(idx);
    }
    setShuffledPlayers(shuffled);
    setImposterIndices(indices);
    setRevealedPlayers([]);
    setCurrentRevealIndex(0);
    setStep(STEPS.REVEAL);
  };

  const handleReveal = () => {
    playSound("role_reveal");
    const player = shuffledPlayers[currentRevealIndex];
    setRevealedPlayers([...revealedPlayers, player.id]);

    if (currentRevealIndex < shuffledPlayers.length - 1) {
      setCurrentRevealIndex(currentRevealIndex + 1);
    } else {
      const gameState = {
        mode: "pass-and-play",
        players: shuffledPlayers.map((p, i) => ({
          ...p,
          role: imposterIndices.includes(i) ? "IMPOSTER" : "CREW",
        })),
        settings: {
          numImposters,
          taskCount,
          discussionTime,
          votingTime,
          killCooldown,
          mapName,
        },
      };
      localStorage.setItem("imposter_passplay_game", JSON.stringify(gameState));
      router.push("/game/pass-and-play/play");
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-center mb-2">
            <span className="text-gradient">Pass & Play</span>
          </h1>
          <p className="text-white/50 text-center mb-8">
            {step === STEPS.PLAYERS && "Add players and pick their colors"}
            {step === STEPS.SETTINGS && "Configure game settings"}
            {step === STEPS.REVEAL && "Pass the device to reveal roles"}
          </p>

          <div className="flex items-center justify-center gap-2 mb-8">
            {["players", "settings", "reveal"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === s
                      ? "bg-imposter-red text-white"
                      : ["players", "settings", "reveal"].indexOf(step) > i
                      ? "bg-imposter-green text-white"
                      : "bg-imposter-dark-lighter text-white/50"
                  }`}
                >
                  {["players", "settings", "reveal"].indexOf(step) > i ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < 2 && (
                  <div
                    className={`w-12 h-0.5 ${
                      ["players", "settings", "reveal"].indexOf(step) > i
                        ? "bg-imposter-green"
                        : "bg-imposter-dark-lighter"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === STEPS.PLAYERS && (
              <motion.div
                key="players"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Users className="w-5 h-5 text-imposter-red" />
                      Players ({validPlayers.length})
                    </h2>
                    <span className="text-sm text-white/50">Min 3, Max 10</span>
                  </div>

                  <div className="space-y-3">
                    {players.map((player, index) => (
                      <motion.div
                        key={player.id}
                        layout
                        className="flex items-center gap-3"
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 cursor-pointer hover:scale-110 transition-transform"
                          style={{ backgroundColor: player.color }}
                          onClick={() => {
                            const nextColor =
                              availableColors[0] ||
                              COLORS[(index + 1) % COLORS.length];
                            updatePlayer(player.id, "color", nextColor);
                          }}
                          title="Click to change color"
                        >
                          {player.name
                            ? player.name[0]?.toUpperCase()
                            : index + 1}
                        </div>

                        <input
                          type="text"
                          value={player.name}
                          onChange={(e) =>
                            updatePlayer(player.id, "name", e.target.value)
                          }
                          className="input-field flex-1"
                          placeholder={`Player ${index + 1}`}
                          maxLength={15}
                        />

                        {players.length > 3 && (
                          <button
                            onClick={() => removePlayer(player.id)}
                            className="text-white/30 hover:text-red-400 transition-colors p-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {players.length < 10 && (
                    <button
                      onClick={addPlayer}
                      className="mt-4 w-full py-3 border-2 border-dashed border-white/20 rounded-xl text-white/50 hover:text-white hover:border-white/40 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Player
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setStep(STEPS.SETTINGS)}
                  disabled={validPlayers.length < 3}
                  className="btn-primary w-full py-4 text-lg disabled:opacity-50"
                >
                  Next: Game Settings
                  <ArrowRight className="w-5 h-5 inline ml-2" />
                </button>
              </motion.div>
            )}

            {step === STEPS.SETTINGS && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="card p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-imposter-red" />
                    Game Settings
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-white/50 block mb-2">
                        Imposters
                      </label>
                      <select
                        value={numImposters}
                        onChange={(e) =>
                          setNumImposters(Number(e.target.value))
                        }
                        className="input-field"
                      >
                        {[1, 2, 3].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-white/50 block mb-2">
                        Tasks per Player
                      </label>
                      <select
                        value={taskCount}
                        onChange={(e) => setTaskCount(Number(e.target.value))}
                        className="input-field"
                      >
                        {[3, 4, 5, 6, 7, 8].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-white/50 block mb-2">
                        Map
                      </label>
                      <select
                        value={mapName}
                        onChange={(e) => setMapName(e.target.value)}
                        className="input-field"
                      >
                        <option value="skeld">The Skeld</option>
                        <option value="mira">Mira HQ</option>
                        <option value="polus">Polus</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-white/50 block mb-2">
                        Kill Cooldown
                      </label>
                      <select
                        value={killCooldown}
                        onChange={(e) =>
                          setKillCooldown(Number(e.target.value))
                        }
                        className="input-field"
                      >
                        {[10, 15, 20, 25, 30, 45].map((n) => (
                          <option key={n} value={n}>
                            {n}s
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-white/50 block mb-2">
                        Discussion Time
                      </label>
                      <select
                        value={discussionTime}
                        onChange={(e) =>
                          setDiscussionTime(Number(e.target.value))
                        }
                        className="input-field"
                      >
                        {[0, 15, 30, 45, 60, 90].map((n) => (
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
                        value={votingTime}
                        onChange={(e) =>
                          setVotingTime(Number(e.target.value))
                        }
                        className="input-field"
                      >
                        {[15, 20, 30, 45, 60].map((n) => (
                          <option key={n} value={n}>
                            {n}s
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(STEPS.PLAYERS)}
                    className="btn-secondary flex-1 py-4"
                  >
                    <ArrowLeft className="w-5 h-5 inline mr-2" />
                    Back
                  </button>
                  <button
                    onClick={handleStart}
                    className="btn-primary flex-1 py-4 text-lg"
                  >
                    <Gamepad2 className="w-5 h-5 inline mr-2" />
                    Start Game
                  </button>
                </div>
              </motion.div>
            )}

            {step === STEPS.REVEAL && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4"
              >
                {currentRevealIndex < shuffledPlayers.length ? (
                  <div className="card p-8 text-center">
                    <motion.div
                      key={currentRevealIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="text-white/50 mb-6">
                        Pass the device to{" "}
                        <span className="text-white font-bold">
                          {shuffledPlayers[currentRevealIndex].name}
                        </span>
                      </div>

                      <div
                        className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold"
                        style={{
                          backgroundColor:
                            shuffledPlayers[currentRevealIndex].color,
                        }}
                      >
                        {shuffledPlayers[currentRevealIndex].name[0]?.toUpperCase()}
                      </div>

                      <div className="bg-imposter-dark-lighter rounded-xl p-6 mb-6">
                        <div className="text-sm text-white/50 mb-2">
                          Your role is
                        </div>
                        <div
                          className={`text-4xl font-bold ${
                            imposterIndices.includes(currentRevealIndex)
                              ? "text-red-500"
                              : "text-blue-500"
                          }`}
                        >
                          {imposterIndices.includes(currentRevealIndex)
                            ? "IMPOSTER"
                            : "CREW"}
                        </div>
                        {imposterIndices.includes(currentRevealIndex) && (
                          <div className="text-white/50 text-sm mt-2">
                            Kill crewmates without getting caught!
                          </div>
                        )}
                        {!imposterIndices.includes(currentRevealIndex) && (
                          <div className="text-white/50 text-sm mt-2">
                            Complete tasks and find the imposter!
                          </div>
                        )}
                      </div>

                      <button
                        onClick={handleReveal}
                        className="btn-primary w-full py-4 text-lg"
                      >
                        {currentRevealIndex < shuffledPlayers.length - 1
                          ? "Pass to Next Player"
                          : "Start Game!"}
                        <ArrowRight className="w-5 h-5 inline ml-2" />
                      </button>

                      <div className="mt-4 text-white/30 text-sm">
                        Tap to reveal role, then hand device to next player
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  <div className="card p-8 text-center">
                    <div className="text-2xl font-bold mb-4">
                      All roles revealed!
                    </div>
                    <button
                      onClick={() => {
                        const gameState = {
                          mode: "pass-and-play",
                          players: shuffledPlayers.map((p, i) => ({
                            ...p,
                            role: imposterIndices.includes(i)
                              ? "IMPOSTER"
                              : "CREW",
                          })),
                          settings: {
                            numImposters,
                            taskCount,
                            discussionTime,
                            votingTime,
                            killCooldown,
                            mapName,
                          },
                        };
                        localStorage.setItem(
                          "imposter_passplay_game",
                          JSON.stringify(gameState)
                        );
                        router.push("/game/pass-and-play/play");
                      }}
                      className="btn-primary w-full py-4 text-lg"
                    >
                      <Play className="w-5 h-5 inline mr-2" />
                      Begin Game
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 text-white/30 text-sm">
                  {shuffledPlayers.map((p, i) => (
                    <div
                      key={p.id}
                      className={`w-3 h-3 rounded-full ${
                        revealedPlayers.includes(p.id)
                          ? "bg-imposter-green"
                          : i === currentRevealIndex
                          ? "bg-imposter-yellow animate-pulse"
                          : "bg-white/20"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
