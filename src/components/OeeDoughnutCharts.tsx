"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { logEvent } from "@/lib/client-log";

interface Log {
  partNumber: string;
  startTime: string;
  endTime: string;
  ct: string;
  standard: string;
}

interface OeeCardsProps {
  userId: number;
  userIp: string;
}

const OeeCards = ({ userId, userIp }: OeeCardsProps) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [planUnits, setPlanUnits] = useState<number>(0);
  const [defectUnits, setDefectUnits] = useState<number>(0);
  const [data, setData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  const totalUnits = logs.length;

  useEffect(() => {
    const fetchLogs = () => {
      setLoading(true);
      axios
        .get("/api/log")
        .then((res) => setLogs(res.data || []))
        .catch(() => setLogs([]))
        .finally(() => setLoading(false));
    };
    fetchLogs();
  }, []);

  useEffect(() => {
    if (!logs || logs.length === 0 || planUnits === 0) return;

    const totalUnitsProduced = logs.length;
    const avgCT =
      logs.reduce((sum, log) => sum + Number(log.ct || 0), 0) / logs.length;

    const plannedTime = planUnits * avgCT;
    const actualTime = totalUnitsProduced * avgCT;
    const performance = plannedTime > 0 ? (actualTime / plannedTime) * 100 : 0;

    const quality =
      totalUnitsProduced > 0
        ? ((totalUnitsProduced - defectUnits) / totalUnitsProduced) * 100
        : 0;

    const availability = 100;
    const oee = (availability * performance * quality) / 10000;

    setData([availability, performance, quality, oee]);
    setLabels(["Availability", "Performance", "Quality", "OEE"]);
  }, [logs.length, defectUnits, planUnits]);

  const colors = [
    ["#22c55e", "#16a34a"],
    ["#3b82f6", "#2563eb"],
    ["#f59e0b", "#d97706"],
    ["#ef4444", "#b91c1c"],
  ];

  return (
    <div className="w-full h-full p-4 bg-[#000053] rounded-md shadow-lg border-2 border-amber-50">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="pt-4 px-2 mb-5 flex flex-col sm:flex-row sm:justify-center gap-4"
      >
        <div className="w-full relative">
          <input
            type="number"
            min={0}
            value={planUnits}
            onChange={(e) => {
              const value = Number(e.target.value) || 0;
              setPlanUnits(value);
              logEvent(userId, "plan_units_change", "input", { value }, userIp);
            }}
            className="peer block w-full rounded-md border px-2 pt-4 pb-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Plan Units"
          />
          <label className="absolute left-3 top-2 text-xs text-slate-500">
            Plan Units
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
              logEvent(
                userId,
                "defect_units_change",
                "input",
                {
                  value: val,
                },
                userIp
              );
            }}
            className="peer block w-full rounded-md border px-2 pt-4 pb-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
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
