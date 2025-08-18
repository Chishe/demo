import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {

  const apiKey = req.headers.get("SAKUMPOA");
  if (apiKey !== process.env.API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const partNumber = searchParams.get("partNumber");

  if (!partNumber) {
    return NextResponse.json({ exists: false }, { status: 400 });
  }

  const exists = await prisma.thresholds.findUnique({
    where: { partNumber },
  });

  return NextResponse.json({ exists: !!exists });
}
