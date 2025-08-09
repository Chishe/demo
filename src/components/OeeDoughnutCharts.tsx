"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import ThresholdModal from "@/components/ThresholdModal";
import { Notebook, TrendingUp } from "lucide-react";
import { LabelList, RadialBar, RadialBarChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Log {
  startTime: string;
  endTime: string;
  ct: string;
  standard: string;
}

const OeeRadialCharts = () => {
  const [log, setLog] = useState<Log | null>(null);
  const [totalUnits, setTotalUnits] = useState<number>(10);
  const [defectUnits, setDefectUnits] = useState<number>(5);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    axios.get("/api/log").then((res) => {
      if (res.data && res.data.length > 0) {
        setLog(res.data[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (!log) return;

    const parseTime = (timeStr: string) => {
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };

    const scheduled_time = parseTime(log.endTime) - parseTime(log.startTime);
    const operating_time = scheduled_time;
    const actual_speed = Number(log.ct);
    const design_speed = Number(log.standard);

    const availability =
      scheduled_time > 0 ? (operating_time / scheduled_time) * 100 : 0;
    const performance =
      design_speed > 0 ? (actual_speed / design_speed) * 100 : 0;
    const quality =
      totalUnits > 0 ? ((totalUnits - defectUnits) / totalUnits) * 100 : 0;
    const oee = (availability * performance * quality) / 10000;

    setData([availability, performance, quality, oee]);
    setLabels(["Availability", "Performance", "Quality", "OEE"]);
  }, [log, totalUnits, defectUnits]);

  if (!log)
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex gap-4 justify-center items-center mt-20">
          <div className="w-4 h-4 rounded-full animate-bounce bg-blue-500" />
          <div className="w-4 h-4 rounded-full animate-bounce bg-blue-500 delay-100" />
          <div className="w-4 h-4 rounded-full animate-bounce bg-blue-500 delay-200" />
        </div>
        <p className="text-sky-500 mt-2 text-sm">Loading data...</p>
      </div>
    );

  // แปลง data และ labels เป็น chartData
  const chartData = labels.map((label, i) => ({
    name: label,
    value: Number(data[i]?.toFixed(1)) || 0,
    fill: `var(--chart-${i + 1})`,
  }));

  const chartConfig: ChartConfig = labels.reduce((acc, label, i) => {
    acc[label.toLowerCase()] = {
      label,
      color: `var(--chart-${i + 1})`,
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <div className="w-full h-full p-4 bg-sky-100 rounded-md shadow-lg border-2 border-amber-50">
      {/* ปุ่ม Threshold */}
      <div className="w-full pt-2 hazard-background flex justify-center rounded-md text-center font-bold mb-4">
        <button
          onClick={() => setOpen(true)}
          className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden 
          text-sm font-medium rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 hover:text-white focus:ring-4 focus:outline-none"
        >
          <span className="relative px-5 py-2.5 bg-white rounded-md group-hover:bg-transparent">
            <div className="flex text-black">
              <Notebook className="pb-1" /> SETTING THRESHOLD
            </div>
          </span>
        </button>
        <ThresholdModal isOpen={open} onClose={() => setOpen(false)} />
      </div>

      {/* Form input */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="pt-4 px-2 mb-5 flex flex-col sm:flex-row sm:justify-center gap-4"
      >
        <div className="w-full relative">
          <input
            type="number"
            min={0}
            value={totalUnits}
            onChange={(e) =>
              setTotalUnits(Math.max(0, Number(e.target.value) || 0))
            }
            className="peer block w-full rounded-md border px-2 pt-4 pb-2 text-sm bg-white"
            placeholder="Units Produced"
          />
          <label className="absolute left-3 top-2 text-xs text-slate-500">
            Units Produced
          </label>
        </div>

        <div className="w-full relative">
          <input
            type="number"
            min={0}
            max={totalUnits}
            value={defectUnits}
            onChange={(e) => {
              let val = Number(e.target.value) || 0;
              if (val > totalUnits) val = totalUnits;
              setDefectUnits(val);
            }}
            className="peer block w-full rounded-md border px-2 pt-4 pb-2 text-sm bg-white"
            placeholder="Defective Units"
          />
          <label className="absolute left-3 top-2 text-xs text-slate-500">
            Defective Units
          </label>
        </div>
      </form>

      {/* Radial Chart */}
      <Card className="flex flex-col h-[60vh]">
        <CardHeader className="items-center pb-0">
          <CardTitle>OEE Metrics</CardTitle>
          <CardDescription>Calculated from production data</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <RadialBarChart
              data={chartData}
              startAngle={-90}
              endAngle={380}
              innerRadius={30}
              outerRadius={110}
            >
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent hideLabel nameKey="name" />
                }
              />
              <RadialBar dataKey="value" background>
                <LabelList
                  position="insideStart"
                  dataKey="name"
                  className="fill-white capitalize mix-blend-luminosity"
                  fontSize={11}
                />
              </RadialBar>
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          {/* <div className="flex items-center gap-2 leading-none font-medium">
            Trending up <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Showing current OEE breakdown
          </div> */}
        </CardFooter>
      </Card>
    </div>
  );
};

export default OeeRadialCharts;
