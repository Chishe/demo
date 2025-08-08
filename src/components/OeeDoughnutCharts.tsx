"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import type { ApexOptions } from "apexcharts";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Log {
  startTime: string;
  endTime: string;
  ct: string;
  standard: string;
}

const OeeDoughnutCharts = () => {
  const [log, setLog] = useState<Log | null>(null);
  const [totalUnits, setTotalUnits] = useState<number>(10);
  const [defectUnits, setDefectUnits] = useState<number>(5);

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

  const chartOptions: ApexOptions = {
    chart: {
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "60%",
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: "16px",
            fontWeight: "600",
            color: "#334155", // slate-700
          },
          value: {
            fontSize: "14px",
            fontWeight: "500",
            color: "#475569", // slate-600
            formatter: function (val) {
              return parseFloat(val.toFixed(1)) + "%";
            },
          },
        },
      },
    },
    colors: ["#22c55e", "#facc15", "#ef4444", "#7c3aed"], // green, yellow, red, purple
  };

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

  return (
    <div className="w-full h-full py-auto">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="mb-10 flex flex-col sm:flex-row sm:justify-center gap-4"
      >
        <div className="w-full max-w-xs relative">
          <input
            type="number"
            step="1"
            min={0}
            value={totalUnits}
            onChange={(e) =>
              setTotalUnits(Math.max(0, Number(e.target.value) || 0))
            }
            id="totalUnits"
            className="peer block w-full rounded-md border border-slate-300 bg-white px-3 pt-4 pb-2 text-sm text-slate-900 placeholder-transparent focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Units Produced"
          />
          <label
            htmlFor="totalUnits"
            className="absolute left-3 top-2 text-xs text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600"
          >
            Units Produced
          </label>
        </div>

        <div className="w-full  h-full max-w-xs relative">
          <input
            type="number"
            step="1"
            min={0}
            max={totalUnits}
            value={defectUnits}
            onChange={(e) => {
              let val = Number(e.target.value) || 0;
              if (val > totalUnits) val = totalUnits;
              setDefectUnits(val);
            }}
            id="defectUnits"
            className="peer block w-full rounded-md border border-slate-300 bg-white px-3 pt-4 pb-2 text-sm text-slate-900 placeholder-transparent focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Defective Units"
          />
          <label
            htmlFor="defectUnits"
            className="absolute left-3 top-2 text-xs text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600"
          >
            Defective Units
          </label>
        </div>
      </form>

      {/* Charts */}
      <div>
        {data.map((value, index) => (
          <div
            key={index}
            className="h-full w-full rounded-lg shadow-md flex flex-col items-center border-2 border-[#20a7db]"
          >
            <ApexChart
              type="radialBar"
              series={[value]}
              options={{
                ...chartOptions,
                labels: [labels[index]],
                colors: [chartOptions.colors?.[index] || "#000"],
              }}
              height="100%"
              width="100%"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OeeDoughnutCharts;
