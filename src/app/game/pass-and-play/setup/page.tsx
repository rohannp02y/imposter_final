"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  UsersIcon, PlusIcon, TrashIcon, ArrowRightIcon,
  GamepadIcon, CheckIcon, TagsIcon, ClockIcon,
  LightbulbIcon, CategoryIcon,
} from "@/components/icons/SvgIcons";
import { playSound } from "@/lib/sounds";
import {
  BUNDLED_PACKS, loadPacks, getCustomCategories,
  type Pack, type CategorySelection, type CustomCategory,
} from "@/lib/packs";

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

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 10;

function defaultPlayer(index: number, used: string[]): Player {
  const color = COLORS.find((c) => !used.includes(c)) || COLORS[index % COLORS.length];
  return { name: `Player ${index + 1}`, color };
}

function Toggle({
  checked, onChange, label, description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-full flex items-center justify-between gap-4 p-4 rounded-lg border transition-all text-left ${
        checked ? "border-crimson/50 bg-crimson/5" : "border-hairline bg-surface hover:border-ink-ghost"
      }`}
    >
      <div>
        <div className="text-ink-primary text-sm font-medium mb-1">{label}</div>
        <div className="text-ink-muted text-xs leading-relaxed">{description}</div>
      </div>
      <div
        className={`relative w-11 h-6 rounded-full shrink-0 transition-colors ${
          checked ? "bg-crimson" : "bg-ink-ghost"
        }`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </div>
    </button>
  );
}

export default function PassAndPlaySetupPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([
    { name: "Player 1", color: COLORS[0] },
    { name: "Player 2", color: COLORS[1] },
    { name: "Player 3", color: COLORS[2] },
    { name: "Player 4", color: COLORS[3] },
  ]);
  const [imposterCount, setImposterCount] = useState(1);
  const [timerDuration, setTimerDuration] = useState<number | null>(180);
  const [packs, setPacks] = useState<Pack[]>(BUNDLED_PACKS);
  const [selectedCategories, setSelectedCategories] = useState<CategorySelection[]>([
    { packId: "nepal", categoryId: "nepal-food" },
  ]);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [hintWord, setHintWord] = useState(false);
  const [hintCategory, setHintCategory] = useState(false);
  const [step, setStep] = useState<"players" | "categories" | "ready">("players");

  useEffect(() => {
    setCustomCategories(getCustomCategories());
    loadPacks().then(setPacks);
  }, []);

  const usedColors = players.map((p) => p.color);
  const maxImposters = Math.max(1, Math.min(3, players.length - 2));
  const canStart = players.length >= MIN_PLAYERS && selectedCategories.length > 0;

  const addPlayer = () => {
    if (players.length >= MAX_PLAYERS) return;
    setPlayers([...players, defaultPlayer(players.length, usedColors)]);
  };

  const removePlayer = (index: number) => {
    if (players.length <= MIN_PLAYERS) return;
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
      setSelectedCategories(
        selectedCategories.filter((c) => !(c.packId === packId && c.categoryId === categoryId))
      );
    } else {
      setSelectedCategories([...selectedCategories, { packId, categoryId }]);
    }
  };

  const handleStart = () => {
    playSound("button_click");
    // Empty names fall back to their default so nobody is silently dropped.
    const finalPlayers = players.map((p, i) => ({
      ...p,
      name: p.name.trim() || `Player ${i + 1}`,
    }));
    const gameState = {
      players: finalPlayers,
      imposterCount: Math.min(imposterCount, maxImposters),
      selectedCategories,
      hintWord,
      hintCategory,
      timerDuration,
      customCategories,
    };
    localStorage.setItem("imposter-game-v2", JSON.stringify(gameState));
    localStorage.removeItem("imposter-roles-v2");
    router.push("/game/pass-and-play/reveal");
  };

  const stepIndex = (["players", "categories", "ready"] as const).indexOf(step);

  return (
    <div className="min-h-screen pt-20 pb-8 px-6 md:px-12 lg:px-24 relative">
      <div className="absolute inset-0 gradient-mesh opacity-20 pointer-events-none" />
      <div className="max-w-lg mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-ink-muted text-xs font-mono uppercase tracking-[0.3em] block mb-4">
            Setup
          </span>
          <h1 className="text-display text-[clamp(2rem,4vw,3rem)] leading-[0.9] text-ink-primary mb-4">
            Pass &amp; Play
          </h1>
          <p className="text-ink-secondary text-sm font-mono mb-10">
            {step === "players" && "Who's playing? Names are pre-filled — tap to change."}
            {step === "categories" && "Pick word categories and the timer."}
            {step === "ready" && "Hints for the imposter, then start."}
          </p>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-10">
            {(["players", "categories", "ready"] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono ${
                  step === s ? "bg-crimson text-white" :
                  stepIndex > i ? "bg-crimson/20 text-crimson" :
                  "bg-surface border border-hairline text-ink-muted"
                }`}>
                  {stepIndex > i ? <CheckIcon size={14} /> : i + 1}
                </div>
                {i < 2 && <div className={`w-8 h-[1px] ${stepIndex > i ? "bg-crimson/40" : "bg-hairline"}`} />}
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
                    <span className="text-ink-muted text-xs font-mono uppercase tracking-widest">
                      Players ({players.length})
                    </span>
                  </div>

                  <div className="space-y-3">
                    {players.map((player, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <button
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-medium cursor-pointer hover:scale-105 transition-transform shrink-0"
                          style={{ backgroundColor: player.color }}
                          title="Change color"
                          onClick={() => {
                            const idx = COLORS.indexOf(player.color);
                            for (let step = 1; step <= COLORS.length; step++) {
                              const next = COLORS[(idx + step) % COLORS.length];
                              if (!usedColors.includes(next)) {
                                updatePlayer(index, "color", next);
                                return;
                              }
                            }
                          }}
                        >
                          {player.name.trim() ? player.name.trim()[0].toUpperCase() : index + 1}
                        </button>
                        <input
                          type="text"
                          value={player.name}
                          onChange={(e) => updatePlayer(index, "name", e.target.value)}
                          onFocus={(e) => e.target.select()}
                          className="input-field flex-1"
                          placeholder={`Player ${index + 1}`}
                          maxLength={15}
                        />
                        {players.length > MIN_PLAYERS && (
                          <button
                            onClick={() => removePlayer(index)}
                            className="text-ink-muted hover:text-crimson transition-colors p-2"
                            aria-label={`Remove ${player.name}`}
                          >
                            <TrashIcon size={15} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {players.length < MAX_PLAYERS && (
                    <button
                      onClick={addPlayer}
                      className="mt-4 w-full py-3 border border-dashed border-ink-ghost rounded-lg text-ink-muted hover:text-ink-primary hover:border-ink-muted transition-colors flex items-center justify-center gap-2 text-sm"
                    >
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
                        disabled={n > maxImposters}
                        className={`flex-1 py-3 rounded-lg text-sm font-mono transition-all ${
                          imposterCount === n
                            ? "bg-crimson text-white"
                            : "bg-surface border border-hairline text-ink-muted hover:border-ink-muted hover:text-ink-primary disabled:opacity-30 disabled:hover:border-hairline disabled:hover:text-ink-muted"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setStep("categories")}
                  className="btn-primary w-full py-4 flex items-center justify-center gap-2"
                >
                  Next <ArrowRightIcon size={16} />
                </button>
              </motion.div>
            )}

            {/* STEP 2: Categories + Timer */}
            {step === "categories" && (
              <motion.div key="categories" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                <div className="card-surface p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <TagsIcon size={16} className="text-crimson" />
                    <span className="text-ink-muted text-xs font-mono uppercase tracking-widest">Categories</span>
                  </div>

                  <div className="space-y-5">
                    {packs.map((pack) => (
                      <div key={pack.id}>
                        <div className="text-ink-muted text-xs font-mono uppercase tracking-wider mb-2">
                          {pack.emoji} {pack.name}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {pack.categories.map((cat) => {
                            const isSelected = selectedCategories.some(
                              (c) => c.packId === pack.id && c.categoryId === cat.id
                            );
                            return (
                              <button
                                key={cat.id}
                                onClick={() => toggleCategory(pack.id, cat.id)}
                                className={`px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                                  isSelected
                                    ? "bg-crimson text-white"
                                    : "bg-surface border border-hairline text-ink-secondary hover:border-ink-muted hover:text-ink-primary"
                                }`}
                              >
                                <CategoryIcon name={cat.icon} size={13} />
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
                                className={`px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                                  isSelected
                                    ? "bg-crimson text-white"
                                    : "bg-surface border border-hairline text-ink-secondary hover:border-ink-muted hover:text-ink-primary"
                                }`}
                              >
                                <CategoryIcon name={cat.icon} size={13} />
                                {cat.name}
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
                    <span className="text-ink-muted text-xs font-mono uppercase tracking-widest">Discussion Timer</span>
                  </div>
                  <div className="flex gap-2">
                    {TIMER_OPTIONS.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => setTimerDuration(opt.value)}
                        className={`flex-1 py-3 rounded-lg text-xs font-mono transition-all ${
                          timerDuration === opt.value
                            ? "bg-crimson text-white"
                            : "bg-surface border border-hairline text-ink-secondary hover:border-ink-muted hover:text-ink-primary"
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

            {/* STEP 3: Imposter hints + summary */}
            {step === "ready" && (
              <motion.div key="ready" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                <div className="card-surface p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <LightbulbIcon size={16} className="text-crimson" />
                    <span className="text-ink-muted text-xs font-mono uppercase tracking-widest">Imposter Hints</span>
                  </div>
                  <div className="space-y-3">
                    <Toggle
                      checked={hintWord}
                      onChange={setHintWord}
                      label="Word Hint"
                      description="The imposter sees a subtle hint related to the secret word."
                    />
                    <Toggle
                      checked={hintCategory}
                      onChange={setHintCategory}
                      label="Theme Hint"
                      description="The imposter sees which category the secret word is from."
                    />
                  </div>
                  {!hintWord && !hintCategory && (
                    <p className="text-ink-muted text-xs font-mono mt-4">
                      Hard mode — the imposter gets nothing. Good luck blending in.
                    </p>
                  )}
                </div>

                <div className="card-surface p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-hairline/60">
                      <span className="text-ink-muted text-xs font-mono uppercase tracking-wider">Players</span>
                      <span className="text-ink-primary text-sm font-mono">{players.length}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-hairline/60">
                      <span className="text-ink-muted text-xs font-mono uppercase tracking-wider">Imposters</span>
                      <span className="text-crimson text-sm font-mono">{Math.min(imposterCount, maxImposters)}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-hairline/60">
                      <span className="text-ink-muted text-xs font-mono uppercase tracking-wider">Categories</span>
                      <span className="text-ink-primary text-sm font-mono">{selectedCategories.length}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-hairline/60">
                      <span className="text-ink-muted text-xs font-mono uppercase tracking-wider">Hints</span>
                      <span className="text-ink-primary text-sm font-mono">
                        {[hintWord && "Word", hintCategory && "Theme"].filter(Boolean).join(" + ") || "None"}
                      </span>
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
