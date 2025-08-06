"use client";

import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Log = {
  id: number;
  partNumber: string;
  startTime: string;
  endTime: string;
  ct: string;
  standard: string;
  limitHigh: number;
  limitLow: number;
  created_at: string;
};

export default function LineChart() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);

  useEffect(() => {
    fetch("/api/log")
      .then((res) => res.json())
      .then((data: Log[]) => {
        setLogs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch logs:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4 text-white">
        <svg
          className="animate-spin h-8 w-8 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        <span className="ml-2">Loading chart...</span>
      </div>
    );
  }

  if (logs.length === 0) {
    return <div className="text-white p-4">No log data available</div>;
  }

  const labels = logs.map((log) =>
    log.partNumber.split("-").slice(0, 2).join("-")
  );

  const ctValues = logs.map((log) => Number(log.ct));
  const standardValues = logs.map((log) => Number(log.standard));

  const limitsByLabel: Record<
    string,
    { limitLows: number[]; limitHighs: number[] }
  > = {};

  logs.forEach((log) => {
    const label = log.partNumber.split("-").slice(0, 2).join("-");
    if (!limitsByLabel[label]) {
      limitsByLabel[label] = { limitLows: [], limitHighs: [] };
    }
    limitsByLabel[label].limitLows.push(log.limitLow);
    limitsByLabel[label].limitHighs.push(log.limitHigh);
  });

  const minMaxByLabel: Record<
    string,
    { minLimitLow: number; maxLimitHigh: number }
  > = {};

  for (const label in limitsByLabel) {
    minMaxByLabel[label] = {
      minLimitLow: Math.min(...limitsByLabel[label].limitLows),
      maxLimitHigh: Math.max(...limitsByLabel[label].limitHighs),
    };
  }

  const minLimitLineData = labels.map((label) =>
    minMaxByLabel[label] ? minMaxByLabel[label].minLimitLow : null
  );
  const maxLimitLineData = labels.map((label) =>
    minMaxByLabel[label] ? minMaxByLabel[label].maxLimitHigh : null
  );

  const pointBackgroundColors = logs.map((log) => {
    const ct = Number(log.ct);
    if (ct < log.limitLow) return "yellow";
    if (ct > log.limitHigh) return "red";
    return "rgb(59 130 246)";
  });

  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "CT",
        data: ctValues,
        fill: false,
        borderColor: "rgb(255, 255, 255)",
        backgroundColor: "rgb(255, 255, 255)",
        pointBackgroundColor: pointBackgroundColors,
        tension: 0,
        pointRadius: 6,
      },
      {
        label: "Standard",
        data: standardValues,
        fill: false,
        borderColor: "green",
        borderWidth: 2,
        borderDash: [6, 6],
        pointRadius: 0,
      },
      {
        label: "Min Limit",
        data: minLimitLineData,
        fill: false,
        borderColor: "yellow",
        borderWidth: 2,
        borderDash: [6, 6],
        pointRadius: 0,
      },
      {
        label: "Max Limit",
        data: maxLimitLineData,
        fill: false,
        borderColor: "red",
        borderWidth: 2,
        borderDash: [6, 6],
        pointRadius: 0,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "white" },
      },
      title: {
        display: true,
        text: "CT Line Chart with Min/Max Limits",
        font: { size: 18 },
        color: "white",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: { color: "white" },
        grid: { color: "rgba(255, 255, 255, 0.2)" },
      },
      y: {
        beginAtZero: false,
        ticks: { color: "white" },
        grid: { color: "rgba(255, 255, 255, 0.2)" },
      },
    },
    onClick: (event, elements) => {
      if (!elements.length) return;
      const elementIndex = elements[0].index;
      setSelectedLog(logs[elementIndex]);
      setModalOpen(true);
    },
  };

  return (
    <>
      <div className="w-full h-64 md:h-100 bg-gradient-to-b from-sky-800 to-sky-900 rounded-sm p-2">
        <Line data={data} options={options} />
      </div>

      {modalOpen && selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-md">
          <div className="bg-sky-900 rounded-md shadow-lg max-w-xl w-full p-4 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-white text-xl font-bold hover:text-red-500"
              aria-label="Close modal"
            >
              &times;
            </button>

            <h2 className="text-white text-lg font-semibold mb-4">
              Video for{" "}
              {selectedLog.partNumber.split("-").slice(0, 2).join("-")}
            </h2>

            <video
              controls
              className="w-full rounded-md"
              src={`/videos/${selectedLog.partNumber}.mp4`}
              onError={(e) => {
                (e.target as HTMLVideoElement).poster =
                  "https://via.placeholder.com/400x225?text=Video+not+found";
              }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </>
  );
}
