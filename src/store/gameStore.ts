import { create } from "zustand";
import type { GameState, PlayerState, ChatMessage } from "@/types";

interface GameStore {
  game: GameState | null;
  currentPlayer: PlayerState | null;
  localPlayerId: string | null;
  messages: ChatMessage[];
  isConnected: boolean;
  error: string | null;

  setGame: (game: GameState | null) => void;
  setCurrentPlayer: (player: PlayerState | null) => void;
  setLocalPlayerId: (id: string) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setIsConnected: (connected: boolean) => void;
  setError: (error: string | null) => void;
  updatePlayerPosition: (
    userId: string,
    position: { x: number; y: number },
    facing: string,
    isMoving: boolean
  ) => void;
  killPlayer: (victimId: string) => void;
  completeTask: (taskId: string) => void;
  reset: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  game: null,
  currentPlayer: null,
  localPlayerId: null,
  messages: [],
  isConnected: false,
  error: null,

  setGame: (game) =>
    set({
      game,
      currentPlayer: game
        ? game.players.find(
            (p) => p.userId === get().localPlayerId
          ) || null
        : null,
    }),

  setCurrentPlayer: (player) => set({ currentPlayer: player }),

  setLocalPlayerId: (id) => set({ localPlayerId: id }),

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setIsConnected: (connected) => set({ isConnected: connected }),

  setError: (error) => set({ error }),

  updatePlayerPosition: (userId, position, facing, isMoving) =>
    set((state) => {
      if (!state.game) return state;
      return {
        game: {
          ...state.game,
          players: state.game.players.map((p) =>
            p.userId === userId
              ? { ...p, position, facing: facing as "left" | "right" | "up" | "down", isMoving }
              : p
          ),
        },
        currentPlayer:
          state.localPlayerId === userId
            ? {
                ...state.currentPlayer!,
                position,
                facing: facing as "left" | "right" | "up" | "down",
                isMoving,
              }
            : state.currentPlayer,
      };
    }),

  killPlayer: (victimId) =>
    set((state) => {
      if (!state.game) return state;
      return {
        game: {
          ...state.game,
          players: state.game.players.map((p) =>
            p.userId === victimId ? { ...p, alive: false } : p
          ),
        },
      };
    }),

  completeTask: (taskId) =>
    set((state) => {
      if (!state.game) return state;
      return {
        game: {
          ...state.game,
          tasks: state.game.tasks.map((t) =>
            t.id === taskId ? { ...t, completed: true } : t
          ),
          completedTasks: state.game.completedTasks + 1,
        },
      };
    }),

  reset: () =>
    set({
      game: null,
      currentPlayer: null,
      localPlayerId: null,
      messages: [],
      error: null,
    }),
}));
