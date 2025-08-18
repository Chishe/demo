import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkApiKey(req: NextRequest) {
  const apiKey = req.headers.get("SAKUMPOA");
  return apiKey === process.env.API_KEY;
}

// GET all thresholds
export async function GET(request: NextRequest) {
  if (!(await checkApiKey(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const thresholds = await prisma.thresholds.findMany({
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(thresholds);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch thresholds" }, { status: 500 });
  }
}

// POST create new threshold
export async function POST(request: NextRequest) {
  if (!(await checkApiKey(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  const { partNumber, standard, limitHigh, limitLow } = data;

  if (!partNumber || !standard || typeof limitHigh !== "number" || typeof limitLow !== "number") {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  try {
    const threshold = await prisma.thresholds.create({
      data: { partNumber, standard, limitHigh, limitLow },
    });
    return NextResponse.json(threshold, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002" && error.meta?.target?.includes("partNumber")) {
      return NextResponse.json({ error: "Part Number must be unique" }, { status: 400 });
    }
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
