"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSocket } from "@/hooks/useSocket";
import { useGameStore } from "@/store/gameStore";
import { GameBoard } from "@/components/game/GameBoard";
import { GameHUD } from "@/components/game/GameHUD";
import { TaskPanel } from "@/components/game/TaskPanel";
import { MeetingPanel } from "@/components/game/MeetingPanel";
import { KillButton } from "@/components/game/KillButton";
import { ResultsScreen } from "@/components/game/ResultsScreen";
import type { GameState, Position } from "@/types";

export default function PlayPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("#EF4444");
  const [showTasks, setShowTasks] = useState(false);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [taskProgress, setTaskProgress] = useState(0);

  const { game, setGame, setLocalPlayerId, updatePlayerPosition, killPlayer, completeTask } = useGameStore();
  const { emit, on, isConnected } = useSocket(userId);
  const gameLoopRef = useRef<number | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const positionRef = useRef<Position>({ x: 400, y: 350 });

  useEffect(() => {
    const stored = localStorage.getItem("imposter_user");
    if (stored) {
      const user = JSON.parse(stored);
      setUserId(user.id);
      setUsername(user.username);
      setAvatar(user.avatar || "#EF4444");
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  useEffect(() => {
    if (!userId || !code) return;
    setLocalPlayerId(userId);
    emit("game:state", { code });
  }, [userId, code, emit, setLocalPlayerId]);

  useEffect(() => {
    if (!on) return;

    const cleanupState = on("game:state", (data: unknown) => {
      const d = data as GameState;
      if (d) setGame(d);
    });

    const cleanupPlayerMoved = on("player:moved", (data: unknown) => {
      const d = data as { userId: string; position: Position; facing: string; isMoving: boolean };
      updatePlayerPosition(d.userId, d.position, d.facing, d.isMoving);
    });

    const cleanupPlayerKilled = on("player:killed", (data: unknown) => {
      const d = data as { victimId: string; game: GameState };
      killPlayer(d.victimId);
      setGame(d.game);
    });

    const cleanupTaskCompleted = on("task:completed", (data: unknown) => {
      const d = data as { taskId: string; game: GameState };
      completeTask(d.taskId);
      setGame(d.game);
    });

    const cleanupMeetingStarted = on("meeting:started", (data: unknown) => {
      const d = data as GameState;
      setGame(d);
    });

    const cleanupMeetingVoteUpdate = on("meeting:voteUpdate", (data: unknown) => {
      const d = data as GameState;
      setGame(d);
    });

    const cleanupMeetingTallied = on("meeting:tallied", (data: unknown) => {
      const d = data as GameState;
      setGame(d);
    });

    const cleanupMeetingNewMessage = on("meeting:newMessage", (data: unknown) => {
      const d = data as GameState;
      setGame(d);
    });

    return () => {
      cleanupState();
      cleanupPlayerMoved();
      cleanupPlayerKilled();
      cleanupTaskCompleted();
      cleanupMeetingStarted();
      cleanupMeetingVoteUpdate();
      cleanupMeetingTallied();
      cleanupMeetingNewMessage();
    };
  }, [on, setGame, updatePlayerPosition, killPlayer, completeTask]);

  const gameLoop = useCallback(() => {
    if (!game || game.status !== "PLAYING") return;

    const player = game.players.find((p) => p.userId === userId);
    if (!player || !player.alive) return;

    let dx = 0;
    let dy = 0;
    let facing: "left" | "right" | "up" | "down" = player.facing;
    let isMoving = false;

    if (keysRef.current.has("w") || keysRef.current.has("arrowup")) {
      dy = -4;
      facing = "up";
      isMoving = true;
    }
    if (keysRef.current.has("s") || keysRef.current.has("arrowdown")) {
      dy = 4;
      facing = "down";
      isMoving = true;
    }
    if (keysRef.current.has("a") || keysRef.current.has("arrowleft")) {
      dx = -4;
      facing = "left";
      isMoving = true;
    }
    if (keysRef.current.has("d") || keysRef.current.has("arrowright")) {
      dx = 4;
      facing = "right";
      isMoving = true;
    }

    if (dx !== 0 || dy !== 0) {
      const newX = Math.max(20, Math.min(780, positionRef.current.x + dx));
      const newY = Math.max(20, Math.min(580, positionRef.current.y + dy));

      positionRef.current = { x: newX, y: newY };
      updatePlayerPosition(userId, { x: newX, y: newY }, facing, true);
      emit("player:move", {
        code,
        userId,
        position: { x: newX, y: newY },
        facing,
        isMoving: true,
      });
    } else if (player.isMoving) {
      emit("player:move", {
        code,
        userId,
        position: positionRef.current,
        facing,
        isMoving: false,
      });
      updatePlayerPosition(userId, positionRef.current, facing, false);
    }
  }, [game, userId, code, emit, updatePlayerPosition]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());

      if (e.key === "Escape") {
        setShowTasks(false);
        setActiveTask(null);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (game?.status === "PLAYING") {
      gameLoopRef.current = window.setInterval(gameLoop, 1000 / 60);
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [game?.status, gameLoop]);

  useEffect(() => {
    if (game) {
      const player = game.players.find((p) => p.userId === userId);
      if (player) {
        positionRef.current = player.position;
      }
    }
  }, [game, userId]);

  const handleKill = (victimId: string) => {
    emit("player:kill", { code, killerId: userId, victimId });
  };

  const handleCallMeeting = () => {
    emit("meeting:call", { code, userId, type: "EMERGENCY" });
  };

  const handleVote = (targetId: string | null) => {
    emit("meeting:vote", { code, voterId: userId, targetId });
  };

  const handleSendMessage = (content: string) => {
    emit("meeting:message", { code, userId, username, avatar, content });
  };

  const handleCompleteTask = (taskId: string) => {
    emit("task:complete", { code, userId, taskId });
  };

  if (!game) {
    return (
      <div className="game-container flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-imposter-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50">Loading game...</p>
        </div>
      </div>
    );
  }

  if (game.status === "ENDED") {
    return <ResultsScreen game={game} />;
  }

  const currentPlayer = game.players.find((p) => p.userId === userId);

  return (
    <div className="game-container bg-imposter-dark">
      <GameHUD game={game} />

      {game.status === "PLAYING" && (
        <>
          <GameBoard game={game} currentUserId={userId} />

          {currentPlayer?.role === "IMPOSTER" && (
            <KillButton
              game={game}
              currentUserId={userId}
              onKill={handleKill}
            />
          )}

          {currentPlayer?.role === "CREW" && (
            <button
              onClick={() => setShowTasks(!showTasks)}
              className="fixed bottom-6 left-6 z-20 btn-primary"
            >
              Tasks ({game.tasks.filter((t) => t.playerId === userId && t.completed).length}/
              {game.tasks.filter((t) => t.playerId === userId).length})
            </button>
          )}

          <button
            onClick={handleCallMeeting}
            className="fixed bottom-6 right-6 z-20 w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-400 transition-colors"
            title="Call Emergency Meeting"
          >
            <span className="text-2xl">!</span>
          </button>

          {showTasks && (
            <TaskPanel
              game={game}
              currentUserId={userId}
              onClose={() => setShowTasks(false)}
              onTaskClick={(taskId) => setActiveTask(taskId)}
            />
          )}

          {activeTask && (
            <TaskMiniGame
              taskId={activeTask}
              onComplete={() => {
                handleCompleteTask(activeTask);
                setActiveTask(null);
              }}
              onClose={() => setActiveTask(null)}
            />
          )}
        </>
      )}

      {game.status === "MEETING" && game.meeting && (
        <MeetingPanel
          game={game}
          currentUserId={userId}
          onVote={handleVote}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
}

function TaskMiniGame({
  taskId,
  onComplete,
  onClose,
}: {
  taskId: string;
  onComplete: () => void;
  onClose: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setCompleted(true);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (completed) {
      const timeout = setTimeout(onComplete, 500);
      return () => clearTimeout(timeout);
    }
  }, [completed, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-30 flex items-center justify-center"
    >
      <div className="card p-8 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4 text-center">Completing Task...</h3>

        <div className="w-full bg-white/10 rounded-full h-4 mb-4">
          <motion.div
            className="bg-imposter-red h-4 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-center text-white/50 text-sm mb-4">
          {completed ? "Task Complete!" : "Hold still..."}
        </p>

        {!completed && (
          <button
            onClick={onClose}
            className="btn-ghost w-full text-sm"
          >
            Cancel
          </button>
        )}
      </div>
    </motion.div>
  );
}
