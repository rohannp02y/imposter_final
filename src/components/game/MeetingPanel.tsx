"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GameState, ChatMessage } from "@/types";
import { Send, SkipForward } from "lucide-react";
import { playSound } from "@/lib/sounds";

interface MeetingPanelProps {
  game: GameState;
  currentUserId: string;
  onVote: (targetId: string | null) => void;
  onSendMessage: (content: string) => void;
}

export function MeetingPanel({
  game,
  currentUserId,
  onVote,
  onSendMessage,
}: MeetingPanelProps) {
  const [message, setMessage] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const meeting = game.meeting;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [meeting?.messages]);

  useEffect(() => {
    if (meeting?.votes.some((v) => v.voterId === currentUserId)) {
      setHasVoted(true);
    }
  }, [meeting?.votes, currentUserId]);

  if (!meeting) return null;

  const currentPlayer = game.players.find((p) => p.userId === currentUserId);
  const isAlive = currentPlayer?.alive ?? false;
  const alivePlayers = game.players.filter((p) => p.alive);
  const timeLeft =
    meeting.status === "DISCUSSION"
      ? meeting.discussionTimeLeft
      : meeting.votingTimeLeft;

  const handleSendMessage = () => {
    if (!message.trim()) return;
    onSendMessage(message.trim());
    setMessage("");
  };

  const handleVote = (targetId: string | null) => {
    if (hasVoted || !isAlive) return;
    playSound("vote");
    setSelectedTarget(targetId);
    onVote(targetId);
    setHasVoted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/90 z-30 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
        <div className="text-center mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-2 mb-2"
          >
            <span className="text-red-400 font-bold">
              {meeting.type === "EMERGENCY"
                ? "EMERGENCY MEETING"
                : "BODY REPORTED"}
            </span>
          </motion.div>
          <div className="text-sm text-white/50">
            Called by {meeting.callerName}
          </div>
          <div className="text-2xl font-mono font-bold text-imposter-red mt-2">
            {timeLeft}s
          </div>
        </div>

        <div className="flex-1 flex gap-4 min-h-0">
          <div className="flex-1 card p-4 flex flex-col">
            <h3 className="font-semibold mb-3">Discussion</h3>
            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
              {meeting.messages.map((msg: ChatMessage) => (
                <div
                  key={msg.id}
                  className={`${
                    msg.type === "SYSTEM"
                      ? "text-center text-sm text-yellow-400/80 py-2"
                      : "flex gap-2"
                  }`}
                >
                  {msg.type !== "SYSTEM" && (
                    <div
                      className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                      style={{
                        backgroundColor:
                          game.players.find((p) => p.userId === msg.senderId)
                            ?.color || "#666",
                      }}
                    >
                      {msg.senderName[0]?.toUpperCase()}
                    </div>
                  )}
                  {msg.type !== "SYSTEM" && (
                    <div>
                      <div className="text-xs font-medium text-white/70">
                        {msg.senderName}
                      </div>
                      <div className="text-sm">{msg.content}</div>
                    </div>
                  )}
                  {msg.type === "SYSTEM" && <span>{msg.content}</span>}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {meeting.status === "DISCUSSION" && isAlive && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  className="input-field flex-1"
                />
                <button
                  onClick={handleSendMessage}
                  className="btn-primary px-4"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="w-72 card p-4 flex flex-col">
            <h3 className="font-semibold mb-3">
              {meeting.status === "VOTING" ? "Vote to Eject" : "Players"}
            </h3>
            <div className="flex-1 overflow-y-auto space-y-2">
              {alivePlayers.map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center gap-3 p-2 rounded-xl transition-all ${
                    meeting.status === "VOTING" && isAlive && !hasVoted
                      ? "hover:bg-white/10 cursor-pointer"
                      : ""
                  } ${
                    selectedTarget === player.userId
                      ? "bg-red-500/20 border border-red-500/30"
                      : ""
                  }`}
                  onClick={() =>
                    meeting.status === "VOTING" &&
                    isAlive &&
                    !hasVoted &&
                    player.userId !== currentUserId &&
                    handleVote(player.userId)
                  }
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: player.color }}
                  >
                    {player.username[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{player.username}</div>
                    {player.userId === currentUserId && (
                      <div className="text-xs text-imposter-red">You</div>
                    )}
                  </div>
                  {meeting.status === "VOTING" &&
                    meeting.votes.some(
                      (v) => v.voterId === currentUserId && v.targetId === player.userId
                    ) && <span className="text-red-400">✓</span>}
                </div>
              ))}

              {meeting.status === "VOTING" &&
                alivePlayers.some(
                  (p) => !meeting.votes.some((v) => v.voterId === currentUserId)
                ) && (
                  <button
                    onClick={() => !hasVoted && isAlive && handleVote(null)}
                    disabled={hasVoted || !isAlive}
                    className="w-full flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all disabled:opacity-50"
                  >
                    <SkipForward className="w-5 h-5 text-white/50" />
                    <span className="text-sm">Skip Vote</span>
                  </button>
                )}
            </div>

            {meeting.status === "VOTING" && (
              <div className="pt-3 border-t border-white/10 mt-3 text-center">
                <span className="text-sm text-white/50">
                  {meeting.votes.length}/{alivePlayers.length} votes cast
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
