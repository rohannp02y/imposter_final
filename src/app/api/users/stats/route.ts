import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const stats = await prisma.userStats.findMany({
      include: { user: { select: { id: true, username: true, avatar: true, color: true } } },
      orderBy: { elo: "desc" },
      take: 50,
    });

    const leaderboard = stats.map((stat, index) => ({
      rank: index + 1,
      userId: stat.user.id,
      username: stat.user.username,
      avatar: stat.user.avatar,
      color: stat.user.color,
      elo: stat.elo,
      gamesPlayed: stat.gamesPlayed,
      gamesWon: stat.gamesWon,
      winRate: stat.gamesPlayed > 0
        ? Math.round((stat.gamesWon / stat.gamesPlayed) * 100)
        : 0,
      imposterWins: stat.imposterWins,
      crewWins: stat.crewWins,
      bestStreak: stat.bestStreak,
    }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
