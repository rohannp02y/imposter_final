"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Play, Pause, SkipForward } from "lucide-react";
import { AvatarSVG } from "@/components/game/AvatarSVG";

interface PlayerRole {
  player: { name: string; color: string };
  role: "crew" | "imposter";
  word: string | null;
  hint: string | null;
}

export default function DiscussPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<PlayerRole[]>([]);
  const [timerDuration, setTimerDuration] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const storedRoles = localStorage.getItem("imposter-roles");
    const storedGame = localStorage.getItem("imposter-pass-and-play");

    if (!storedRoles || !storedGame) {
      router.push("/game/pass-and-play/setup");
      return;
    }

    setRoles(JSON.parse(storedRoles));
    const game = JSON.parse(storedGame);
    setTimerDuration(game.timerDuration);

    if (game.timerDuration) {
      setTimeLeft(game.timerDuration);
    }
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

  const handleVoting = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    router.push("/game/pass-and-play/vote");
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (!timerDuration) return "text-white";
    const ratio = timeLeft / timerDuration;
    if (ratio > 0.5) return "text-green-400";
    if (ratio > 0.15) return "text-yellow-400";
    return "text-red-400";
  };

  const crewCount = roles.filter((r) => r.role === "crew").length;
  const imposterCount = roles.filter((r) => r.role === "imposter").length;

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-yellow-400">Discussion Time</span>
            </h1>
            <p className="text-white/50">
              Give one-word clues to describe your word
            </p>
          </div>

          {timerDuration && (
            <div className="card p-8 text-center mb-6">
              <motion.div
                className={`text-7xl font-mono font-bold ${getTimerColor()} ${
                  timeLeft <= 15 && timeLeft > 0 && isRunning
                    ? "animate-pulse"
                    : ""
                }`}
                animate={
                  timeLeft <= 15 && timeLeft > 0 && isRunning
                    ? { scale: [1, 1.05, 1] }
                    : {}
                }
                transition={{ duration: 1, repeat: Infinity }}
              >
                {formatTime(timeLeft)}
              </motion.div>

              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={toggleTimer}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    isRunning
                      ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                      : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4 inline mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 inline mr-2" />
                      {hasStarted ? "Resume" : "Start"}
                    </>
                  )}
                </button>
                <button onClick={skipTimer} className="btn-ghost">
                  <SkipForward className="w-4 h-4 inline mr-2" />
                  Skip
                </button>
              </div>

              {timeLeft === 0 && hasStarted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-red-400 font-bold text-lg"
                >
                  Time's up! Move to voting.
                </motion.div>
              )}
            </div>
          )}

          {!timerDuration && (
            <div className="card p-6 mb-6 text-center">
              <p className="text-white/50">
                No timer set — discuss freely, then tap below when ready to vote
              </p>
            </div>
          )}

          <div className="card p-6 mb-6">
            <h2 className="font-semibold mb-4">Players</h2>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-xl"
                >
                  <AvatarSVG color={r.player.color} size={36} />
                  <span className="font-medium">{r.player.name}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-white/40 text-center">
              {crewCount} crewmates • {imposterCount} imposter{imposterCount > 1 ? "s" : ""}
            </div>
          </div>

          <button onClick={handleVoting} className="btn-primary w-full py-4 text-lg">
            Move to Voting
          </button>
        </motion.div>
      </div>
    </div>
  );
}
