"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader";
import { Notebook } from "lucide-react";
const ThresholdModal = dynamic(() => import("@/components/ThresholdModal"), {
  loading: () => <Loader />,
});
const LineChart = dynamic(() => import("@/components/LineChart"), {
  loading: () => <Loader />,
});
const PartTable = dynamic(() => import("@/components/PartTable"), {
  loading: () => <Loader />,
});

export default function Home() {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full h-[96vh] p-4 box-border pt-20">
      <div className="grid grid-cols-5 grid-rows-7 gap-4 w-full h-full">
        <div className="border-2 border-sky-600 col-span-1 row-span-2 shadow-lg p-2 text-black font-bold flex items-center justify-center rounded-sm">
          <button
            onClick={() => setOpen(true)}
            className="bg-green-600 px-4 py-2 rounded text-white"
          >
          <div className="flex"><Notebook /> SETTING THRESHOLD</div>
          </button>

          <ThresholdModal isOpen={open} onClose={() => setOpen(false)} />
        </div>
        <div className="border-2 border-sky-600 row-span-5 col-start-1 row-start-3 shadow-lg p-6 text-black font-bold flex items-center justify-center rounded-sm"></div>
        <div className="border-2 border-sky-600 col-span-5 row-span-4 col-start-2 row-start-1 shadow-lg p-2 text-black font-bold flex items-center justify-center rounded-sm">
          <LineChart />
        </div>
        <div className="border-2 border-sky-600 col-span-5 row-span-3 col-start-2 row-start-5 shadow-lg p-2 text-black font-bold flex items-center justify-center rounded-sm">
          <PartTable />
        </div>
      </div>
    </div>
  );
}
