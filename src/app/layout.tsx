//layouts.tsx
import "./globals.css";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { cookies, headers } from "next/headers";

export const metadata = {
  title: "EVISION MONITORING SYSTEM DEMO",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const headerList = await headers();
  const pathname = headerList.get("next-url") || "";
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "127.0.0.1";

  if (token) {
    try {
      const decoded = Buffer.from(token, "base64").toString("utf-8");
      const [idStr] = decoded.split(":");
      const userId = Number(idStr);

      if (!Number.isNaN(userId) && pathname) {
        await prisma.userLog.create({
          data: {
            action: pathname,
            ip,
            user: { connect: { id: userId } },
          },
        });
      }
    } catch (err) {
      console.error("Insert log failed:", err);
    }
  }

  return (
    <html lang="en">
      <body className="h-screen bg-[#f5f0e9]">
        <Navbar />
        <main className="p-4">{children}</main>
        <Toaster position="top-left" />
      </body>
    </html>
  );
}
