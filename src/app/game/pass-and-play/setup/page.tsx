"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Users,
  Play,
  Settings,
  Timer,
  Lightbulb,
  Tag,
  AlertCircle,
  HelpCircle,
  Gamepad2,
  Plus,
  Trash2,
  ArrowLeft,
  X,
} from "lucide-react";
import {
  getAllPacks,
  getCustomCategories,
  getWordsFromSelection,
  type CategorySelection,
} from "@/lib/packs";
import { AvatarSVG, AVATAR_COLORS, getAvatarColor } from "@/components/game/AvatarSVG";

const HINT_MODES = [
  { value: "none", label: "No Hints", description: "Imposter is completely blind", icon: "🚫" },
  { value: "word", label: "Word Hint", description: "Vague clue related to the word", icon: "💡" },
  { value: "category", label: "Category Hint", description: "Shows the category name only", icon: "📁" },
];

const TIMER_OPTIONS = [
  { label: "Off", value: null },
  { label: "1 min", value: 60 },
  { label: "1.5 min", value: 90 },
  { label: "2 min", value: 120 },
  { label: "3 min", value: 180 },
  { label: "5 min", value: 300 },
];

export default function PassAndPlaySetupPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<{ name: string; color: string }[]>([]);
  const [newName, setNewName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#3B82F6");
  const [imposterCount, setImposterCount] = useState(1);
  const [timerDuration, setTimerDuration] = useState<number | null>(null);
  const [hintMode, setHintMode] = useState<"none" | "word" | "category">("none");
  const [selectedCategories, setSelectedCategories] = useState<CategorySelection[]>([]);
  const [activePackTab, setActivePackTab] = useState<"nepal" | "global" | "custom">("nepal");
  const [error, setError] = useState("");
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [comingSoon, setComingSoon] = useState(false);

  const packs = getAllPacks();
  const customCategories = getCustomCategories();
  const totalWords = getWordsFromSelection(selectedCategories, customCategories).length;

  useEffect(() => {
    if (players.length === 0) {
      setPlayers([
        { name: "Player 1", color: AVATAR_COLORS[0] },
        { name: "Player 2", color: AVATAR_COLORS[1] },
      ]);
      setSelectedColor(AVATAR_COLORS[2]);
    }
  }, []);

  const addPlayer = () => {
    setError("");
    if (players.length >= 10) {
      setError("Maximum 10 players");
      return;
    }
    const usedColors = players.map((p) => p.color);
    const nextColor = AVATAR_COLORS.find((c) => !usedColors.includes(c)) || AVATAR_COLORS[players.length % AVATAR_COLORS.length];
    const nextName = `Player ${players.length + 1}`;
    setPlayers([...players, { name: newName.trim() || nextName, color: selectedColor }]);
    setNewName("");
    setSelectedColor(nextColor);
  };

  const updatePlayerName = (index: number, name: string) => {
    const updated = [...players];
    updated[index] = { ...updated[index], name };
    setPlayers(updated);
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const cycleColor = (index: number) => {
    const usedColors = players.filter((_, i) => i !== index).map((p) => p.color);
    const currentIdx = AVATAR_COLORS.indexOf(players[index].color);
    let nextIdx = (currentIdx + 1) % AVATAR_COLORS.length;
    while (usedColors.includes(AVATAR_COLORS[nextIdx])) {
      nextIdx = (nextIdx + 1) % AVATAR_COLORS.length;
    }
    const updated = [...players];
    updated[index] = { ...updated[index], color: AVATAR_COLORS[nextIdx] };
    setPlayers(updated);
  };

  const toggleCategory = (packId: string, categoryId: string) => {
    setSelectedCategories((prev) => {
      const exists = prev.some(
        (s) => s.packId === packId && s.categoryId === categoryId
      );
      if (exists) {
        return prev.filter(
          (s) => !(s.packId === packId && s.categoryId === categoryId)
        );
      }
      return [...prev, { packId, categoryId }];
    });
  };

  const handleStart = () => {
    setError("");
    if (players.length < 3) {
      setError("Need at least 3 players");
      return;
    }
    if (players.length < 10 && imposterCount >= players.length) {
      setError("Imposters must be fewer than players");
      return;
    }
    if (selectedCategories.length === 0) {
      setError("Select at least 1 category");
      return;
    }
    if (totalWords < 3) {
      setError("Selected categories need at least 3 words");
      return;
    }

    const gameState = {
      players,
      imposterCount,
      selectedCategories,
      hintMode,
      timerDuration,
      customCategories: getCustomCategories(),
    };

    localStorage.setItem("imposter-pass-and-play", JSON.stringify(gameState));
    router.push("/game/pass-and-play/reveal");
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => router.push("/")} className="btn-ghost">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">
                <span className="text-gradient">Pass & Play</span>
              </h1>
              <p className="text-white/50 text-sm mt-1">
                Pass the phone, find the imposter — kasto suspense! 🇳🇵
              </p>
            </div>
            <button onClick={() => setShowHowToPlay(true)} className="btn-ghost">
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Players */}
          <div className="card p-6 mb-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-imposter-red" />
              Players ({players.length}/10)
            </h2>

            <div className="space-y-2 mb-4">
              {players.map((player, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-2 bg-white/5 rounded-xl"
                >
                  <button onClick={() => cycleColor(i)} className="flex-shrink-0">
                    <AvatarSVG color={player.color} size={40} />
                  </button>
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => updatePlayerName(i, e.target.value)}
                    className="input-field flex-1 py-2"
                    maxLength={12}
                  />
                  <button
                    onClick={() => removePlayer(i)}
                    className="text-white/30 hover:text-red-400 p-1"
                    disabled={players.length <= 2}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>

            {players.length < 10 && (
              <button onClick={addPlayer} className="btn-ghost w-full text-sm">
                <Plus className="w-4 h-4 inline mr-1" />
                Add Player
              </button>
            )}
          </div>

          {/* Settings */}
          <div className="card p-6 mb-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-imposter-red" />
              Settings
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm text-white/50 block mb-2">Imposters</label>
                <select
                  value={imposterCount}
                  onChange={(e) => setImposterCount(Number(e.target.value))}
                  className="input-field"
                >
                  {[1, 2, 3].map((n) => (
                    <option key={n} value={n} disabled={n >= players.length}>
                      {n} Imposter{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-white/50 block mb-2 flex items-center gap-1">
                  <Timer className="w-4 h-4" />
                  Discussion Timer
                </label>
                <select
                  value={timerDuration ?? ""}
                  onChange={(e) =>
                    setTimerDuration(e.target.value ? Number(e.target.value) : null)
                  }
                  className="input-field"
                >
                  {TIMER_OPTIONS.map((opt) => (
                    <option key={opt.label} value={opt.value ?? ""}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Imposter Hint Mode */}
            <div>
              <label className="text-sm text-white/50 block mb-3 flex items-center gap-1">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                Imposter Hint
              </label>
              <div className="grid grid-cols-3 gap-2">
                {HINT_MODES.map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => setHintMode(mode.value as "none" | "word" | "category")}
                    className={`p-3 rounded-xl text-center transition-all border ${
                      hintMode === mode.value
                        ? "bg-imposter-red/20 border-imposter-red/30 text-white"
                        : "bg-white/5 border-transparent text-white/50 hover:bg-white/10"
                    }`}
                  >
                    <div className="text-2xl mb-1">{mode.icon}</div>
                    <div className="text-xs font-medium">{mode.label}</div>
                    <div className="text-[10px] text-white/40 mt-0.5">{mode.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Selection */}
          <div className="card p-6 mb-6">
            <h2 className="font-semibold mb-4">
              Select Categories
              {selectedCategories.length > 0 && (
                <span className="text-sm text-imposter-red ml-2">
                  ({selectedCategories.length} selected, {totalWords}+ words)
                </span>
              )}
            </h2>

            <div className="flex gap-2 mb-4">
              {(["nepal", "global", "custom"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActivePackTab(tab)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activePackTab === tab
                      ? "bg-imposter-red text-white"
                      : "bg-white/5 text-white/50 hover:bg-white/10"
                  }`}
                >
                  {tab === "nepal" && "🇳🇵 "}
                  {tab === "global" && "🌍 "}
                  {tab === "custom" && "✏️ "}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activePackTab === "custom" && (
              <div className="mb-3">
                <button
                  onClick={() => router.push("/custom")}
                  className="btn-ghost w-full text-sm border border-dashed border-white/20"
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  Create Custom Category
                </button>
              </div>
            )}

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {activePackTab === "nepal" &&
                packs
                  .find((p) => p.id === "nepal")
                  ?.categories.map((cat) => (
                    <CategoryToggle
                      key={cat.id}
                      category={cat}
                      selected={selectedCategories.some(
                        (s) => s.packId === "nepal" && s.categoryId === cat.id
                      )}
                      onToggle={() => toggleCategory("nepal", cat.id)}
                    />
                  ))}

              {activePackTab === "global" &&
                packs
                  .find((p) => p.id === "global")
                  ?.categories.map((cat) => (
                    <CategoryToggle
                      key={cat.id}
                      category={cat}
                      selected={selectedCategories.some(
                        (s) => s.packId === "global" && s.categoryId === cat.id
                      )}
                      onToggle={() => toggleCategory("global", cat.id)}
                    />
                  ))}

              {activePackTab === "custom" &&
                (customCategories.length === 0 ? (
                  <div className="text-center py-8 text-white/40">
                    <p>No custom categories yet</p>
                  </div>
                ) : (
                  customCategories.map((cat) => (
                    <CategoryToggle
                      key={cat.id}
                      category={cat}
                      selected={selectedCategories.some(
                        (s) => s.packId === "custom" && s.categoryId === cat.id
                      )}
                      onToggle={() => toggleCategory("custom", cat.id)}
                    />
                  ))
                ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setComingSoon(true)}
              className="btn-secondary flex-1 py-4 text-lg"
            >
              🌐 Play Online
            </button>
            <button
              onClick={handleStart}
              disabled={players.length < 3 || selectedCategories.length === 0}
              className="btn-primary flex-1 py-4 text-lg disabled:opacity-50"
            >
              <Play className="w-5 h-5 inline mr-2" />
              Start Game
            </button>
          </div>
        </motion.div>
      </div>

      {showHowToPlay && <HowToPlayModal onClose={() => setShowHowToPlay(false)} />}

      {comingSoon && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setComingSoon(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="card p-8 max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold mb-2">Coming Soon!</h2>
            <p className="text-white/50 mb-6">
              Online multiplayer is under development. Stay tuned for real-time matches with friends!
            </p>
            <button
              onClick={() => setComingSoon(false)}
              className="btn-primary w-full"
            >
              Got it
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function CategoryToggle({
  category,
  selected,
  onToggle,
}: {
  category: { id: string; name: string; icon: string; words: { word: string }[] };
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
        selected
          ? "bg-imposter-red/20 border border-imposter-red/30"
          : "bg-white/5 border border-transparent hover:bg-white/10"
      }`}
    >
      <span className="text-2xl">{category.icon}</span>
      <span className="flex-1 text-left font-medium">{category.name}</span>
      <span className="text-sm text-white/40">{category.words.length} words</span>
      {selected && (
        <div className="w-5 h-5 bg-imposter-red rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      )}
    </button>
  );
}

function HowToPlayModal({ onClose }: { onClose: () => void }) {
  const steps = [
    { num: 1, title: "Add Players", desc: "Enter names or use defaults, choose avatars" },
    { num: 2, title: "Select Categories", desc: "Pick Nepal or Global word packs" },
    { num: 3, title: "Reveal Roles", desc: "Pass phone, each player taps to see role" },
    { num: 4, title: "Discuss", desc: "Give one-word clues, discuss who's sus" },
    { num: 5, title: "Vote", desc: "Tap to vote for the imposter!" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="card p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">How to Play</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.num} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-imposter-red/20 flex items-center justify-center text-imposter-red font-bold flex-shrink-0">
                {step.num}
              </div>
              <div>
                <div className="font-medium">{step.title}</div>
                <div className="text-sm text-white/50">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="btn-primary w-full mt-6">
          Got it!
        </button>
      </motion.div>
    </motion.div>
  );
}
