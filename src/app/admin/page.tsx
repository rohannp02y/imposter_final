"use client";

import { useState, useEffect } from "react";
import { fetchGameStats, fetchAdminPacks, type GameLog, type AdminPack } from "@/lib/firestore";
import {
  GamepadIcon, TagsIcon, ActivityIcon, MessageIcon, LoaderIcon, CategoryIcon,
} from "@/components/icons/SvgIcons";

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="card-surface p-6">
      <div className="w-10 h-10 rounded-lg bg-crimson/10 text-crimson flex items-center justify-center mb-4">
        {icon}
      </div>
      <div className="text-ink-primary text-3xl font-semibold mb-1">{value}</div>
      <div className="text-ink-muted text-xs font-mono uppercase tracking-widest">{label}</div>
    </div>
  );
}

function formatWhen(log: GameLog): string {
  const ts = log.createdAt;
  if (!ts || typeof ts !== "object" || !("seconds" in ts)) return "—";
  const d = new Date((ts as { seconds: number }).seconds * 1000);
  return d.toLocaleString(undefined, {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [recent, setRecent] = useState<GameLog[]>([]);
  const [packs, setPacks] = useState<AdminPack[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([fetchGameStats(), fetchAdminPacks()])
      .then(([stats, loadedPacks]) => {
        setTotal(stats.total);
        setRecent(stats.recent);
        setPacks(loadedPacks);
      })
      .catch(() => setError("Could not load stats."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <LoaderIcon size={26} className="text-crimson" />
      </div>
    );
  }

  const categoryCount = packs.reduce((n, p) => n + p.categories.length, 0);
  const wordCount = packs.reduce(
    (n, p) => n + p.categories.reduce((m, c) => m + c.words.length, 0),
    0
  );
  const today = new Date().toDateString();
  const gamesToday = recent.filter((l) => {
    const ts = l.createdAt as { seconds?: number } | null;
    return ts?.seconds && new Date(ts.seconds * 1000).toDateString() === today;
  }).length;

  return (
    <div>
      <h1 className="text-display text-3xl text-ink-primary mb-2">Dashboard</h1>
      <p className="text-ink-secondary text-sm mb-8">Live overview of the game.</p>

      {error && <p className="text-crimson text-sm mb-6">{error}</p>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={<GamepadIcon size={18} />} label="Games played" value={total} />
        <StatCard icon={<ActivityIcon size={18} />} label="Games today" value={recent.length >= 20 && gamesToday === 20 ? "20+" : gamesToday} />
        <StatCard icon={<TagsIcon size={18} />} label="Categories" value={categoryCount} />
        <StatCard icon={<MessageIcon size={18} />} label="Words" value={wordCount} />
      </div>

      <div className="card-surface overflow-hidden">
        <div className="px-6 py-4 border-b border-hairline">
          <span className="text-ink-muted text-xs font-mono uppercase tracking-widest">
            Recent rounds
          </span>
        </div>
        {recent.length === 0 ? (
          <div className="p-10 text-center text-ink-muted text-sm">
            No games logged yet. Rounds appear here as people play.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-ink-muted text-xs font-mono uppercase tracking-wider border-b border-hairline">
                  <th className="text-left px-6 py-3 font-normal">When</th>
                  <th className="text-left px-6 py-3 font-normal">Players</th>
                  <th className="text-left px-6 py-3 font-normal">Imposters</th>
                  <th className="text-left px-6 py-3 font-normal">Hints</th>
                  <th className="text-left px-6 py-3 font-normal">Categories</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((log) => (
                  <tr key={log.id} className="border-b border-hairline/50 last:border-0">
                    <td className="px-6 py-3 text-ink-secondary whitespace-nowrap">{formatWhen(log)}</td>
                    <td className="px-6 py-3 text-ink-primary">{log.playerCount}</td>
                    <td className="px-6 py-3 text-crimson-glow">{log.imposterCount}</td>
                    <td className="px-6 py-3 text-ink-secondary">
                      {[log.hintWord && "Word", log.hintCategory && "Theme"].filter(Boolean).join(" + ") || "None"}
                    </td>
                    <td className="px-6 py-3 text-ink-muted font-mono text-xs">
                      {(log.categories || []).join(", ") || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-10">
        <div className="text-ink-muted text-xs font-mono uppercase tracking-widest mb-4">
          Word packs
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {packs.map((pack) => (
            <div key={pack.id} className="card-surface p-6">
              <div className="text-ink-primary font-medium mb-4">
                {pack.emoji} {pack.name}
              </div>
              <div className="flex flex-wrap gap-2">
                {pack.categories.map((cat) => (
                  <span
                    key={cat.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-canvas border border-hairline text-ink-secondary text-xs font-mono"
                  >
                    <CategoryIcon name={cat.icon} size={12} />
                    {cat.name} · {cat.words.length}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
