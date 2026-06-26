"use client";

import { motion } from "framer-motion";
import type { GameState, PlayerState } from "@/types";

interface GameBoardProps {
  game: GameState;
  currentUserId: string;
}

const MAP_WIDTH = 800;
const MAP_HEIGHT = 600;

const ROOMS: Array<{
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}> = [
  { name: "Cafeteria", x: 300, y: 250, width: 200, height: 150, color: "#1E293B" },
  { name: "Admin", x: 550, y: 250, width: 120, height: 100, color: "#1E293B" },
  { name: "Electrical", x: 100, y: 350, width: 120, height: 100, color: "#1E293B" },
  { name: "Storage", x: 100, y: 200, width: 120, height: 100, color: "#1E293B" },
  { name: "MedBay", x: 300, y: 100, width: 120, height: 100, color: "#1E293B" },
  { name: "Reactor", x: 50, y: 100, width: 120, height: 100, color: "#1E293B" },
  { name: "Navigation", x: 650, y: 100, width: 120, height: 100, color: "#1E293B" },
  { name: "Weapons", x: 650, y: 250, width: 120, height: 100, color: "#1E293B" },
  { name: "Shields", x: 650, y: 400, width: 120, height: 100, color: "#1E293B" },
  { name: "Comms", x: 400, y: 430, width: 120, height: 100, color: "#1E293B" },
  { name: "Upper Engine", x: 50, y: 350, width: 100, height: 80, color: "#1E293B" },
  { name: "Lower Engine", x: 50, y: 450, width: 100, height: 80, color: "#1E293B" },
];

const CORRIDORS: Array<{ x1: number; y1: number; x2: number; y2: number }> = [
  { x1: 220, y1: 300, x2: 300, y2: 300 },
  { x1: 500, y1: 300, x2: 550, y2: 300 },
  { x1: 670, y1: 200, x2: 670, y2: 250 },
  { x1: 670, y1: 350, x2: 670, y2: 400 },
  { x1: 400, y1: 400, x2: 400, y2: 430 },
  { x1: 160, y1: 200, x2: 160, y2: 350 },
  { x1: 160, y1: 150, x2: 160, y2: 200 },
  { x1: 160, y1: 150, x2: 300, y2: 150 },
  { x1: 420, y1: 150, x2: 650, y2: 150 },
  { x1: 500, y1: 150, x2: 500, y2: 250 },
  { x1: 300, y1: 100, x2: 300, y2: 250 },
  { x1: 550, y1: 350, x2: 550, y2: 430 },
];

export function GameBoard({ game, currentUserId }: GameBoardProps) {
  const currentPlayer = game.players.find((p) => p.userId === currentUserId);
  const isImposter = currentPlayer?.role === "IMPOSTER";

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        className="absolute inset-0 bg-[#0a0f1a]"
        style={{ width: MAP_WIDTH, height: MAP_HEIGHT, margin: "auto" }}
      >
        <svg width={MAP_WIDTH} height={MAP_HEIGHT} className="absolute inset-0">
          {CORRIDORS.map((c, i) => (
            <line
              key={`corridor-${i}`}
              x1={c.x1}
              y1={c.y1}
              x2={c.x2}
              y2={c.y2}
              stroke="#1a2332"
              strokeWidth="40"
              strokeLinecap="round"
            />
          ))}
          {CORRIDORS.map((c, i) => (
            <line
              key={`corridor-bg-${i}`}
              x1={c.x1}
              y1={c.y1}
              x2={c.x2}
              y2={c.y2}
              stroke="#0d1520"
              strokeWidth="36"
              strokeLinecap="round"
            />
          ))}

          {ROOMS.map((room, i) => (
            <g key={`room-${i}`}>
              <rect
                x={room.x}
                y={room.y}
                width={room.width}
                height={room.height}
                rx="8"
                fill="#0d1520"
                stroke="#1a2332"
                strokeWidth="2"
              />
              <text
                x={room.x + room.width / 2}
                y={room.y + room.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#2a3a4a"
                fontSize="12"
                fontWeight="500"
              >
                {room.name}
              </text>
            </g>
          ))}
        </svg>

        {game.players
          .filter((p) => p.alive)
          .map((player) => (
            <PlayerSprite
              key={player.id}
              player={player}
              isSelf={player.userId === currentUserId}
              canSeeRole={isImposter}
            />
          ))}

        {game.tasks
          .filter((t) => !t.completed)
          .map((task) => (
            <div
              key={task.id}
              className="absolute w-4 h-4 bg-yellow-500/60 rounded-full animate-pulse cursor-pointer hover:bg-yellow-400 transition-colors"
              style={{
                left: task.position.x - 8,
                top: task.position.y - 8,
              }}
              title={task.taskName}
            />
          ))}
      </div>
    </div>
  );
}

function PlayerSprite({
  player,
  isSelf,
  canSeeRole,
}: {
  player: PlayerState;
  isSelf: boolean;
  canSeeRole: boolean;
}) {
  const facingX = player.facing === "left" ? -1 : player.facing === "right" ? 1 : 0;
  const facingY = player.facing === "up" ? -1 : player.facing === "down" ? 1 : 0;

  return (
    <motion.div
      className="absolute z-10"
      style={{
        left: player.position.x - 20,
        top: player.position.y - 30,
      }}
      animate={{
        x: 0,
        y: player.isMoving ? [0, -2, 0] : 0,
      }}
      transition={{
        y: {
          duration: 0.3,
          repeat: player.isMoving ? Infinity : 0,
        },
      }}
    >
      <div className="relative flex flex-col items-center">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white/30"
          style={{
            backgroundColor: player.color,
            transform: `scaleX(${facingX || 1})`,
          }}
        >
          {player.username[0]?.toUpperCase()}
        </div>

        <div className="w-8 h-2 bg-white/30 rounded-full mt-0.5" />

        <div className="absolute -bottom-5 whitespace-nowrap">
          <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
            isSelf ? "bg-imposter-red/80 text-white" : "bg-black/60 text-white/80"
          }`}>
            {player.username}
          </span>
        </div>

        {canSeeRole && player.role === "IMPOSTER" && !isSelf && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-[8px] text-white font-bold">!</span>
          </div>
        )}

        {isSelf && (
          <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-white animate-pulse-ring" />
        )}
      </div>
    </motion.div>
  );
}
