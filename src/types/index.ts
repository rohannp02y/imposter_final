export interface Position {
  x: number;
  y: number;
}

export interface GameSettings {
  maxPlayers: number;
  minPlayers: number;
  numImposters: number;
  mapName: string;
  discussionTime: number;
  votingTime: number;
  killCooldown: number;
  taskCount: number;
  speed: number;
  emergencyMeetings: number;
  isPublic: boolean;
  isPassAndPlay: boolean;
}

export interface PlayerState {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  color: string;
  role: "CREW" | "IMPOSTER";
  alive: boolean;
  isReady: boolean;
  position: Position;
  speed: number;
  tasksDone: number;
  kills: number;
  votes: number;
  isMoving: boolean;
  facing: "left" | "right" | "up" | "down";
}

export interface Task {
  id: string;
  taskId: string;
  taskType: string;
  taskName: string;
  completed: boolean;
  position: Position;
  playerId: string;
}

export interface VoteState {
  voterId: string;
  targetId: string | null;
  isSkip: boolean;
}

export interface MeetingState {
  id: string;
  type: "EMERGENCY" | "BODY_REPORTED";
  callerId: string;
  callerName: string;
  status: "DISCUSSION" | "VOTING" | "ENDED";
  discussionTimeLeft: number;
  votingTimeLeft: number;
  votes: VoteState[];
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: "TEXT" | "SYSTEM" | "VOTE";
  timestamp: number;
}

export interface GameState {
  code: string;
  status: string;
  hostId: string;
  settings: GameSettings;
  players: PlayerState[];
  tasks: Task[];
  totalTasks: number;
  completedTasks: number;
  currentRound: number;
  meeting: MeetingState | null;
  winner: "CREW" | "IMPOSTER" | null;
  timeLeft: number;
}

export interface RoomInfo {
  code: string;
  hostName: string;
  playerCount: number;
  maxPlayers: number;
  status: string;
  isPublic: boolean;
  mapName: string;
}

export interface TaskDefinition {
  type: string;
  name: string;
  description: string;
  duration: number;
  position: Position;
}

export const MAP_TASKS: Record<string, TaskDefinition[]> = {
  skeld: [
    { type: "WIRE_FIX", name: "Fix Wiring", description: "Match the colored wires", duration: 3000, position: { x: 200, y: 150 } },
    { type: "CARD_SWIPE", name: "Swipe Card", description: "Swipe your keycard at the right speed", duration: 2000, position: { x: 400, y: 100 } },
    { type: "UPLOAD_DATA", name: "Upload Data", description: "Wait for data to upload", duration: 5000, position: { x: 600, y: 200 } },
    { type: "DOWNLOAD_DATA", name: "Download Data", description: "Download files from the admin", duration: 4000, position: { x: 350, y: 300 } },
    { type: "FUEL_ENGINE", name: "Fuel Engine", description: "Fill up the engine fuel", duration: 3000, position: { x: 150, y: 400 } },
    { type: "ALIGN_ENGINE", name: "Align Engine", description: "Align the engine to the correct position", duration: 4000, position: { x: 700, y: 350 } },
    { type: "CHART_COURSE", name: "Chart Course", description: "Chart a course through space", duration: 3000, position: { x: 500, y: 50 } },
    { type: "STERILIZE_SPECIMEN", name: "Sterilize Specimen", description: "Sterilize specimens in the laboratory", duration: 5000, position: { x: 250, y: 250 } },
    { type: "CLEAN_OXYGEN_FILTER", name: "Clean O2 Filter", description: "Clean leaves from the oxygen filter", duration: 3000, position: { x: 450, y: 400 } },
    { type: "EMPTY_GARBAGE", name: "Empty Garbage", description: "Empty the garbage chute", duration: 2500, position: { x: 100, y: 300 } },
    { type: "REACTOR_STARTUP", name: "Start Reactor", description: "Start up the reactor in sequence", duration: 6000, position: { x: 50, y: 200 } },
    { type: "OPEN_MANIFOLDS", name: "Open Manifolds", description: "Open the manifolds in order", duration: 4000, position: { x: 650, y: 100 } },
    { type: "PRIMESHIELD", name: "Prime Shield", description: "Activate the shields", duration: 3000, position: { x: 550, y: 300 } },
    { type: "RESTORE_POWER", name: "Restore Power", description: "Restore power to the electrical system", duration: 4000, position: { x: 300, y: 350 } },
  ],
  mira: [
    { type: "WIRE_FIX", name: "Fix Wiring", description: "Match the colored wires", duration: 3000, position: { x: 200, y: 150 } },
    { type: "UPLOAD_DATA", name: "Upload Data", description: "Upload data to HQ", duration: 5000, position: { x: 600, y: 200 } },
    { type: "FUEL_ENGINE", name: "Fuel Engine", description: "Fill up the engine", duration: 3000, position: { x: 150, y: 400 } },
    { type: "CHART_COURSE", name: "Chart Course", description: "Chart course through space", duration: 3000, position: { x: 500, y: 50 } },
    { type: "CLEAN_OXYGEN_FILTER", name: "Clean O2 Filter", description: "Clean the oxygen filter", duration: 3000, position: { x: 450, y: 400 } },
    { type: "EMPTY_GARBAGE", name: "Empty Garbage", description: "Empty the garbage", duration: 2500, position: { x: 100, y: 300 } },
  ],
  polus: [
    { type: "WIRE_FIX", name: "Fix Wiring", description: "Fix the electrical wiring", duration: 3000, position: { x: 200, y: 150 } },
    { type: "CARD_SWIPE", name: "Swipe Card", description: "Swipe your keycard", duration: 2000, position: { x: 400, y: 100 } },
    { type: "UPLOAD_DATA", name: "Upload Data", description: "Upload data", duration: 5000, position: { x: 600, y: 200 } },
    { type: "ALIGN_ENGINE", name: "Align Engine", description: "Align the engine", duration: 4000, position: { x: 700, y: 350 } },
    { type: "STERILIZE_SPECIMEN", name: "Sterilize Specimen", description: "Sterilize specimens", duration: 5000, position: { x: 250, y: 250 } },
    { type: "EMPTY_GARBAGE", name: "Empty Garbage", description: "Empty garbage", duration: 2500, position: { x: 100, y: 300 } },
  ],
};

export const AVATARS = [
  "red", "blue", "green", "yellow", "purple",
  "orange", "pink", "cyan", "brown", "white",
];

export const COLORS = [
  "#EF4444", "#3B82F6", "#22C55E", "#EAB308", "#A855F7",
  "#F97316", "#EC4899", "#06B6D4", "#92400E", "#F8FAFC",
];
