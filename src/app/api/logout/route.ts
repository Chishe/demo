import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // ตรวจสอบ API Key
  const apiKey = req.headers.get("SAKUMPOA");
  if (apiKey !== process.env.API_KEY) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  // ลบ cookie token
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
