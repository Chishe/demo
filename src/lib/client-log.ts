export async function logEvent(
  userId: number,
  action: string,
  type?: string,
  meta?: object,
  ip?: string
) {
  console.log("Logging event:", { userId, action, type, meta, ip });
  try {
    await fetch("/api/log-activity", {
      method: "POST",
        headers: { SAKUMPOA: process.env.NEXT_PUBLIC_API_KEY || "" },
      body: JSON.stringify({ userId, action, type, meta, ip }),
    });
  } catch (err) {
    console.error("Failed to log event:", err);
  }
}
