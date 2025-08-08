// app/api/log/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
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


