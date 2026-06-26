"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Trash2,
  Plus,
  RefreshCw,
  Trophy,
  Gamepad2,
} from "lucide-react";

interface Player {
  name: string;
  emoji: string;
}

export default function AdminUsersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newName, setNewName] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("😊");

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = () => {
    try {
      const stored = localStorage.getItem("imposter-players");
      setPlayers(stored ? JSON.parse(stored) : []);
    } catch {
      setPlayers([]);
    }
  };

  const savePlayers = (updated: Player[]) => {
    localStorage.setItem("imposter-players", JSON.stringify(updated));
    setPlayers(updated);
  };

  const addPlayer = () => {
    if (!newName.trim()) return;
    if (players.some((p) => p.name.toLowerCase() === newName.trim().toLowerCase())) return;
    savePlayers([...players, { name: newName.trim(), emoji: selectedEmoji }]);
    setNewName("");
  };

  const removePlayer = (index: number) => {
    savePlayers(players.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    if (confirm("Clear all players?")) {
      savePlayers([]);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Player Roster</h1>
          <p className="text-white/50 text-sm mt-1">Manage local players (localStorage)</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadPlayers} className="btn-ghost text-sm">
            <RefreshCw className="w-4 h-4" />
          </button>
          {players.length > 0 && (
            <button onClick={clearAll} className="btn-ghost text-sm text-red-400 hover:text-red-300">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="font-semibold mb-4">Add Player</h2>
        <div className="flex gap-2">
          <span className="text-3xl cursor-pointer" onClick={() => {
            const emojis = ["😊","😎","🤠","🦊","🐱","🐶","🐸","🐼","🦁","🐯","🐨","🐙","🦄","🎃","🤖","💀"];
            const idx = emojis.indexOf(selectedEmoji);
            setSelectedEmoji(emojis[(idx + 1) % emojis.length]);
          }}>
            {selectedEmoji}
          </span>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addPlayer()}
            placeholder="Player name"
            className="input-field flex-1"
          />
          <button onClick={addPlayer} className="btn-primary px-4">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Players ({players.length})
        </h2>

        {players.length === 0 ? (
          <div className="text-center py-12 text-white/40">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No players in roster</p>
            <p className="text-sm mt-1">Add players above or they get added during game setup</p>
          </div>
        ) : (
          <div className="space-y-2">
            {players.map((player, i) => (
              <motion.div
                key={`${player.name}-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-xl"
              >
                <span className="text-2xl">{player.emoji}</span>
                <span className="flex-1 font-medium">{player.name}</span>
                <button
                  onClick={() => removePlayer(i)}
                  className="text-white/30 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-6 mt-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Gamepad2 className="w-5 h-5" />
          Recent Games
        </h2>
        <div className="text-center py-8 text-white/40">
          <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Game history will appear here</p>
          <p className="text-sm mt-1">Games are tracked when played online</p>
        </div>
      </div>
    </div>
  );
}
