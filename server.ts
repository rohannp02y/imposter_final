import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import {
  createGameState,
  addPlayerToGame,
  removePlayerFromGame,
  startGame,
  updatePlayerPosition,
  killPlayer,
  completeTask,
  callMeeting,
  castVote,
  tallyVotes,
  addChatMessage,
  generateRoomCode,
  createDefaultSettings,
} from "./src/lib/game-engine";
import type { GameState, GameSettings } from "./src/types";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const games: Map<string, GameState> = new Map();
const userSockets: Map<string, string> = new Map();
const socketUsers: Map<string, string> = new Map();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    const parsedUrl = parse(req.url!, true);
    await handle(req, res, parsedUrl);
  });

  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("user:online", (userId: string) => {
      userSockets.set(userId, socket.id);
      socketUsers.set(socket.id, userId);
      io.emit("user:status", { userId, online: true });
    });

    socket.on("room:create", (data: { userId: string; username: string; avatar: string; color: string; settings?: Partial<GameSettings> }) => {
      const code = generateRoomCode();
      const defaultSettings = createDefaultSettings();
      const settings = { ...defaultSettings, ...data.settings };
      const game = createGameState(code, data.userId, settings);
      const updatedGame = addPlayerToGame(game, data.userId, data.username, data.avatar, data.color);
      games.set(code, updatedGame);
      socket.join(code);
      socket.emit("room:created", { code, game: updatedGame });
    });

    socket.on("room:join", (data: { code: string; userId: string; username: string; avatar: string; color: string }) => {
      const game = games.get(data.code);
      if (!game) {
        socket.emit("room:error", { message: "Room not found" });
        return;
      }

      if (game.status !== "WAITING") {
        socket.emit("room:error", { message: "Game already in progress" });
        return;
      }

      try {
        const updatedGame = addPlayerToGame(game, data.userId, data.username, data.avatar, data.color);
        games.set(data.code, updatedGame);
        socket.join(data.code);
        io.to(data.code).emit("room:updated", updatedGame);
        socket.emit("room:joined", { code: data.code, game: updatedGame });
      } catch (error) {
        socket.emit("room:error", { message: (error as Error).message });
      }
    });

    socket.on("room:leave", (data: { code: string; userId: string }) => {
      const game = games.get(data.code);
      if (!game) return;

      const updatedGame = removePlayerFromGame(game, data.userId);
      socket.leave(data.code);

      if (updatedGame.players.length === 0) {
        games.delete(data.code);
      } else {
        if (updatedGame.hostId === data.userId && updatedGame.players.length > 0) {
          updatedGame.hostId = updatedGame.players[0].userId;
        }
        games.set(data.code, updatedGame);
        io.to(data.code).emit("room:updated", updatedGame);
      }

      socket.emit("room:left");
    });

    socket.on("room:ready", (data: { code: string; userId: string }) => {
      const game = games.get(data.code);
      if (!game) return;

      const updatedGame = {
        ...game,
        players: game.players.map((p) =>
          p.userId === data.userId ? { ...p, isReady: !p.isReady } : p
        ),
      };

      games.set(data.code, updatedGame);
      io.to(data.code).emit("room:updated", updatedGame);
    });

    socket.on("room:updateSettings", (data: { code: string; userId: string; settings: Partial<GameSettings> }) => {
      const game = games.get(data.code);
      if (!game || game.hostId !== data.userId) return;

      const updatedGame = {
        ...game,
        settings: { ...game.settings, ...data.settings },
      };

      games.set(data.code, updatedGame);
      io.to(data.code).emit("room:updated", updatedGame);
    });

    socket.on("game:start", (data: { code: string; userId: string }) => {
      const game = games.get(data.code);
      if (!game || game.hostId !== data.userId) return;

      try {
        const updatedGame = startGame(game);
        games.set(data.code, updatedGame);
        io.to(data.code).emit("game:started", updatedGame);
      } catch (error) {
        socket.emit("game:error", { message: (error as Error).message });
      }
    });

    socket.on("player:move", (data: { code: string; userId: string; position: { x: number; y: number }; facing: string; isMoving: boolean }) => {
      const game = games.get(data.code);
      if (!game) return;

      const updatedGame = updatePlayerPosition(
        game,
        data.userId,
        data.position,
        data.facing as "left" | "right" | "up" | "down",
        data.isMoving
      );

      games.set(data.code, updatedGame);
      socket.to(data.code).emit("player:moved", {
        userId: data.userId,
        position: data.position,
        facing: data.facing,
        isMoving: data.isMoving,
      });
    });

    socket.on("player:kill", (data: { code: string; killerId: string; victimId: string }) => {
      const game = games.get(data.code);
      if (!game) return;

      try {
        const updatedGame = killPlayer(game, data.killerId, data.victimId);
        games.set(data.code, updatedGame);
        io.to(data.code).emit("player:killed", {
          victimId: data.victimId,
          game: updatedGame,
        });
      } catch (error) {
        socket.emit("game:error", { message: (error as Error).message });
      }
    });

    socket.on("task:complete", (data: { code: string; userId: string; taskId: string }) => {
      const game = games.get(data.code);
      if (!game) return;

      try {
        const updatedGame = completeTask(game, data.userId, data.taskId);
        games.set(data.code, updatedGame);
        io.to(data.code).emit("task:completed", {
          taskId: data.taskId,
          userId: data.userId,
          game: updatedGame,
        });
      } catch (error) {
        socket.emit("game:error", { message: (error as Error).message });
      }
    });

    socket.on("meeting:call", (data: { code: string; userId: string; type?: string }) => {
      const game = games.get(data.code);
      if (!game) return;

      try {
        const updatedGame = callMeeting(
          game,
          data.userId,
          (data.type as "EMERGENCY" | "BODY_REPORTED") || "EMERGENCY"
        );
        games.set(data.code, updatedGame);
        io.to(data.code).emit("meeting:started", updatedGame);
      } catch (error) {
        socket.emit("game:error", { message: (error as Error).message });
      }
    });

    socket.on("meeting:vote", (data: { code: string; voterId: string; targetId: string | null }) => {
      const game = games.get(data.code);
      if (!game) return;

      try {
        const updatedGame = castVote(game, data.voterId, data.targetId);
        games.set(data.code, updatedGame);
        io.to(data.code).emit("meeting:voteUpdate", updatedGame);

        const aliveVoters = updatedGame.players.filter((p) => p.alive);
        const votesCast = updatedGame.meeting?.votes.length || 0;

        if (votesCast >= aliveVoters.length) {
          const finalGame = tallyVotes(updatedGame);
          games.set(data.code, finalGame);
          io.to(data.code).emit("meeting:tallied", finalGame);
        }
      } catch (error) {
        socket.emit("game:error", { message: (error as Error).message });
      }
    });

    socket.on("meeting:message", (data: { code: string; userId: string; username: string; avatar: string; content: string }) => {
      const game = games.get(data.code);
      if (!game) return;

      try {
        const updatedGame = addChatMessage(game, data.userId, data.username, data.avatar, data.content);
        games.set(data.code, updatedGame);
        io.to(data.code).emit("meeting:newMessage", updatedGame.meeting?.messages.slice(-1)[0]);
      } catch (error) {
        socket.emit("game:error", { message: (error as Error).message });
      }
    });

    socket.on("game:state", (data: { code: string }) => {
      const game = games.get(data.code);
      if (game) {
        socket.emit("game:state", game);
      }
    });

    socket.on("disconnect", () => {
      const userId = socketUsers.get(socket.id);
      if (userId) {
        userSockets.delete(userId);
        socketUsers.delete(socket.id);
        io.emit("user:status", { userId, online: false });
      }
      console.log("Client disconnected:", socket.id);
    });
  });

  server.listen(port, () => {
    console.log(`> Imposter App running at http://${hostname}:${port}`);
  });
});
