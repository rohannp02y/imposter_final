import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const game = await prisma.game.findUnique({
      where: { code: params.code },
      include: {
        players: {
          include: {
            user: {
              select: { id: true, username: true, avatar: true, color: true },
            },
          },
        },
      },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error("Get game error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
