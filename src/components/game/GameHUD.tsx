"use client";

import type { GameState } from "@/types";
import { Clock, Users, CheckSquare, AlertTriangle } from "lucide-react";

interface GameHUDProps {
  game: GameState;
}

export function GameHUD({ game }: GameHUDProps) {
  const alivePlayers = game.players.filter((p) => p.alive).length;
  const totalPlayers = game.players.length;
  const taskProgress =
    game.totalTasks > 0
      ? Math.round((game.completedTasks / game.totalTasks) * 100)
      : 0;

  return (
    <div className="game-hud">
      <div className="game-panel flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-imposter-red" />
          <span className="font-mono text-lg font-bold">{game.timeLeft}s</span>
        </div>
      </div>

      <div className="game-panel flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-400" />
          <span className="text-sm">
            {alivePlayers}/{totalPlayers}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-green-400" />
          <div className="w-24 bg-white/10 rounded-full h-2">
            <div
              className="bg-green-400 h-2 rounded-full transition-all"
              style={{ width: `${taskProgress}%` }}
            />
          </div>
          <span className="text-xs text-white/50">{taskProgress}%</span>
        </div>
      </div>

      <div className="game-panel">
        <span className="text-xs font-mono text-white/50">
          Round {game.currentRound}
        </span>
      </div>
    </div>
  );
}
