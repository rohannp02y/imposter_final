import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (code) {
      const game = await prisma.game.findUnique({
        where: { code },
        include: {
          players: {
            include: { user: { select: { id: true, username: true, avatar: true, color: true } } },
          },
        },
      });

      if (!game) {
        return NextResponse.json({ error: "Game not found" }, { status: 404 });
      }

      return NextResponse.json(game);
    }

    const games = await prisma.game.findMany({
      where: { status: "WAITING", isPublic: true },
      include: {
        players: { select: { id: true } },
        host: { select: { username: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json(
      games.map((g) => ({
        code: g.code,
        hostName: g.host.username,
        playerCount: g.players.length,
        maxPlayers: g.maxPlayers,
        status: g.status,
        isPublic: g.isPublic,
        mapName: g.mapName,
      }))
    );
  } catch (error) {
    console.error("Get games error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
