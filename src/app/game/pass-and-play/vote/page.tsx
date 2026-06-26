"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AvatarSVG } from "@/components/game/AvatarSVG";

interface PlayerRole {
  player: { name: string; color: string };
  role: "crew" | "imposter";
  word: string | null;
  hint: string | null;
}

export default function VotePage() {
  const router = useRouter();
  const [roles, setRoles] = useState<PlayerRole[]>([]);
  const [votes, setVotes] = useState<Record<number, number | "skip">>({});
  const [currentVoter, setCurrentVoter] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [voteResults, setVoteResults] = useState<{
    tally: Record<string, number>;
    accused: string[];
    crewWins: boolean;
  } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("imposter-roles");
    if (!stored) {
      router.push("/game/pass-and-play/setup");
      return;
    }
    setRoles(JSON.parse(stored));
  }, [router]);

  const castVote = (targetIndex: number | "skip") => {
    setVotes({ ...votes, [currentVoter]: targetIndex });

    if (currentVoter < roles.length - 1) {
      setCurrentVoter(currentVoter + 1);
    } else {
      tallyVotes({ ...votes, [currentVoter]: targetIndex });
    }
  };

  const tallyVotes = (allVotes: Record<number, number | "skip">) => {
    const tally: Record<string, number> = {};

    Object.values(allVotes).forEach((target) => {
      if (target !== "skip" && typeof target === "number") {
        const name = roles[target].player.name;
        tally[name] = (tally[name] || 0) + 1;
      }
    });

    const maxVotes = Math.max(...Object.values(tally), 0);
    const accused = Object.entries(tally)
      .filter(([, count]) => count === maxVotes)
      .map(([name]) => name);

    const crewWins = accused.some((name) => {
      const player = roles.find((r) => r.player.name === name);
      return player?.role === "imposter";
    });

    setVoteResults({ tally, accused, crewWins });
    setShowResults(true);
  };

  const handlePlayAgain = () => {
    localStorage.removeItem("imposter-roles");
    localStorage.removeItem("imposter-pass-and-play");
    router.push("/game/pass-and-play/setup");
  };

  if (roles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-imposter-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (showResults && voteResults) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          <div className="card p-8 text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-6xl mb-4"
            >
              {voteResults.crewWins ? "🎉" : "🗡️"}
            </motion.div>

            <h1 className={`text-4xl font-bold mb-2 ${
              voteResults.crewWins ? "text-blue-400" : "text-red-400"
            }`}>
              {voteResults.crewWins ? "Crew Wins!" : "Imposter Wins!"}
            </h1>

            <p className="text-white/50 mb-6">
              {voteResults.crewWins
                ? "The crew found the imposter!"
                : "The imposter survived the vote!"}
            </p>

            {voteResults.accused.length > 0 && (
              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <div className="text-sm text-white/50 mb-2">Accused</div>
                <div className="font-medium">
                  {voteResults.accused.join(", ")}
                </div>
              </div>
            )}
          </div>

          <div className="card p-6 mb-6">
            <h3 className="font-semibold mb-4">Role Reveal</h3>
            <div className="space-y-2">
              {roles.map((r, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    r.role === "imposter"
                      ? "bg-red-500/10 border border-red-500/20"
                      : "bg-white/5"
                  }`}
                >
                  <AvatarSVG color={r.player.color} size={36} />
                  <div className="flex-1">
                    <div className="font-medium">{r.player.name}</div>
                    <div className="text-xs">
                      {r.role === "imposter" ? (
                        <span className="text-red-400">Imposter</span>
                      ) : (
                        <span className="text-blue-400">
                          Crew — "{r.word}"
                        </span>
                      )}
                    </div>
                  </div>
                  {r.role === "imposter" && (
                    <span className="text-red-400">🗡️</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6 mb-6">
            <h3 className="font-semibold mb-4">Vote Tally</h3>
            <div className="space-y-2">
              {Object.entries(voteResults.tally)
                .sort(([, a], [, b]) => b - a)
                .map(([name, count]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                  >
                    <span>{name}</span>
                    <span className="font-bold text-imposter-red">
                      {count} vote{count > 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              {Object.keys(voteResults.tally).length === 0 && (
                <div className="text-center text-white/40 text-sm py-4">
                  No votes were cast
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={handlePlayAgain} className="btn-primary flex-1 py-4 text-lg">
              Play Again
            </button>
            <button
              onClick={() => router.push("/")}
              className="btn-secondary flex-1 py-4 text-lg"
            >
              Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-yellow-400">Vote!</span>
            </h1>
            <p className="text-white/50">
              {roles[currentVoter].player.name}, who is the imposter?
            </p>
            <div className="text-sm text-white/30 mt-2">
              Voter {currentVoter + 1} of {roles.length}
            </div>
          </div>

          <div className="space-y-3">
            {roles.map((r, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => castVote(i)}
                disabled={i === currentVoter}
                className={`w-full card p-4 flex items-center gap-4 transition-all ${
                  i === currentVoter
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:border-imposter-red/30 cursor-pointer"
                }`}
              >
                <AvatarSVG color={r.player.color} size={48} />
                <span className="flex-1 text-left font-medium text-lg">
                  {r.player.name}
                </span>
                {i === currentVoter && (
                  <span className="text-xs text-white/40">(You)</span>
                )}
              </motion.button>
            ))}

            <button
              onClick={() => castVote("skip")}
              className="w-full card p-4 flex items-center gap-4 hover:border-yellow-500/30 transition-all text-white/50"
            >
              <span className="text-3xl">⏭️</span>
              <span className="flex-1 text-left font-medium text-lg">
                Skip Vote
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
