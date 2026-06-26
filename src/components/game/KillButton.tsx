"use client";

import { useState, useEffect, useMemo } from "react";
import type { GameState } from "@/types";

interface KillButtonProps {
  game: GameState;
  currentUserId: string;
  onKill: (victimId: string) => void;
}

export function KillButton({ game, currentUserId, onKill }: KillButtonProps) {
  const [cooldown, setCooldown] = useState(0);
  const [showKillMenu, setShowKillMenu] = useState(false);

  const currentPlayer = game.players.find((p) => p.userId === currentUserId);

  const killablePlayers = useMemo(() => {
    if (!currentPlayer) return [];

    return game.players.filter((p) => {
      if (p.userId === currentUserId) return false;
      if (!p.alive) return false;
      if (p.role === "IMPOSTER") return false;

      const distance = Math.sqrt(
        Math.pow(currentPlayer.position.x - p.position.x, 2) +
          Math.pow(currentPlayer.position.y - p.position.y, 2)
      );

      return distance < 100;
    });
  }, [game.players, currentPlayer, currentUserId]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleKill = (victimId: string) => {
    if (cooldown > 0) return;
    onKill(victimId);
    setCooldown(game.settings.killCooldown);
    setShowKillMenu(false);
  };

  return (
    <div className="fixed bottom-6 right-24 z-20">
      {showKillMenu && killablePlayers.length > 0 && (
        <div className="absolute bottom-16 right-0 card p-2 min-w-[160px] mb-2">
          {killablePlayers.map((player) => (
            <button
              key={player.id}
              onClick={() => handleKill(player.userId)}
              className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-red-500/20 transition-colors text-left"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: player.color }}
              >
                {player.username[0]?.toUpperCase()}
              </div>
              <span className="text-sm">{player.username}</span>
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => {
          if (cooldown > 0) return;
          if (killablePlayers.length === 1) {
            handleKill(killablePlayers[0].userId);
          } else {
            setShowKillMenu(!showKillMenu);
          }
        }}
        disabled={cooldown > 0}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all shadow-lg ${
          cooldown > 0
            ? "bg-white/10 text-white/30 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-500 text-white glow-red cursor-pointer"
        }`}
      >
        {cooldown > 0 ? (
          <span className="text-sm font-mono">{cooldown}</span>
        ) : (
          <span className="text-2xl">🗡️</span>
        )}
      </button>
    </div>
  );
}
