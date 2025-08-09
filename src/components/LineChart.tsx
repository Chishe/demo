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
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
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

  if (logs.length === 0) {
    return <div className="text-white p-4">No log data available</div>;
  }

  const labels = logs.map((log) => log.startTime);
  const ctValues = logs.map((log) => Number(log.ct));
  const standardValues = logs.map((log) => Number(log.standard));
  const minLimitLineData = logs.map((log) => Number(log.limitLow));
  const maxLimitLineData = logs.map((log) => Number(log.limitHigh));

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
        borderColor: "orange",
        backgroundColor: "orange",
        pointBackgroundColor: pointBackgroundColors,
        tension: 0,
        pointRadius: 6,
        datalabels: {
          display: true,
          align: "top",
          anchor: "end",
          color: "white",
          font: {
            weight: "bold",
          },
          formatter: (value: number, context) => {
            const index = context.dataIndex;
            const log = logs[index];
            if (!log) return value.toFixed(2);
            const label = log.partNumber.split("-").slice(0, 2).join("-");
            return `${label}: ${value.toFixed(2)}`;
          },
        },
      },
      {
        label: "Standard",
        data: standardValues,
        fill: false,
        borderColor: "#52C755",
        borderWidth: 4,
        borderDash: [6, 6],
        pointRadius: 0,
        datalabels: { display: false },
      },
      {
        label: "Min Limit",
        data: minLimitLineData,
        fill: false,
        borderColor: "yellow",
        borderWidth: 4,
        borderDash: [6, 6],
        pointRadius: 0,
        datalabels: { display: false },
      },
      {
        label: "Max Limit",
        data: maxLimitLineData,
        fill: false,
        borderColor: "red",
        borderWidth: 4,
        borderDash: [6, 6],
        pointRadius: 0,
        datalabels: { display: false },
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
      <div className="w-full h-64 md:h-100 bg-gradient-to-b from-blue-950 to-[#20a7db] rounded-sm p-2">
        <Line data={data} options={options} />
      </div>

      {modalOpen && selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            className="bg-sky-900 rounded-md shadow-lg max-w-xl w-full p-4 relative         
            transform transition-all duration-300 ease-out
            opacity-0 scale-100 animate-[popIn_0.3s_ease-out_forwards]"
          >
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

            {/* <video
              controls
              className="w-full rounded-md"
              src={`/videos/${selectedLog.partNumber}.mp4`}
              onError={(e) => {
                (e.target as HTMLVideoElement).poster =
                  "https://via.placeholder.com/400x225?text=Video+not+found";
              }}
            >
              Your browser does not support the video tag.
            </video> */}
            <iframe
              className="w-full h-64 md:h-96 rounded-md"
              src={`https://www.youtube.com/embed/2Z0aWl_GIT0`}
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}
