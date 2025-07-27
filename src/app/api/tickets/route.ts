// /api/tickets/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const tickets = await prisma.ticket.findMany({
      include: { agent: true }, // Include agent data
    });
    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
