import { prisma } from "@/lib/prisma";

export async function logUserAction(
  userId: number,
  action: string,
  type?: string,
  meta?: object,
  ip?: string
) {
  try {
    await prisma.userLog.create({
      data: {
        userId,
        action,
        type,
        meta,
        ip,
      },
    });
  } catch (err) {
    console.error("Failed to log user action:", err);
  }
}
