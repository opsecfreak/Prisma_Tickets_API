// src/app/api/agents/route.ts
import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const agents = await prisma.agent.findMany();
  return NextResponse.json(agents);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, role } = body;

  if (!name || !email) {
    return new NextResponse("Missing name or email", { status: 400 });
  }

  try {
    const existing = await prisma.agent.findUnique({
      where: { email },
    });

    if (existing) {
      return new NextResponse("Agent with this email already exists", {
        status: 409,
      });
    }

    const agent = await prisma.agent.create({
      data: {
        name,
        email,
        role: role || "user",
      },
    });

    return NextResponse.json(agent, { status: 201 });
  } catch (error) {
    console.error("Agent creation failed", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
