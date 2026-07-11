"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PlayerAvatar, ImposterIcon } from "@/components/icons/PlayerAvatar";
import { SkipIcon, RefreshIcon, HomeIcon, SettingsIcon } from "@/components/icons/SvgIcons";
import { playSound } from "@/lib/sounds";

interface PlayerRole {
  player: { name: string; color: string };
  role: "crew" | "imposter";
}

interface RoundData {
  roles: PlayerRole[];
  secret: { word: string; categoryName: string };
}

export default function VotePage() {
  const router = useRouter();
  const [round, setRound] = useState<RoundData | null>(null);
  const [votes, setVotes] = useState<Record<number, number | "skip">>({});
  const [currentVoter, setCurrentVoter] = useState(0);
  const [results, setResults] = useState<{
    tally: { index: number; count: number }[];
    accused: number[];
    crewWins: boolean;
  } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("imposter-roles-v2");
    if (!stored) {
      router.push("/game/pass-and-play/setup");
      return;
    }
    setRound(JSON.parse(stored));
  }, [router]);

  if (!round) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-crimson border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const roles = round.roles;

  const castVote = (target: number | "skip") => {
    playSound("vote");
    const allVotes = { ...votes, [currentVoter]: target };
    setVotes(allVotes);

    if (currentVoter < roles.length - 1) {
      setCurrentVoter(currentVoter + 1);
      return;
    }

    // Tally by player index so duplicate names can't merge votes.
    const counts = new Map<number, number>();
    Object.values(allVotes).forEach((t) => {
      if (typeof t === "number") counts.set(t, (counts.get(t) || 0) + 1);
    });
    const tally = Array.from(counts.entries())
      .map(([index, count]) => ({ index, count }))
      .sort((a, b) => b.count - a.count);
    const maxVotes = tally.length > 0 ? tally[0].count : 0;
    const accused = tally.filter((t) => t.count === maxVotes).map((t) => t.index);
    const crewWins = accused.some((i) => roles[i].role === "imposter");

    playSound(crewWins ? "victory" : "defeat");
    setResults({ tally, accused, crewWins });
  };

  const handlePlayAgain = () => {
    // Same players and settings — a fresh word and imposter are drawn on reveal.
    localStorage.removeItem("imposter-roles-v2");
    router.push("/game/pass-and-play/reveal");
  };

  const handleNewSetup = () => {
    localStorage.removeItem("imposter-roles-v2");
    router.push("/game/pass-and-play/setup");
  };

  if (results) {
    return (
      <div className="min-h-screen pt-24 pb-10 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg mx-auto"
        >
          <div className="card-surface p-8 text-center mb-5">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring" }}
              className="flex justify-center mb-5"
            >
              <ImposterIcon size={72} />
            </motion.div>

            <h1
              className={`text-display text-4xl mb-2 ${
                results.crewWins ? "text-blue-400" : "text-crimson-glow"
              }`}
            >
              {results.crewWins ? "Crew Wins" : "Imposter Wins"}
            </h1>
            <p className="text-ink-secondary text-sm mb-6">
              {results.crewWins
                ? "The imposter was caught red-handed."
                : "The imposter slipped through the vote."}
            </p>

            <div className="bg-canvas/60 rounded-xl p-4 border border-hairline">
              <div className="text-ink-muted text-xs font-mono uppercase tracking-widest mb-1.5">
                The word was
              </div>
              <div className="text-ink-primary text-xl font-semibold">{round.secret.word}</div>
              <div className="text-ink-muted text-xs font-mono mt-1">{round.secret.categoryName}</div>
            </div>
          </div>

          <div className="card-surface p-6 mb-5">
            <div className="text-ink-muted text-xs font-mono uppercase tracking-widest mb-4">
              Role reveal
            </div>
            <div className="space-y-2">
              {roles.map((r, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    r.role === "imposter"
                      ? "bg-crimson/10 border-crimson/30"
                      : "bg-canvas/40 border-hairline"
                  }`}
                >
                  <PlayerAvatar color={r.player.color} size={34} initial={r.player.name[0]} />
                  <div className="flex-1 text-left">
                    <div className="text-ink-primary text-sm font-medium">{r.player.name}</div>
                    <div className={`text-xs font-mono ${r.role === "imposter" ? "text-crimson-glow" : "text-blue-400"}`}>
                      {r.role === "imposter" ? "Imposter" : "Crew"}
                    </div>
                  </div>
                  {results.accused.includes(i) && (
                    <span className="text-ink-muted text-[10px] font-mono uppercase tracking-wider border border-hairline rounded px-2 py-1">
                      Accused
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card-surface p-6 mb-6">
            <div className="text-ink-muted text-xs font-mono uppercase tracking-widest mb-4">
              Vote tally
            </div>
            {results.tally.length > 0 ? (
              <div className="space-y-2">
                {results.tally.map(({ index, count }) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-canvas/40 border border-hairline rounded-lg"
                  >
                    <span className="text-ink-primary text-sm">{roles[index].player.name}</span>
                    <span className="text-crimson-glow text-sm font-mono">
                      {count} vote{count > 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-ink-muted text-sm py-3">Everyone skipped</div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handlePlayAgain}
              className="btn-primary flex-1 py-4 flex items-center justify-center gap-2"
            >
              <RefreshIcon size={16} /> Play Again
            </button>
            <button
              onClick={handleNewSetup}
              className="btn-secondary flex-1 py-4 flex items-center justify-center gap-2"
            >
              <SettingsIcon size={16} /> New Setup
            </button>
            <button
              onClick={() => router.push("/")}
              className="btn-ghost flex-1 py-4 flex items-center justify-center gap-2"
            >
              <HomeIcon size={16} /> Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <span className="text-ink-muted text-xs font-mono uppercase tracking-[0.3em] block mb-3">
              Voting · {currentVoter + 1} of {roles.length}
            </span>
            <h1 className="text-display text-4xl text-ink-primary mb-2">
              {roles[currentVoter].player.name}
            </h1>
            <p className="text-ink-secondary text-sm">Who is the imposter?</p>
          </div>

          <div className="space-y-3">
            {roles.map((r, i) => (
              <motion.button
                key={i}
                whileHover={i !== currentVoter ? { scale: 1.01 } : {}}
                whileTap={i !== currentVoter ? { scale: 0.99 } : {}}
                onClick={() => castVote(i)}
                disabled={i === currentVoter}
                className={`w-full card-surface p-4 flex items-center gap-4 transition-all ${
                  i === currentVoter
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:border-crimson/40 cursor-pointer"
                }`}
              >
                <PlayerAvatar color={r.player.color} size={44} initial={r.player.name[0]} />
                <span className="flex-1 text-left text-ink-primary font-medium">
                  {r.player.name}
                </span>
                {i === currentVoter && (
                  <span className="text-ink-muted text-xs font-mono">you</span>
                )}
              </motion.button>
            ))}

            <button
              onClick={() => castVote("skip")}
              className="w-full card-surface p-4 flex items-center gap-4 hover:border-ink-muted transition-all"
            >
              <div className="w-11 h-11 rounded-full border border-hairline flex items-center justify-center text-ink-muted">
                <SkipIcon size={18} />
              </div>
              <span className="flex-1 text-left text-ink-secondary font-medium">Skip Vote</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
