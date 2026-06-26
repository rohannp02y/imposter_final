import { v4 as uuidv4 } from "uuid";
import type {
  GameState,
  PlayerState,
  GameSettings,
  Position,
  Task,
  VoteState,
  MeetingState,
  ChatMessage,
} from "@/types";
import { MAP_TASKS } from "@/types";

const ROOM_CODE_LENGTH = 6;

export function generateRoomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function createDefaultSettings(): GameSettings {
  return {
    maxPlayers: 10,
    minPlayers: 4,
    numImposters: 1,
    mapName: "skeld",
    discussionTime: 60,
    votingTime: 30,
    killCooldown: 25,
    taskCount: 5,
    speed: 1.0,
    emergencyMeetings: 1,
    isPublic: false,
    isPassAndPlay: false,
  };
}

export function createGameState(
  code: string,
  hostId: string,
  settings: GameSettings
): GameState {
  return {
    code,
    status: "WAITING",
    hostId,
    settings,
    players: [],
    tasks: [],
    totalTasks: 0,
    completedTasks: 0,
    currentRound: 0,
    meeting: null,
    winner: null,
    timeLeft: 0,
  };
}

export function addPlayerToGame(
  game: GameState,
  userId: string,
  username: string,
  avatar: string,
  color: string
): GameState {
  if (game.players.length >= game.settings.maxPlayers) {
    throw new Error("Game is full");
  }

  if (game.players.some((p) => p.userId === userId)) {
    throw new Error("Player already in game");
  }

  const position = getRandomSpawnPosition(game.settings.mapName);

  const newPlayer: PlayerState = {
    id: uuidv4(),
    userId,
    username,
    avatar,
    color,
    role: "CREW",
    alive: true,
    isReady: false,
    position,
    speed: game.settings.speed,
    tasksDone: 0,
    kills: 0,
    votes: 0,
    isMoving: false,
    facing: "down",
  };

  return {
    ...game,
    players: [...game.players, newPlayer],
  };
}

export function removePlayerFromGame(
  game: GameState,
  userId: string
): GameState {
  return {
    ...game,
    players: game.players.filter((p) => p.userId !== userId),
  };
}

export function startGame(game: GameState): GameState {
  if (game.players.length < game.settings.minPlayers) {
    throw new Error("Not enough players");
  }

  const imposters = assignRoles(game);
  const tasks = assignTasks(game, imposters);

  const totalTasks =
    game.players.filter((p) => p.role === "CREW").length *
    game.settings.taskCount;

  return {
    ...game,
    status: "PLAYING",
    players: game.players.map((p) => ({
      ...p,
      position: getRandomSpawnPosition(game.settings.mapName),
    })),
    tasks,
    totalTasks,
    completedTasks: 0,
    currentRound: 1,
    winner: null,
  };
}

function assignRoles(game: GameState): string[] {
  const shuffled = [...game.players].sort(() => Math.random() - 0.5);
  const imposterCount = Math.min(
    game.settings.numImposters,
    Math.floor(game.players.length / 3)
  );

  const imposterIds = shuffled.slice(0, imposterCount).map((p) => p.userId);

  return imposterIds;
}

function assignTasks(game: GameState, imposterIds: string[]): Task[] {
  const tasks: Task[] = [];
  const mapTasks = MAP_TASKS[game.settings.mapName] || MAP_TASKS.skeld;

  game.players.forEach((player) => {
    if (player.role === "IMPOSTER") return;

    const shuffledTasks = [...mapTasks].sort(() => Math.random() - 0.5);
    const playerTasks = shuffledTasks.slice(0, game.settings.taskCount);

    playerTasks.forEach((taskDef) => {
      tasks.push({
        id: uuidv4(),
        taskId: taskDef.type,
        taskType: taskDef.type,
        taskName: taskDef.name,
        completed: false,
        position: taskDef.position,
        playerId: player.userId,
      });
    });
  });

  return tasks;
}

function getRandomSpawnPosition(mapName: string): Position {
  const spawnPoints: Record<string, Position[]> = {
    skeld: [
      { x: 400, y: 350 },
      { x: 420, y: 340 },
      { x: 380, y: 360 },
      { x: 410, y: 370 },
      { x: 390, y: 340 },
    ],
    mira: [
      { x: 500, y: 300 },
      { x: 520, y: 290 },
      { x: 480, y: 310 },
    ],
    polus: [
      { x: 300, y: 400 },
      { x: 320, y: 390 },
      { x: 280, y: 410 },
    ],
  };

  const points = spawnPoints[mapName] || spawnPoints.skeld;
  return points[Math.floor(Math.random() * points.length)];
}

export function updatePlayerPosition(
  game: GameState,
  userId: string,
  position: Position,
  facing: "left" | "right" | "up" | "down",
  isMoving: boolean
): GameState {
  return {
    ...game,
    players: game.players.map((p) =>
      p.userId === userId
        ? { ...p, position, facing, isMoving }
        : p
    ),
  };
}

export function killPlayer(
  game: GameState,
  killerId: string,
  victimId: string
): GameState {
  const killer = game.players.find((p) => p.userId === killerId);
  const victim = game.players.find((p) => p.userId === victimId);

  if (!killer || !victim) throw new Error("Player not found");
  if (killer.role !== "IMPOSTER") throw new Error("Only imposters can kill");
  if (!killer.alive || !victim.alive) throw new Error("Player is dead");
  if (victim.role === "IMPOSTER") throw new Error("Cannot kill fellow imposter");

  const distance = Math.sqrt(
    Math.pow(killer.position.x - victim.position.x, 2) +
      Math.pow(killer.position.y - victim.position.y, 2)
  );

  if (distance > 100) throw new Error("Too far to kill");

  const updatedGame = {
    ...game,
    players: game.players.map((p) => {
      if (p.userId === victimId) return { ...p, alive: false };
      if (p.userId === killerId) return { ...p, kills: p.kills + 1 };
      return p;
    }),
  };

  checkWinCondition(updatedGame);
  return updatedGame;
}

export function completeTask(
  game: GameState,
  userId: string,
  taskId: string
): GameState {
  const player = game.players.find((p) => p.userId === userId);
  if (!player || player.role === "IMPOSTER") {
    throw new Error("Invalid action");
  }

  const updatedGame = {
    ...game,
    tasks: game.tasks.map((t) =>
      t.id === taskId && t.playerId === userId
        ? { ...t, completed: true }
        : t
    ),
    completedTasks: game.completedTasks + 1,
    players: game.players.map((p) =>
      p.userId === userId ? { ...p, tasksDone: p.tasksDone + 1 } : p
    ),
  };

  checkWinCondition(updatedGame);
  return updatedGame;
}

export function callMeeting(
  game: GameState,
  callerId: string,
  type: "EMERGENCY" | "BODY_REPORTED" = "EMERGENCY"
): GameState {
  const caller = game.players.find((p) => p.userId === callerId);
  if (!caller || !caller.alive) throw new Error("Cannot call meeting");

  if (type === "EMERGENCY") {
    const callerSettings = game.players.find((p) => p.userId === callerId);
    if (!callerSettings) throw new Error("Player not found");
  }

  const meeting: MeetingState = {
    id: uuidv4(),
    type,
    callerId,
    callerName: caller.username,
    status: "DISCUSSION",
    discussionTimeLeft: game.settings.discussionTime,
    votingTimeLeft: game.settings.votingTime,
    votes: [],
    messages: [
      {
        id: uuidv4(),
        senderId: "SYSTEM",
        senderName: "System",
        senderAvatar: "system",
        content:
          type === "EMERGENCY"
            ? `${caller.username} called an emergency meeting!`
            : `A body was reported by ${caller.username}!`,
        type: "SYSTEM",
        timestamp: Date.now(),
      },
    ],
  };

  return {
    ...game,
    status: "MEETING",
    meeting,
  };
}

export function castVote(
  game: GameState,
  voterId: string,
  targetId: string | null
): GameState {
  if (!game.meeting) throw new Error("No active meeting");
  if (game.meeting.status !== "VOTING") throw new Error("Not voting phase");

  const voter = game.players.find((p) => p.userId === voterId);
  if (!voter || !voter.alive) throw new Error("Cannot vote");

  if (game.meeting.votes.some((v) => v.voterId === voterId)) {
    throw new Error("Already voted");
  }

  const vote: VoteState = {
    voterId,
    targetId,
    isSkip: targetId === null,
  };

  const updatedMeeting: MeetingState = {
    ...game.meeting,
    votes: [...game.meeting.votes, vote],
  };

  return {
    ...game,
    meeting: updatedMeeting,
  };
}

export function tallyVotes(game: GameState): GameState {
  if (!game.meeting) throw new Error("No active meeting");

  const voteCounts: Record<string, number> = {};
  let skipVotes = 0;

  game.meeting.votes.forEach((vote) => {
    if (vote.isSkip) {
      skipVotes++;
    } else if (vote.targetId) {
      voteCounts[vote.targetId] = (voteCounts[vote.targetId] || 0) + 1;
    }
  });

  let ejectedId: string | null = null;
  let maxVotes = skipVotes;

  Object.entries(voteCounts).forEach(([id, count]) => {
    if (count > maxVotes) {
      maxVotes = count;
      ejectedId = id;
    } else if (count === maxVotes) {
      ejectedId = null;
    }
  });

  let updatedGame = { ...game };

  if (ejectedId) {
    updatedGame = {
      ...updatedGame,
      players: updatedGame.players.map((p) =>
        p.userId === ejectedId ? { ...p, alive: false } : p
      ),
    };
  }

  updatedGame = {
    ...updatedGame,
    status: "PLAYING",
    meeting: null,
    currentRound: updatedGame.currentRound + 1,
  };

  checkWinCondition(updatedGame);
  return updatedGame;
}

function checkWinCondition(game: GameState): void {
  const alivePlayers = game.players.filter((p) => p.alive);
  const aliveImposters = alivePlayers.filter((p) => p.role === "IMPOSTER");
  const aliveCrew = alivePlayers.filter((p) => p.role === "CREW");

  if (aliveImposters.length === 0) {
    game.winner = "CREW";
    game.status = "ENDED";
    return;
  }

  if (aliveImposters.length >= aliveCrew.length) {
    game.winner = "IMPOSTER";
    game.status = "ENDED";
    return;
  }

  if (game.completedTasks >= game.totalTasks) {
    game.winner = "CREW";
    game.status = "ENDED";
    return;
  }
}

export function addChatMessage(
  game: GameState,
  senderId: string,
  senderName: string,
  senderAvatar: string,
  content: string
): GameState {
  if (!game.meeting) throw new Error("No active meeting");

  const message: ChatMessage = {
    id: uuidv4(),
    senderId,
    senderName,
    senderAvatar,
    content,
    type: "TEXT",
    timestamp: Date.now(),
  };

  return {
    ...game,
    meeting: {
      ...game.meeting,
      messages: [...game.meeting.messages, message],
    },
  };
}

export function isPlayerNearTask(
  player: PlayerState,
  task: Task
): boolean {
  const distance = Math.sqrt(
    Math.pow(player.position.x - task.position.x, 2) +
      Math.pow(player.position.y - task.position.y, 2)
  );
  return distance < 80;
}

export function isPlayerNearPlayer(
  p1: PlayerState,
  p2: PlayerState
): boolean {
  const distance = Math.sqrt(
    Math.pow(p1.position.x - p2.position.x, 2) +
      Math.pow(p1.position.y - p2.position.y, 2)
  );
  return distance < 100;
}
