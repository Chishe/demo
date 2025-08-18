// app/api/log-activity/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // ตรวจสอบ API Key
  const apiKey = req.headers.get("SAKUMPOA"); // client ต้องส่ง header นี้
  if (apiKey !== process.env.API_KEY) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { userId, action, type, meta, ip } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { success: false, message: "Missing userId or action" },
        { status: 400 }
      );
    }

    await prisma.userLog.create({
      data: {
        userId,
        action,
        type,
        meta,
        ip,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
