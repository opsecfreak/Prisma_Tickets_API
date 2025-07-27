import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma"; // ✅ This is correct if your output matches
const prisma = new PrismaClient();

// Create a new ticket
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, agentId, status } = body;

    if (!title || !description) {
      return new NextResponse("Missing title or description", { status: 400 });
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        status: status || "OPEN", // Defaults to OPEN if not provided
        agentId: agentId || null, // Optional foreign key
      },
      include: {
        agent: true, // Include related agent if available
      },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error("Ticket creation failed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Get all tickets
export async function GET(req: NextRequest) {
  try {
    const tickets = await prisma.ticket.findMany({
      include: { agent: true }, // Include related agent details
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Failed to fetch tickets:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
