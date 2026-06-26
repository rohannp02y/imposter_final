"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getWordsFromSelection } from "@/lib/packs";
import { AvatarSVG } from "@/components/game/AvatarSVG";

interface Player {
  name: string;
  color: string;
}

interface GameState {
  players: Player[];
  imposterCount: number;
  selectedCategories: { packId: string; categoryId: string }[];
  hintMode: "none" | "word" | "category";
  timerDuration: number | null;
  customCategories: { id: string; name: string; icon: string; words: { word: string; hint?: string }[] }[];
}

interface PlayerRole {
  player: Player;
  role: "crew" | "imposter";
  word: string | null;
  hint: string | null;
  categoryName: string | null;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  const cryptoArray = new Uint32Array(shuffled.length);
  crypto.getRandomValues(cryptoArray);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = cryptoArray[i] % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const VAGUE_HINTS: Record<string, string[]> = {
  "nepal-celebrities": ["Famous in Nepal", "Known in Nepali media", "Public figure"],
  "nepal-food": ["Nepali kitchen item", "Found in Nepal", "Edible", "Taste of Nepal"],
  "nepal-places": ["A location", "Geographic place", "You might visit it", "On a map"],
  "nepal-movies": ["Entertainment", "On screen", "Watched by many", "A show or film"],
  "nepal-festivals": ["Celebration", "Special day", "Cultural event", "A tradition"],
  "nepal-slang": ["A phrase", "Colloquial", "People say it", "Informal language"],
  "nepal-objects": ["A thing", "You might own one", "Household item", "Physical object"],
  "nepal-animals": ["A creature", "Lives somewhere", "Has four legs maybe", "In nature"],
  "nepal-sports": ["An activity", "Competitive", "Players involved", "A game or sport"],
  "global-objects": ["Everyday item", "You probably have one", "Useful thing", "Common object"],
  "global-animals": ["A living thing", "Found in nature", "Breathes", "Has a name"],
  "global-professions": ["A job", "Someone does this", "Work-related", "A career"],
  "global-movies": ["Entertainment", "On screen", "Watched by many", "A show or film"],
};

function getVagueHint(categoryId: string, word: string): string {
  const hints = VAGUE_HINTS[categoryId];
  if (hints && hints.length > 0) {
    const hash = word.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return hints[hash % hints.length];
  }
  return "Think carefully...";
}

export default function RevealPage() {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerRoles, setPlayerRoles] = useState<PlayerRole[]>([]);
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [allRevealed, setAllRevealed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("imposter-pass-and-play");
    if (!stored) {
      router.push("/game/pass-and-play/setup");
      return;
    }
    const state: GameState = JSON.parse(stored);
    setGameState(state);

    const allWords = getWordsFromSelection(
      state.selectedCategories,
      state.customCategories || []
    );

    const shuffledPlayers = shuffleArray(state.players);
    const shuffledWords = shuffleArray(allWords);

    const roles: PlayerRole[] = shuffledPlayers.map((player, i) => {
      const isImposter = i < state.imposterCount;
      const wordEntry = isImposter ? null : shuffledWords[0];
      let hint: string | null = null;
      let categoryName: string | null = null;

      if (isImposter && state.hintMode !== "none") {
        if (state.hintMode === "word") {
          hint = wordEntry?.hint || getVagueHint(
            state.selectedCategories[0]?.categoryId || "",
            wordEntry?.word || ""
          );
        } else if (state.hintMode === "category") {
          const cat = state.selectedCategories[0];
          categoryName = cat?.categoryId?.replace(/-/g, " ") || "Unknown";
        }
      }

      return {
        player,
        role: isImposter ? "imposter" : "crew",
        word: wordEntry?.word || shuffledWords[0]?.word || "",
        hint,
        categoryName,
      };
    });

    setPlayerRoles(roles);
  }, [router]);

  const handleReveal = useCallback(() => {
    setIsRevealed(true);
  }, []);

  const handleNext = useCallback(() => {
    setIsRevealed(false);
    if (currentRevealIndex < playerRoles.length - 1) {
      setCurrentRevealIndex(currentRevealIndex + 1);
    } else {
      setAllRevealed(true);
    }
  }, [currentRevealIndex, playerRoles.length]);

  const handleStartDiscussion = () => {
    localStorage.setItem("imposter-roles", JSON.stringify(playerRoles));
    router.push("/game/pass-and-play/discuss");
  };

  if (!gameState || playerRoles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-imposter-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (allRevealed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🤫</div>
          <h1 className="text-3xl font-bold mb-2">Everyone Has Seen Their Role</h1>
          <p className="text-white/50 mb-8">Pass the phone to the first player and start discussing!</p>
          <button onClick={handleStartDiscussion} className="btn-primary text-lg px-8 py-4">
            Start Discussion →
          </button>
        </motion.div>
      </div>
    );
  }

  const currentPlayer = playerRoles[currentRevealIndex];

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            <motion.div
              key="tap"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="card p-8">
                <div className="text-sm text-white/50 mb-2">Pass phone to</div>
                <div className="flex justify-center mb-4">
                  <AvatarSVG color={currentPlayer.player.color} size={80} />
                </div>
                <h2 className="text-3xl font-bold mb-8">{currentPlayer.player.name}</h2>

                <button
                  onClick={handleReveal}
                  className="btn-primary w-full py-4 text-lg"
                >
                  Tap to Reveal Role
                </button>

                <div className="mt-6 text-sm text-white/30">
                  Player {currentRevealIndex + 1} of {playerRoles.length}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="card"
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.5, type: "spring", damping: 20 }}
            >
              <div
                className={`card p-8 ${
                  currentPlayer.role === "imposter"
                    ? "bg-gradient-to-br from-red-900/50 to-red-600/20 border-red-500/50"
                    : "bg-gradient-to-br from-blue-900/50 to-blue-600/20 border-blue-500/50"
                }`}
              >
                <div className="flex justify-center mb-4">
                  <AvatarSVG color={currentPlayer.player.color} size={80} />
                </div>

                <h2 className={`text-4xl font-bold mb-2 ${
                  currentPlayer.role === "imposter" ? "text-red-400" : "text-blue-400"
                }`}>
                  {currentPlayer.role === "imposter" ? "IMPOSTER" : "CREWMATE"}
                </h2>

                <div className="text-white/50 text-sm mb-4">{currentPlayer.player.name}</div>

                {currentPlayer.role === "crew" && currentPlayer.word && (
                  <div className="bg-black/30 rounded-xl p-4 mb-4">
                    <div className="text-sm text-white/50 mb-1">Your word is</div>
                    <div className="text-2xl font-bold">{currentPlayer.word}</div>
                  </div>
                )}

                {currentPlayer.role === "imposter" && currentPlayer.hint && (
                  <div className="bg-red-500/10 rounded-xl p-4 mb-4 border border-red-500/20">
                    <div className="text-sm text-red-300/70 mb-1">Your hint</div>
                    <div className="text-lg font-medium text-red-300">{currentPlayer.hint}</div>
                  </div>
                )}

                {currentPlayer.role === "imposter" && currentPlayer.categoryName && (
                  <div className="bg-red-500/10 rounded-xl p-4 mb-4 border border-red-500/20">
                    <div className="text-sm text-red-300/70 mb-1">Category</div>
                    <div className="text-lg font-medium text-red-300 capitalize">{currentPlayer.categoryName}</div>
                  </div>
                )}

                {currentPlayer.role === "imposter" && !currentPlayer.hint && !currentPlayer.categoryName && (
                  <div className="bg-red-500/10 rounded-xl p-4 mb-4 border border-red-500/20">
                    <div className="text-sm text-red-300/70">You don't know the word. Blend in!</div>
                  </div>
                )}

                <p className="text-white/40 text-sm mb-6">No peeking, bhai! 👀</p>

                <button onClick={handleNext} className="btn-secondary w-full py-3">
                  {currentRevealIndex < playerRoles.length - 1
                    ? "Done, Pass Phone"
                    : "Done, Start Game"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
