"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown, TrendingUp } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  color: string;
  elo: number;
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  imposterWins: number;
  crewWins: number;
  bestStreak: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"elo" | "wins" | "winrate">("elo");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/users/stats");
        const data = await response.json();
        if (Array.isArray(data)) {
          setLeaderboard(data);
        }
      } catch {
        console.error("Failed to fetch leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    if (activeTab === "elo") return b.elo - a.elo;
    if (activeTab === "wins") return b.gamesWon - a.gamesWon;
    return b.winRate - a.winRate;
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="text-white/50 w-5 text-center">{rank}</span>;
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Leaderboard</span>
          </h1>
          <p className="text-white/50">Top players ranked by skill</p>
        </motion.div>

        <div className="flex justify-center gap-2 mb-8">
          {(["elo", "wins", "winrate"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-imposter-red text-white"
                  : "bg-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              {tab === "elo" && <TrendingUp className="w-4 h-4 inline mr-1" />}
              {tab === "wins" && <Trophy className="w-4 h-4 inline mr-1" />}
              {tab === "winrate" && <Medal className="w-4 h-4 inline mr-1" />}
              {tab === "elo" ? "ELO" : tab === "wins" ? "Wins" : "Win Rate"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-imposter-red border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : sortedLeaderboard.length === 0 ? (
          <div className="card p-12 text-center">
            <Trophy className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No Rankings Yet</h2>
            <p className="text-white/50">Play some games to appear on the leaderboard!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedLeaderboard.map((entry, index) => (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`card p-4 flex items-center gap-4 ${
                  index < 3 ? "border-imposter-red/30" : ""
                }`}
              >
                <div className="w-10 flex justify-center">
                  {getRankIcon(entry.rank)}
                </div>

                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                  style={{ backgroundColor: entry.color }}
                >
                  {entry.username[0]?.toUpperCase()}
                </div>

                <div className="flex-1">
                  <div className="font-semibold">{entry.username}</div>
                  <div className="text-sm text-white/50">
                    {entry.gamesPlayed} games played
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-blue-400">{entry.crewWins}</div>
                    <div className="text-xs text-white/40">Crew</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-red-400">{entry.imposterWins}</div>
                    <div className="text-xs text-white/40">Imposter</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-green-400">{entry.winRate}%</div>
                    <div className="text-xs text-white/40">Win Rate</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-bold text-imposter-red">{entry.elo}</div>
                  <div className="text-xs text-white/50">ELO</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
