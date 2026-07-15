"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PlayIcon, PauseIcon, SkipIcon, RefreshIcon, HomeIcon } from "@/components/icons/SvgIcons";
import { PlayerAvatar, ImposterIcon, CrewIcon, SecretIcon } from "@/components/icons/PlayerAvatar";

interface PlayerRole {
  player: { name: string; color: string };
  role: "crew" | "imposter";
  word: string | null;
}

interface RoundData {
  roles: PlayerRole[];
  secret: { word: string; categoryName: string };
}

export default function DiscussPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<PlayerRole[]>([]);
  const [round, setRound] = useState<RoundData | null>(null);
  const [starter, setStarter] = useState<number>(0);
  const [timerDuration, setTimerDuration] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const storedRoles = localStorage.getItem("imposter-roles-v2");
    const storedGame = localStorage.getItem("imposter-game-v2");
    if (!storedRoles || !storedGame) {
      router.push("/game/pass-and-play/setup");
      return;
    }
    const parsed: RoundData = JSON.parse(storedRoles);
    setRoles(parsed.roles);
    setRound(parsed);

    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    setStarter(buf[0] % parsed.roles.length);

    const game = JSON.parse(storedGame);
    setTimerDuration(game.timerDuration);
    if (game.timerDuration) setTimeLeft(game.timerDuration);
  }, [router]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            clearInterval(intervalRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    if (!hasStarted) setHasStarted(true);
    setIsRunning(!isRunning);
  };

  const skipTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleRevealImposter = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRevealed(true);
  };

  const handlePlayAgain = () => {
    localStorage.removeItem("imposter-roles-v2");
    router.push("/game/pass-and-play/reveal");
  };

  const handleNewSetup = () => {
    localStorage.removeItem("imposter-roles-v2");
    router.push("/game/pass-and-play/setup");
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const timerColor = () => {
    if (!timerDuration) return "text-ink-primary";
    const ratio = timeLeft / timerDuration;
    if (ratio > 0.5) return "text-ink-primary";
    if (ratio > 0.15) return "text-yellow-400";
    return "text-crimson-glow";
  };

  const imposterCount = roles.filter((r) => r.role === "imposter").length;

  // ── Reveal screen ──
  if (isRevealed && round) {
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

            <h1 className="text-display text-4xl text-crimson-glow mb-2">The Imposter Was</h1>

            <div className="bg-canvas/60 rounded-xl p-4 border border-hairline mt-4 mb-4">
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
                  {r.role === "imposter" ? <ImposterIcon size={20} /> : <CrewIcon size={20} />}
                </div>
              ))}
            </div>
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
              New Setup
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
    <div className="min-h-screen pt-24 pb-8 px-6 relative">
      <div className="absolute inset-0 gradient-mesh opacity-20 pointer-events-none" />
      <div className="max-w-lg mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <span className="text-ink-muted text-xs font-mono uppercase tracking-[0.3em] block mb-3">
              Round in progress
            </span>
            <h1 className="text-display text-4xl text-ink-primary mb-3">Discussion</h1>
            <p className="text-ink-secondary text-sm">
              Take turns giving one short clue about the word.
            </p>
            {roles[starter] && (
              <p className="text-ink-muted text-xs font-mono mt-2">
                <span className="text-crimson-glow">{roles[starter].player.name}</span> starts.
              </p>
            )}
          </div>

          {timerDuration ? (
            <div className="card-surface p-8 text-center mb-6">
              <motion.div
                className={`text-6xl md:text-7xl font-mono font-semibold tabular-nums ${timerColor()}`}
                animate={timeLeft <= 15 && timeLeft > 0 && isRunning ? { scale: [1, 1.04, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {formatTime(timeLeft)}
              </motion.div>

              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={toggleTimer}
                  className="btn-secondary flex items-center gap-2 px-6 py-3"
                >
                  {isRunning ? <PauseIcon size={15} /> : <PlayIcon size={15} />}
                  {isRunning ? "Pause" : hasStarted ? "Resume" : "Start Timer"}
                </button>
                <button onClick={skipTimer} className="btn-ghost flex items-center gap-2 px-6 py-3">
                  <SkipIcon size={15} />
                  Skip
                </button>
              </div>

              {timeLeft === 0 && hasStarted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-5 text-crimson-glow font-medium"
                >
                  Time&apos;s up — reveal the imposter.
                </motion.div>
              )}
            </div>
          ) : (
            <div className="card-surface p-6 mb-6 text-center">
              <p className="text-ink-secondary text-sm">
                No timer — discuss freely, then reveal when ready.
              </p>
            </div>
          )}

          <div className="card-surface p-6 mb-6">
            <div className="text-ink-muted text-xs font-mono uppercase tracking-widest mb-4">Players</div>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((r, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    i === starter ? "border-crimson/40 bg-crimson/5" : "border-hairline bg-canvas/40"
                  }`}
                >
                  <PlayerAvatar color={r.player.color} size={32} initial={r.player.name[0]} />
                  <span className="text-ink-primary text-sm truncate">{r.player.name}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-ink-muted text-xs font-mono text-center">
              {roles.length - imposterCount} crew · {imposterCount} imposter{imposterCount > 1 ? "s" : ""} hiding
            </div>
          </div>

          <button
            onClick={handleRevealImposter}
            className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
          >
            Reveal Imposter <ImposterIcon size={18} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
