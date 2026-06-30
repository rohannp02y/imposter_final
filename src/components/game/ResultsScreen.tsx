"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import type { GameState } from "@/types";
import { Trophy, RotateCcw, Home } from "lucide-react";
import { playSound } from "@/lib/sounds";

interface ResultsScreenProps {
  game: GameState;
}

export function ResultsScreen({ game }: ResultsScreenProps) {
  const router = useRouter();
  const isWinner = game.winner === "CREW";
  const currentPlayer = game.players.find(
    (p) => p.userId === localStorage.getItem("imposter_user")
      ? JSON.parse(localStorage.getItem("imposter_user") || "{}").id
      : ""
  );

  useEffect(() => {
    if (game.winner) {
      const userJson = localStorage.getItem("imposter_user");
      const user = userJson ? JSON.parse(userJson) : null;
      const player = game.players.find((p) => p.userId === user?.id);
      const playerWon = game.winner === player?.role;
      playSound(playerWon ? "victory" : "defeat");
    }
  }, [game.winner, game.players]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <div className="card p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              game.winner
                ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                : "bg-white/10"
            }`}
          >
            <Trophy className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold mb-2"
          >
            {game.winner === "CREW" ? (
              <span className="text-blue-400">Crew Wins!</span>
            ) : game.winner === "IMPOSTER" ? (
              <span className="text-red-400">Imposter Wins!</span>
            ) : (
              <span className="text-white">Game Over</span>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/50 mb-8"
          >
            {game.winner === "CREW"
              ? "The crew has eliminated all imposters or completed all tasks!"
              : "The imposter has eliminated enough crew members to win!"}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4 mb-8"
          >
            <h3 className="text-lg font-semibold text-left">Players</h3>
            <div className="grid grid-cols-2 gap-2">
              {game.players.map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    player.alive ? "bg-white/5" : "bg-white/5 opacity-50"
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: player.color }}
                  >
                    {player.username[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium flex items-center gap-2">
                      {player.username}
                      {player.userId ===
                        JSON.parse(
                          localStorage.getItem("imposter_user") || "{}"
                        ).id && (
                        <span className="text-xs bg-imposter-red/20 text-imposter-red px-1.5 py-0.5 rounded">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-white/50">
                      {player.role === "IMPOSTER" ? (
                        <span className="text-red-400">Imposter</span>
                      ) : (
                        <span className="text-blue-400">Crew</span>
                      )}
                      {!player.alive && (
                        <span className="text-white/30 ml-2">Dead</span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-white/50">
                    <div>{player.kills} kills</div>
                    <div>{player.tasksDone} tasks</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex gap-4 justify-center"
          >
            <button
              onClick={() => router.push("/game/lobby")}
              className="btn-primary flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </button>
            <button
              onClick={() => router.push("/")}
              className="btn-secondary flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
