"use client";

import { motion } from "framer-motion";
import type { GameState } from "@/types";

interface TaskPanelProps {
  game: GameState;
  currentUserId: string;
  onClose: () => void;
  onTaskClick: (taskId: string) => void;
}

export function TaskPanel({ game, currentUserId, onClose, onTaskClick }: TaskPanelProps) {
  const playerTasks = game.tasks.filter((t) => t.playerId === currentUserId);
  const completedCount = playerTasks.filter((t) => t.completed).length;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="fixed left-4 top-20 bottom-20 w-80 z-20 card p-4 overflow-hidden flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Tasks</h2>
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white text-2xl leading-none"
        >
          ×
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-white/50">Progress</span>
          <span className="text-imposter-red font-medium">
            {completedCount}/{playerTasks.length}
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="bg-imposter-red h-2 rounded-full transition-all"
            style={{
              width: `${playerTasks.length > 0 ? (completedCount / playerTasks.length) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {playerTasks.map((task) => (
          <div
            key={task.id}
            className={`p-3 rounded-xl transition-all ${
              task.completed
                ? "bg-green-500/20 border border-green-500/30"
                : "bg-white/5 border border-white/10 hover:border-imposter-red/30 cursor-pointer"
            }`}
            onClick={() => !task.completed && onTaskClick(task.id)}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  task.completed ? "bg-green-500" : "bg-white/20"
                }`}
              />
              <div className="flex-1">
                <div className={`font-medium text-sm ${task.completed ? "text-green-400" : ""}`}>
                  {task.taskName}
                </div>
                <div className="text-xs text-white/40 capitalize">
                  {task.taskType.replace(/_/g, " ").toLowerCase()}
                </div>
              </div>
              {task.completed && (
                <span className="text-green-400 text-sm">✓</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-white/10 mt-3">
        <p className="text-xs text-white/40 text-center">
          Click on yellow dots on the map to complete tasks
        </p>
      </div>
    </motion.div>
  );
}
