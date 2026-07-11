"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { loadPacks, getWordPool, type CategorySelection, type CustomCategory } from "@/lib/packs";
import { logGameStart } from "@/lib/firestore";
import { playSound } from "@/lib/sounds";
import { PlayerAvatar, SecretIcon, ImposterIcon, CrewIcon } from "@/components/icons/PlayerAvatar";
import { EyeIcon, ArrowRightIcon, LightbulbIcon, TagsIcon } from "@/components/icons/SvgIcons";

interface Player {
  name: string;
  color: string;
}

interface GameState {
  players: Player[];
  imposterCount: number;
  selectedCategories: CategorySelection[];
  hintWord: boolean;
  hintCategory: boolean;
  timerDuration: number | null;
  customCategories: CustomCategory[];
}

interface PlayerRole {
  player: Player;
  role: "crew" | "imposter";
  word: string | null;
  hint: string | null;
  categoryName: string | null;
}

/** Cryptographically random int in [0, max). */
function randInt(max: number): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

/** Pick `count` distinct random indices from [0, total). */
function pickRandomIndices(total: number, count: number): Set<number> {
  const indices = Array.from({ length: total }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return new Set(indices.slice(0, count));
}

export default function RevealPage() {
  const router = useRouter();
  const [playerRoles, setPlayerRoles] = useState<PlayerRole[]>([]);
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [allRevealed, setAllRevealed] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const stored = localStorage.getItem("imposter-game-v2");
    if (!stored) {
      router.push("/game/pass-and-play/setup");
      return;
    }
    const state: GameState = JSON.parse(stored);

    loadPacks().then((packs) => {
      const pool = getWordPool(packs, state.selectedCategories, state.customCategories || []);
      if (pool.length === 0 || state.players.length < 3) {
        router.push("/game/pass-and-play/setup");
        return;
      }

      // One secret word per round; every crew member sees the same word.
      const secret = pool[randInt(pool.length)];
      // Imposters are chosen independently of the reveal order, so the
      // passing sequence gives nothing away.
      const imposterIndices = pickRandomIndices(state.players.length, state.imposterCount);

      const roles: PlayerRole[] = state.players.map((player, i) => {
        const isImposter = imposterIndices.has(i);
        return {
          player,
          role: isImposter ? "imposter" : "crew",
          word: isImposter ? null : secret.word,
          hint: isImposter && state.hintWord ? secret.hint || null : null,
          categoryName: isImposter && state.hintCategory ? secret.categoryName : null,
        };
      });

      localStorage.setItem(
        "imposter-roles-v2",
        JSON.stringify({ roles, secret: { word: secret.word, categoryName: secret.categoryName } })
      );
      setPlayerRoles(roles);

      logGameStart({
        playerCount: state.players.length,
        imposterCount: state.imposterCount,
        categories: state.selectedCategories.map((c) => c.categoryId),
        hintWord: state.hintWord,
        hintCategory: state.hintCategory,
      });
    });
  }, [router]);

  const handleReveal = useCallback(() => {
    playSound("role_reveal");
    setIsRevealed(true);
  }, []);

  const handleNext = useCallback(() => {
    playSound("button_click");
    setIsRevealed(false);
    if (currentRevealIndex < playerRoles.length - 1) {
      setCurrentRevealIndex(currentRevealIndex + 1);
    } else {
      setAllRevealed(true);
    }
  }, [currentRevealIndex, playerRoles.length]);

  const handleStartDiscussion = () => {
    router.push("/game/pass-and-play/discuss");
  };

  if (playerRoles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-crimson border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (allRevealed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md w-full"
        >
          <div className="card-surface p-10">
            <div className="flex justify-center mb-6">
              <SecretIcon size={72} />
            </div>
            <h1 className="text-display text-3xl text-ink-primary mb-3">Everyone is in</h1>
            <p className="text-ink-secondary text-sm mb-8 leading-relaxed">
              All roles are dealt. Put the phone in the middle and start giving clues.
            </p>
            <button
              onClick={handleStartDiscussion}
              className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
            >
              Start Discussion <ArrowRightIcon size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const current = playerRoles[currentRevealIndex];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="w-full max-w-md text-center">
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            <motion.div
              key="tap"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="card-surface p-8">
                <div className="text-ink-muted text-xs font-mono uppercase tracking-widest mb-4">
                  Pass the phone to
                </div>
                <div className="flex justify-center mb-4">
                  <PlayerAvatar
                    color={current.player.color}
                    size={80}
                    initial={current.player.name[0]}
                  />
                </div>
                <h2 className="text-display text-3xl text-ink-primary mb-8">{current.player.name}</h2>

                <button
                  onClick={handleReveal}
                  className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
                >
                  <EyeIcon size={18} />
                  Reveal My Role
                </button>

                <div className="mt-6 text-ink-muted text-xs font-mono">
                  {currentRevealIndex + 1} of {playerRoles.length}
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
                className={`rounded-xl border p-8 ${
                  current.role === "imposter"
                    ? "bg-gradient-to-br from-crimson/20 to-crimson/5 border-crimson/40"
                    : "bg-gradient-to-br from-blue-500/15 to-blue-500/5 border-blue-500/40"
                }`}
              >
                <div className="flex justify-center mb-4">
                  {current.role === "imposter" ? <ImposterIcon size={80} /> : <CrewIcon size={80} />}
                </div>

                <h2
                  className={`text-display text-4xl mb-1 ${
                    current.role === "imposter" ? "text-crimson-glow" : "text-blue-400"
                  }`}
                >
                  {current.role === "imposter" ? "IMPOSTER" : "CREW"}
                </h2>
                <div className="text-ink-muted text-sm font-mono mb-6">{current.player.name}</div>

                {current.role === "crew" && current.word && (
                  <div className="bg-canvas/60 rounded-xl p-5 mb-4 border border-hairline">
                    <div className="text-ink-muted text-xs font-mono uppercase tracking-widest mb-2">
                      The secret word
                    </div>
                    <div className="text-ink-primary text-2xl font-semibold">{current.word}</div>
                  </div>
                )}

                {current.role === "imposter" && (
                  <div className="space-y-3 mb-4">
                    <div className="bg-crimson/10 rounded-xl p-4 border border-crimson/25 text-left">
                      <p className="text-crimson-glow/90 text-sm">
                        You don&apos;t know the word. Listen, blend in, survive the vote.
                      </p>
                    </div>
                    {current.hint && (
                      <div className="bg-crimson/10 rounded-xl p-4 border border-crimson/25 text-left">
                        <div className="flex items-center gap-2 text-crimson-glow/80 text-xs font-mono uppercase tracking-widest mb-1.5">
                          <LightbulbIcon size={13} /> Word hint
                        </div>
                        <div className="text-ink-primary text-lg font-medium">{current.hint}</div>
                      </div>
                    )}
                    {current.categoryName && (
                      <div className="bg-crimson/10 rounded-xl p-4 border border-crimson/25 text-left">
                        <div className="flex items-center gap-2 text-crimson-glow/80 text-xs font-mono uppercase tracking-widest mb-1.5">
                          <TagsIcon size={13} /> Theme
                        </div>
                        <div className="text-ink-primary text-lg font-medium">{current.categoryName}</div>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-ink-muted text-xs font-mono mb-6">Memorize it. No peeking, others!</p>

                <button onClick={handleNext} className="btn-secondary w-full py-3.5">
                  {currentRevealIndex < playerRoles.length - 1 ? "Got it — Pass the Phone" : "Got it — Everyone's Ready"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
