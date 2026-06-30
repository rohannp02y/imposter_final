"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  UsersIcon, PlayIcon, TrashIcon, PlusIcon, SettingsIcon,
  ArrowRightIcon, ArrowLeftIcon, GamepadIcon, CheckIcon,
} from "@/components/icons/SvgIcons";
import { COLORS } from "@/types";
import { playSound } from "@/lib/sounds";

interface Player { id: string; name: string; color: string; }
const STEPS = { PLAYERS: "players", SETTINGS: "settings", REVEAL: "reveal" };

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
    setPlayers([...players, { id: Date.now().toString(), name: "", color: availableColors[0] || COLORS[players.length % COLORS.length] }]);
  };

  const removePlayer = (id: string) => {
    if (players.length <= 3) return;
    setPlayers(players.filter((p) => p.id !== id));
  };

  const updatePlayer = (id: string, field: keyof Player, value: string) => {
    setPlayers(players.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
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
        players: shuffledPlayers.map((p, i) => ({ ...p, role: imposterIndices.includes(i) ? "IMPOSTER" : "CREW" })),
        settings: { numImposters, taskCount, discussionTime, votingTime, killCooldown, mapName },
      };
      localStorage.setItem("imposter_passplay_game", JSON.stringify(gameState));
      router.push("/game/pass-and-play/play");
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-6 md:px-12 lg:px-24 relative">
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-ink-muted text-xs font-mono uppercase tracking-[0.3em] block mb-4">
            Local Session
          </span>
          <h1 className="text-display text-[clamp(2rem,4vw,3rem)] leading-[0.9] text-ink-primary mb-4">
            Pass & Play
          </h1>
          <p className="text-ink-secondary text-sm font-mono mb-12">
            {step === STEPS.PLAYERS && "Add players. Pick colors."}
            {step === STEPS.SETTINGS && "Configure parameters."}
            {step === STEPS.REVEAL && "Hand the device. Reveal roles."}
          </p>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-12">
            {["players", "settings", "reveal"].map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono ${
                  step === s ? "bg-crimson text-white" :
                  ["players", "settings", "reveal"].indexOf(step) > i ? "bg-crimson/20 text-crimson" :
                  "bg-surface text-ink-muted"
                }`}>
                  {["players", "settings", "reveal"].indexOf(step) > i ? <CheckIcon size={14} /> : i + 1}
                </div>
                {i < 2 && <div className={`w-8 h-[1px] ${["players", "settings", "reveal"].indexOf(step) > i ? "bg-crimson/30" : "bg-hairline"}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === STEPS.PLAYERS && (
              <motion.div key="players" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                <div className="card-surface p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <UsersIcon size={16} className="text-crimson" />
                      <span className="text-ink-muted text-xs font-mono uppercase tracking-widest">Roster</span>
                    </div>
                    <span className="text-ink-muted text-xs font-mono">{validPlayers.length} / 10</span>
                  </div>

                  <div className="space-y-3">
                    {players.map((player, index) => (
                      <motion.div key={player.id} layout className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-light cursor-pointer hover:scale-105 transition-transform shrink-0"
                          style={{ backgroundColor: player.color }}
                          onClick={() => updatePlayer(player.id, "color", availableColors[0] || COLORS[(index + 1) % COLORS.length])}
                        >
                          {player.name ? player.name[0]?.toUpperCase() : index + 1}
                        </div>
                        <input
                          type="text"
                          value={player.name}
                          onChange={(e) => updatePlayer(player.id, "name", e.target.value)}
                          className="input-field flex-1"
                          placeholder={`Player ${index + 1}`}
                          maxLength={15}
                        />
                        {players.length > 3 && (
                          <button onClick={() => removePlayer(player.id)} className="text-ink-ghost hover:text-crimson transition-colors p-2">
                            <TrashIcon size={14} />
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {players.length < 10 && (
                    <button onClick={addPlayer} className="mt-4 w-full py-3 border border-dashed border-hairline rounded-lg text-ink-muted hover:text-ink-primary hover:border-ink-ghost transition-colors flex items-center justify-center gap-2 text-sm">
                      <PlusIcon size={14} />
                      Add Player
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setStep(STEPS.SETTINGS)}
                  disabled={validPlayers.length < 3}
                  className="btn-primary w-full py-4 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  Continue <ArrowRightIcon size={16} />
                </button>
              </motion.div>
            )}

            {step === STEPS.SETTINGS && (
              <motion.div key="settings" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                <div className="card-surface p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <SettingsIcon size={16} className="text-crimson" />
                    <span className="text-ink-muted text-xs font-mono uppercase tracking-widest">Parameters</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-ink-muted text-xs font-mono uppercase tracking-wider mb-2">Imposters</label>
                      <select value={numImposters} onChange={(e) => setNumImposters(Number(e.target.value))} className="input-field">
                        {[1, 2, 3].map((v) => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-ink-muted text-xs font-mono uppercase tracking-wider mb-2">Tasks</label>
                      <select value={taskCount} onChange={(e) => setTaskCount(Number(e.target.value))} className="input-field">
                        {[3, 4, 5, 6, 7, 8].map((v) => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-ink-muted text-xs font-mono uppercase tracking-wider mb-2">Map</label>
                      <select value={mapName} onChange={(e) => setMapName(e.target.value)} className="input-field">
                        <option value="skeld">The Skeld</option>
                        <option value="mira">Mira HQ</option>
                        <option value="polus">Polus</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-ink-muted text-xs font-mono uppercase tracking-wider mb-2">Cooldown</label>
                      <select value={killCooldown} onChange={(e) => setKillCooldown(Number(e.target.value))} className="input-field">
                        {[10, 15, 20, 25, 30].map((v) => <option key={v} value={v}>{v}s</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-ink-muted text-xs font-mono uppercase tracking-wider mb-2">Discussion</label>
                      <select value={discussionTime} onChange={(e) => setDiscussionTime(Number(e.target.value))} className="input-field">
                        {[0, 15, 30, 60, 90].map((v) => <option key={v} value={v}>{v}s</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-ink-muted text-xs font-mono uppercase tracking-wider mb-2">Voting</label>
                      <select value={votingTime} onChange={(e) => setVotingTime(Number(e.target.value))} className="input-field">
                        {[15, 20, 30, 45, 60].map((v) => <option key={v} value={v}>{v}s</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(STEPS.PLAYERS)} className="btn-ghost flex-1 py-4 flex items-center justify-center gap-2">
                    <ArrowLeftIcon size={16} /> Back
                  </button>
                  <button onClick={handleStart} className="btn-primary flex-1 py-4 flex items-center justify-center gap-2">
                    <GamepadIcon size={16} /> Start
                  </button>
                </div>
              </motion.div>
            )}

            {step === STEPS.REVEAL && (
              <motion.div key="reveal" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-4">
                {currentRevealIndex < shuffledPlayers.length ? (
                  <div className="card-surface p-8 text-center">
                    <motion.div key={currentRevealIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <p className="text-ink-muted text-sm font-mono mb-8">
                        Pass to <span className="text-ink-primary">{shuffledPlayers[currentRevealIndex].name}</span>
                      </p>

                      <div className="w-20 h-20 rounded-xl mx-auto mb-8 flex items-center justify-center text-white text-3xl font-light"
                        style={{ backgroundColor: shuffledPlayers[currentRevealIndex].color }}>
                        {shuffledPlayers[currentRevealIndex].name[0]?.toUpperCase()}
                      </div>

                      <div className="bg-canvas rounded-xl p-6 mb-8 border border-hairline">
                        <p className="text-ink-muted text-xs font-mono uppercase tracking-wider mb-2">Your role</p>
                        <p className={`text-4xl font-display font-extralight tracking-ultra-tight ${
                          imposterIndices.includes(currentRevealIndex) ? "text-crimson" : "text-ink-primary"
                        }`}>
                          {imposterIndices.includes(currentRevealIndex) ? "IMPOSTER" : "CREW"}
                        </p>
                      </div>

                      <button onClick={handleReveal} className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                        {currentRevealIndex < shuffledPlayers.length - 1 ? "Pass Device" : "Begin"}
                        <ArrowRightIcon size={16} />
                      </button>
                    </motion.div>
                  </div>
                ) : (
                  <div className="card-surface p-8 text-center">
                    <p className="text-display text-2xl text-ink-primary mb-8">All revealed</p>
                    <button
                      onClick={() => {
                        const gameState = {
                          mode: "pass-and-play",
                          players: shuffledPlayers.map((p, i) => ({ ...p, role: imposterIndices.includes(i) ? "IMPOSTER" : "CREW" })),
                          settings: { numImposters, taskCount, discussionTime, votingTime, killCooldown, mapName },
                        };
                        localStorage.setItem("imposter_passplay_game", JSON.stringify(gameState));
                        router.push("/game/pass-and-play/play");
                      }}
                      className="btn-primary w-full py-4 flex items-center justify-center gap-2"
                    >
                      <PlayIcon size={16} /> Start Game
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2">
                  {shuffledPlayers.map((p, i) => (
                    <div key={p.id} className={`w-2 h-2 rounded-sm ${
                      revealedPlayers.includes(p.id) ? "bg-crimson" :
                      i === currentRevealIndex ? "bg-crimson animate-pulse" : "bg-ink-ghost"
                    }`} />
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
