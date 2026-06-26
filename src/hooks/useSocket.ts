import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useCallback, useState } from "react";
import type { GameState } from "@/types";

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3000";

export function useSocket(userId?: string) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("user:online", userId);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  const emit = useCallback(
    (event: string, data?: unknown) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit(event, data);
      }
    },
    []
  );

  const on = useCallback(
    (event: string, callback: (...args: unknown[]) => void) => {
      socketRef.current?.on(event, callback);
      return () => {
        socketRef.current?.off(event, callback);
      };
    },
    []
  );

  return { socket: socketRef.current, isConnected, emit, on };
}
