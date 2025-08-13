"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader";

const InputForm = dynamic(() => import("@/components/InputForm"), {
  loading: () => <Loader />,
});
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
  return (
    <div className="w-full h-[96vh] p-4 box-border pt-25">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:grid-rows-7 w-full h-full">
        <div className="border-2 border-[#1c1c84] row-span-2 md:row-span-2 shadow-lg p-2 text-black font-bold flex items-center justify-center rounded-sm">
          <InputForm />
        </div>
        <div className="border-2 border-[#1c1c84] row-span-5 col-start-1 row-start-3 md:row-span-5 md:col-start-1 md:row-start-3 p-2 text-black font-bold flex items-center justify-center rounded-sm">
          <OeeDoughnutCharts />
        </div>
        <div className="border-2 border-[#1c1c84] col-span-1 md:col-span-4 row-span-4 md:row-span-4 md:col-start-2 md:row-start-1 shadow-lg p-2 text-black font-bold flex items-center justify-center rounded-sm">
          <div className="flex flex-col items-center justify-center w-full h-full gap-1">
            <LineChart />
          </div>
        </div>
        <div className="border-2 border-[#1c1c84] md:col-span-4 col-span-1 md:col-span-4 row-span-3 md:row-span-3 md:col-start-2 md:row-start-5 shadow-lg p-2 text-black font-bold flex items-center justify-center rounded-sm">
          <PartTable />
        </div>
      </div>
    </div>
  );
}
