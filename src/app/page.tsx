// src/app/page.tsx (Server Component)
import InputForm from "@/components/InputForm";
import LineChart from "@/components/LineChart";
import OeeDoughnutCharts from "@/components/OeeDoughnutCharts";
import PartTable from "@/components/PartTable";
import { cookies, headers } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const headerList = await headers();

  const pathname = headerList.get("next-url") || "";
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "127.0.0.1";

  let userId: number | undefined;
  if (token) {
    try {
      const decoded = Buffer.from(token, "base64").toString("utf-8");
      const parts = decoded.split(":");
      userId = Number(parts[0]);
    } catch (err) {
      console.error("Failed to decode token:", err);
    }
  }

  const safeUserId = typeof userId === "number" ? userId : 0;
  const safeUserIp = ip || "127.0.0.1";

  return (
    <div className="w-full h-[96vh] p-4 box-border pt-25">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:grid-rows-7 w-full h-full">
        <div className="border-2 border-[#1c1c84] row-span-2 md:row-span-2 shadow-lg p-2 text-black font-bold flex items-center justify-center rounded-sm">
          <InputForm userId={safeUserId} userIp={safeUserIp} />
        </div>

        <div className="border-2 border-[#1c1c84] row-span-5 col-start-1 row-start-3 md:row-span-5 md:col-start-1 md:row-start-3 p-2 text-black font-bold flex items-center justify-center rounded-sm">
          <OeeDoughnutCharts userId={safeUserId} userIp={safeUserIp} />
        </div>

        <div className="border-2 border-[#1c1c84] col-span-1 md:col-span-4 row-span-4 md:row-span-4 md:col-start-2 md:row-start-1 shadow-lg p-2 text-black font-bold flex items-center justify-center rounded-sm">
          <LineChart userId={safeUserId} userIp={safeUserIp} />
        </div>

        <div className="border-2 border-[#1c1c84] md:col-span-4 col-span-1 md:row-span-3 md:col-start-2 md:row-start-5 shadow-lg p-2 text-black font-bold flex items-center justify-center rounded-sm">
          <PartTable userId={safeUserId} userIp={safeUserIp} />
        </div>
      </div>
    </div>
  );
}
