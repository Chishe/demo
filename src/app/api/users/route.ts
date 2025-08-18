// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkApiKey(req: NextRequest) {
  const apiKey = req.headers.get("SAKUMPOA");
  return apiKey === process.env.API_KEY;
}

export async function GET(req: NextRequest) {
  if (!(await checkApiKey(req))) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstname: true,
        lastname: true,
        level: true,
      },
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
