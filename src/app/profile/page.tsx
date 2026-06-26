"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function ProfileContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-imposter-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const user = session.user as {
    username?: string;
    avatar?: string;
    color?: string;
    stats?: {
      gamesPlayed: number;
      gamesWon: number;
      gamesLost: number;
      imposterGames: number;
      imposterWins: number;
      crewGames: number;
      crewWins: number;
      totalKills: number;
      totalTasks: number;
      elo: number;
      winStreak: number;
      bestStreak: number;
    };
  };

  const stats = user.stats;
  const winRate = stats && stats.gamesPlayed > 0
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
    : 0;

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          <span className="text-gradient">Profile</span>
        </h1>

        <div className="card p-6 mb-6">
          <div className="flex items-center gap-6">
            <div
              className="avatar-lg"
              style={{ backgroundColor: user.color || "#EF4444" }}
            >
              {user.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.username}</h2>
              <p className="text-white/50">{session.user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="badge bg-yellow-500/20 text-yellow-400">
                  ELO: {stats?.elo || 1000}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatCard label="Games Played" value={stats?.gamesPlayed || 0} />
          <StatCard label="Win Rate" value={`${winRate}%`} />
          <StatCard label="Win Streak" value={stats?.winStreak || 0} />
          <StatCard label="Best Streak" value={stats?.bestStreak || 0} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-semibold mb-4 text-blue-400">Crew Stats</h3>
            <div className="space-y-3">
              <StatRow label="Games" value={stats?.crewGames || 0} />
              <StatRow label="Wins" value={stats?.crewWins || 0} />
              <StatRow label="Tasks Done" value={stats?.totalTasks || 0} />
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold mb-4 text-red-400">Imposter Stats</h3>
            <div className="space-y-3">
              <StatRow label="Games" value={stats?.imposterGames || 0} />
              <StatRow label="Wins" value={stats?.imposterWins || 0} />
              <StatRow label="Total Kills" value={stats?.totalKills || 0} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-4 text-center">
      <div className="text-2xl font-bold text-imposter-red">{value}</div>
      <div className="text-xs text-white/50 mt-1">{label}</div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between">
      <span className="text-white/50 text-sm">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export default function ProfilePage() {
  return <ProfileContent />;
}
