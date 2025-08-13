"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { PackageOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";

interface Log {
  startTime: string;
  endTime: string;
  ct: string;
  standard: string;
}

const OeeCards = () => {
  const [log, setLog] = useState<Log | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalUnits, setTotalUnits] = useState<number>(10);
  const [defectUnits, setDefectUnits] = useState<number>(5);
  const [data, setData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/log")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setLog(res.data[0]);
        } else {
          setLog(null);
        }
      })
      .catch(() => {
        setLog(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

useEffect(() => {
  if (!log) return;

  const parseTime = (timeStr: string) => {
    const timePart = timeStr.split(" ")[1];
    if (!timePart) return 0;
    const [h, m, s] = timePart.split(":").map(Number);
    return h * 3600 + m * 60 + (s || 0);
  };

  const scheduled_time_seconds = parseTime(log.endTime) - parseTime(log.startTime);
  const operating_time_seconds = scheduled_time_seconds > 0 ? scheduled_time_seconds : 0;

  const scheduled_time = operating_time_seconds / 60;
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

  console.log("scheduled_time (min):", scheduled_time);
  console.log("operating_time (min):", operating_time);
  console.log("actual_speed (ct):", actual_speed);
  console.log("design_speed (standard):", design_speed);
  console.log("availability:", availability);
  console.log("performance:", performance);
  console.log("quality:", quality);
  console.log("OEE:", oee);

  setData([availability, performance, quality, oee]);
  setLabels(["Availability", "Performance", "Quality", "OEE"]);
}, [log, totalUnits, defectUnits]);


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full mt-20">
        <div className="flex gap-4 justify-center items-center">
          <div className="w-4 h-4 rounded-full animate-bounce bg-blue-500" />
          <div className="w-4 h-4 rounded-full animate-bounce bg-blue-500 delay-100" />
          <div className="w-4 h-4 rounded-full animate-bounce bg-blue-500 delay-200" />
        </div>
        <p className="text-sky-500 mt-2 text-sm">Loading data...</p>
      </div>
    );
  }

  if (!log)
    return (
      <div className="flex flex-col items-center justify-center gap-2 bg-gray-300 w-full h-full">
        <PackageOpen className="w-12 h-12 text-sky-500" />
        <span className="text-sky-400">No data available</span>
      </div>
    );

  const colors = [
    ["#22c55e", "#16a34a"],
    ["#3b82f6", "#2563eb"],
    ["#f59e0b", "#d97706"],
    ["#ef4444", "#b91c1c"],
  ];

  return (
    <div className="w-full h-full p-4 bg-gradient-to-b from-blue-950 to-[#20a7db] rounded-md shadow-lg border-2 border-amber-50">
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

      <div className="flex flex-col gap-6">
        {labels.map((label, i) => {
          const value = data[i] ?? 0;
          return (
            <Card
              key={label}
              className="p-4 h-20 text-white"
              style={{
                backgroundImage: `linear-gradient(to bottom, ${colors[i][0]}, ${colors[i][1]})`,
              }}
            >
              <CardHeader>
                <h3 className="text-white text-lg text-center font-semibold">
                  {label}
                </h3>
              </CardHeader>
              <CardContent>
                <div className="w-full mt-[-10] h-6 bg-gray-100 bg-opacity-30 rounded-full border border-white overflow-hidden relative">
                  <div
                    className="h-6 rounded-full transition-all duration-500 ease-in-out flex items-center justify-center text-white font-bold select-none"
                    style={{
                      width: `${Math.min(value, 100)}%`,
                      backgroundImage: `linear-gradient(to bottom, ${colors[i][0]}, ${colors[i][1]})`,
                      borderRadius: "inherit",
                    }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-black font-semibold pointer-events-none">
                      {value.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default OeeCards;
