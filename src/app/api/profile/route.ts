import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ success: false });

  try {
    // decode base64
    const decoded = Buffer.from(token, "base64").toString("utf-8"); // "1:admin01"
    const [idStr] = decoded.split(":");
    const id = parseInt(idStr, 10);
    if (isNaN(id))
      return NextResponse.json({ success: false, message: "Invalid token" });

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return NextResponse.json({ success: false });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}
