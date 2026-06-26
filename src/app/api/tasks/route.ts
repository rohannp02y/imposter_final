import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { gameId, tasksCompleted } = await req.json();

    if (!gameId || tasksCompleted === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const userId = (session.user as { id: string }).id;

    const stats = await prisma.userStats.upsert({
      where: { userId },
      create: {
        userId,
        totalTasks: tasksCompleted,
      },
      update: {
        totalTasks: { increment: tasksCompleted },
      },
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Update tasks error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const taskTypes = [
      { type: "WIRE_FIX", name: "Fix Wiring", description: "Match the colored wires" },
      { type: "CARD_SWIPE", name: "Swipe Card", description: "Swipe your keycard" },
      { type: "UPLOAD_DATA", name: "Upload Data", description: "Wait for data upload" },
      { type: "DOWNLOAD_DATA", name: "Download Data", description: "Download files" },
      { type: "FUEL_ENGINE", name: "Fuel Engine", description: "Fill up the engine" },
      { type: "ALIGN_ENGINE", name: "Align Engine", description: "Align the engine" },
      { type: "CHART_COURSE", name: "Chart Course", description: "Chart a course" },
      { type: "CLEAN_OXYGEN_FILTER", name: "Clean O2 Filter", description: "Clean the filter" },
      { type: "EMPTY_GARBAGE", name: "Empty Garbage", description: "Empty the garbage" },
    ];

    return NextResponse.json(taskTypes);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
