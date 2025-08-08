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
const OeeDoughnutCharts = dynamic(
  () => import("@/components/OeeDoughnutCharts"),
  {
    loading: () => <Loader />,
  }
);

const PartTable = dynamic(() => import("@/components/PartTable"), {
  loading: () => <Loader />,
});

export default function Home() {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full h-[96vh] p-4 box-border pt-20">
      <div className="grid grid-cols-5 grid-rows-7 gap-4 w-full h-full">
        <div className="border-2 border-[#20a7db] row-span-7 shadow-lg p-6 text-black font-bold flex items-center justify-center rounded-sm">
          <OeeDoughnutCharts />
        </div>
        <div className="border-2 border-[#20a7db] col-span-5 row-span-4 col-start-2 row-start-1 shadow-lg p-2 text-black font-bold flex items-center justify-center rounded-sm">
          <div className="flex flex-col items-center justify-center w-full h-full gap-1">
            <div className="w-full flex justify-end hazard-background rounded-md text-center font-bold">
              <button
                onClick={() => setOpen(true)}
                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
              >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#1c96c5] rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                  <div className="flex">
                    <Notebook /> SETTING THRESHOLD
                  </div>
                </span>
              </button>
              <ThresholdModal isOpen={open} onClose={() => setOpen(false)} />
            </div>
            <LineChart />
          </div>
        </div>
        <div className="border-2 border-[#20a7db] col-span-5 row-span-3 col-start-2 row-start-5 shadow-lg p-2 text-black font-bold flex items-center justify-center rounded-sm">
          <PartTable />
        </div>
      </div>
    </div>
  );
}
