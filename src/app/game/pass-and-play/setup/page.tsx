"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  UsersIcon, PlusIcon, TrashIcon, ArrowRightIcon,
  GamepadIcon, CheckIcon, TagsIcon, ClockIcon,
} from "@/components/icons/SvgIcons";
import { playSound } from "@/lib/sounds";
import { ALL_PACKS, type CategorySelection, type CustomCategory } from "@/lib/packs";

interface Player {
  name: string;
  color: string;
}

const COLORS = [
  "#EF4444", "#3B82F6", "#22C55E", "#EAB308", "#A855F7",
  "#F97316", "#EC4899", "#06B6D4", "#84CC16", "#F87171",
];

const TIMER_OPTIONS = [
  { label: "No Timer", value: null },
  { label: "1 min", value: 60 },
  { label: "2 min", value: 120 },
  { label: "3 min", value: 180 },
  { label: "5 min", value: 300 },
];

export default function PassAndPlaySetupPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([
    { name: "", color: COLORS[0] },
    { name: "", color: COLORS[1] },
  ]);
  const [imposterCount, setImposterCount] = useState(1);
  const [timerDuration, setTimerDuration] = useState<number | null>(180);
  const [selectedCategories, setSelectedCategories] = useState<CategorySelection[]>([
    { packId: "nepal", categoryId: "nepal-food" },
  ]);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [step, setStep] = useState<"players" | "categories" | "ready">("players");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("imposter-custom-categories");
      if (stored) setCustomCategories(JSON.parse(stored));
    } catch {}
  }, []);

  const usedColors = players.map((p) => p.color);
  const validPlayers = players.filter((p) => p.name.trim());
  const canStart = validPlayers.length >= 3 && selectedCategories.length > 0;

  const addPlayer = () => {
    if (players.length >= 10) return;
    const nextColor = COLORS.find((c) => !usedColors.includes(c)) || COLORS[players.length % COLORS.length];
    setPlayers([...players, { name: "", color: nextColor }]);
  };

  const removePlayer = (index: number) => {
    if (players.length <= 2) return;
    setPlayers(players.filter((_, i) => i !== index));
  };

  const updatePlayer = (index: number, field: keyof Player, value: string) => {
    setPlayers(players.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const toggleCategory = (packId: string, categoryId: string) => {
    const exists = selectedCategories.find(
      (c) => c.packId === packId && c.categoryId === categoryId
    );
    if (exists) {
      setSelectedCategories(selectedCategories.filter((c) => !(c.packId === packId && c.categoryId === categoryId)));
    } else {
      setSelectedCategories([...selectedCategories, { packId, categoryId }]);
    }
  };

  const handleStart = () => {
    playSound("button_click");
    const gameState = {
      players: validPlayers,
      imposterCount: Math.min(imposterCount, validPlayers.length - 1),
      selectedCategories,
      hintMode: "none" as const,
      timerDuration,
      customCategories,
    };
    localStorage.setItem("imposter-pass-and-play", JSON.stringify(gameState));
    router.push("/game/pass-and-play/reveal");
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-6 md:px-12 lg:px-24 relative">
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      <div className="max-w-lg mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-ink-muted text-xs font-mono uppercase tracking-[0.3em] block mb-4">
            Setup
          </span>
          <h1 className="text-display text-[clamp(2rem,4vw,3rem)] leading-[0.9] text-ink-primary mb-4">
            Pass & Play
          </h1>
          <p className="text-ink-secondary text-sm font-mono mb-12">
            {step === "players" && "Add players to the game"}
            {step === "categories" && "Pick word categories"}
            {step === "ready" && "Ready to begin"}
          </p>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-12">
            {(["players", "categories", "ready"] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono ${
                  step === s ? "bg-crimson text-white" :
                  (["players", "categories", "ready"] as const).indexOf(step) > i ? "bg-crimson/20 text-crimson" :
                  "bg-surface text-ink-muted"
                }`}>
                  {(["players", "categories", "ready"] as const).indexOf(step) > i ? <CheckIcon size={14} /> : i + 1}
                </div>
                {i < 2 && <div className={`w-8 h-[1px] ${(["players", "categories", "ready"] as const).indexOf(step) > i ? "bg-crimson/30" : "bg-hairline"}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: Players */}
            {step === "players" && (
              <motion.div key="players" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                <div className="card-surface p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <UsersIcon size={16} className="text-crimson" />
                    <span className="text-ink-muted text-xs font-mono uppercase tracking-widest">Players</span>
                  </div>

                  <div className="space-y-3">
                    {players.map((player, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-light cursor-pointer hover:scale-105 transition-transform shrink-0"
                          style={{ backgroundColor: player.color }}
                          onClick={() => {
                            const nextColor = COLORS.find((c) => !usedColors.includes(c) || c === player.color);
                            if (nextColor && nextColor !== player.color) updatePlayer(index, "color", nextColor);
                          }}
                        >
                          {player.name ? player.name[0]?.toUpperCase() : index + 1}
                        </div>
                        <input
                          type="text"
                          value={player.name}
                          onChange={(e) => updatePlayer(index, "name", e.target.value)}
                          className="input-field flex-1"
                          placeholder={`Player ${index + 1}`}
                          maxLength={15}
                        />
                        {players.length > 2 && (
                          <button onClick={() => removePlayer(index)} className="text-ink-ghost hover:text-crimson transition-colors p-2">
                            <TrashIcon size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {players.length < 10 && (
                    <button onClick={addPlayer} className="mt-4 w-full py-3 border border-dashed border-hairline rounded-lg text-ink-muted hover:text-ink-primary hover:border-ink-ghost transition-colors flex items-center justify-center gap-2 text-sm">
                      <PlusIcon size={14} />
                      Add Player
                    </button>
                  )}
                </div>

                <div className="card-surface p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-ink-muted text-xs font-mono uppercase tracking-widest">Imposters</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((n) => (
                      <button
                        key={n}
                        onClick={() => setImposterCount(n)}
                        disabled={n >= validPlayers.length}
                        className={`flex-1 py-3 rounded-lg text-sm font-mono transition-all ${
                          imposterCount === n
                            ? "bg-crimson text-white"
                            : "bg-surface border border-hairline text-ink-muted hover:border-ink-ghost disabled:opacity-30"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setStep("categories")}
                  disabled={validPlayers.length < 2}
                  className="btn-primary w-full py-4 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  Next <ArrowRightIcon size={16} />
                </button>
              </motion.div>
            )}

            {/* STEP 2: Categories */}
            {step === "categories" && (
              <motion.div key="categories" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                <div className="card-surface p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <TagsIcon size={16} className="text-crimson" />
                    <span className="text-ink-muted text-xs font-mono uppercase tracking-widest">Categories</span>
                  </div>

                  <div className="space-y-4">
                    {ALL_PACKS.map((pack) => (
                      <div key={pack.id}>
                        <div className="text-ink-muted text-xs font-mono uppercase tracking-wider mb-2">{pack.name}</div>
                        <div className="flex flex-wrap gap-2">
                          {pack.categories.map((cat) => {
                            const isSelected = selectedCategories.some(
                              (c) => c.packId === pack.id && c.categoryId === cat.id
                            );
                            return (
                              <button
                                key={cat.id}
                                onClick={() => toggleCategory(pack.id, cat.id)}
                                className={`px-3 py-2 rounded-lg text-xs font-mono transition-all ${
                                  isSelected
                                    ? "bg-crimson text-white"
                                    : "bg-surface border border-hairline text-ink-muted hover:border-ink-ghost"
                                }`}
                              >
                                {cat.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {customCategories.length > 0 && (
                      <div>
                        <div className="text-ink-muted text-xs font-mono uppercase tracking-wider mb-2">Custom</div>
                        <div className="flex flex-wrap gap-2">
                          {customCategories.map((cat) => {
                            const isSelected = selectedCategories.some(
                              (c) => c.packId === "custom" && c.categoryId === cat.id
                            );
                            return (
                              <button
                                key={cat.id}
                                onClick={() => toggleCategory("custom", cat.id)}
                                className={`px-3 py-2 rounded-lg text-xs font-mono transition-all ${
                                  isSelected
                                    ? "bg-crimson text-white"
                                    : "bg-surface border border-hairline text-ink-muted hover:border-ink-ghost"
                                }`}
                              >
                                {cat.icon} {cat.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedCategories.length === 0 && (
                    <p className="text-crimson text-xs font-mono mt-4">Select at least one category</p>
                  )}
                </div>

                <div className="card-surface p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <ClockIcon size={16} className="text-crimson" />
                    <span className="text-ink-muted text-xs font-mono uppercase tracking-widest">Timer</span>
                  </div>
                  <div className="flex gap-2">
                    {TIMER_OPTIONS.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => setTimerDuration(opt.value)}
                        className={`flex-1 py-3 rounded-lg text-xs font-mono transition-all ${
                          timerDuration === opt.value
                            ? "bg-crimson text-white"
                            : "bg-surface border border-hairline text-ink-muted hover:border-ink-ghost"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep("players")} className="btn-ghost flex-1 py-4">
                    Back
                  </button>
                  <button
                    onClick={() => setStep("ready")}
                    disabled={selectedCategories.length === 0}
                    className="btn-primary flex-1 py-4 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    Next <ArrowRightIcon size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Ready */}
            {step === "ready" && (
              <motion.div key="ready" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                <div className="card-surface p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-hairline/50">
                      <span className="text-ink-muted text-xs font-mono uppercase tracking-wider">Players</span>
                      <span className="text-ink-primary text-sm font-mono">{validPlayers.length}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-hairline/50">
                      <span className="text-ink-muted text-xs font-mono uppercase tracking-wider">Imposters</span>
                      <span className="text-crimson text-sm font-mono">{imposterCount}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-hairline/50">
                      <span className="text-ink-muted text-xs font-mono uppercase tracking-wider">Categories</span>
                      <span className="text-ink-primary text-sm font-mono">{selectedCategories.length}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-ink-muted text-xs font-mono uppercase tracking-wider">Timer</span>
                      <span className="text-ink-primary text-sm font-mono">
                        {timerDuration ? `${timerDuration / 60}m` : "None"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep("categories")} className="btn-ghost flex-1 py-4">
                    Back
                  </button>
                  <button
                    onClick={handleStart}
                    disabled={!canStart}
                    className="btn-primary flex-1 py-4 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <GamepadIcon size={16} /> Start
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
