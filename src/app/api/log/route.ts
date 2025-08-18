// app/api/log/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get("SAKUMPOA");
  if (apiKey !== process.env.API_KEY) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const logs = await prisma.log.findMany({
      orderBy: {
        id: "desc",
      },
    });
    return NextResponse.json(logs);
  } catch (error) {
    console.error("[GET_LOGS_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
