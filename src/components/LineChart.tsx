'use client';

import React from "react";
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
import annotationPlugin from "chartjs-plugin-annotation";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

interface LineChartProps {
  labels: string[];
  dataPoints: number[];
  limitMin: number;
  limitMax: number;
}

export default function LineChart({
  labels,
  dataPoints,
  limitMin,
  limitMax,
}: LineChartProps) {
  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Data",
        data: dataPoints,
        fill: false,
        borderColor: "rgb(59 130 246)", // blue-500
        backgroundColor: "rgb(59 130 246)",
        tension: 0, // <--- ไม่ให้เส้นโค้ง
        pointRadius: 4,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white", // <--- ตัวหนังสือใน legend
        },
      },
      title: {
        display: true,
        text: "Line Chart with Thresholds",
        font: { size: 18 },
        color: "white", // <--- ตัวหนังสือใน title
      },
      annotation: {
        annotations: {
          limitMaxLine: {
            type: "line",
            yMin: limitMax,
            yMax: limitMax,
            borderColor: "red",
            borderWidth: 2,
            borderDash: [6, 6],
            label: {
              content: `Limit High (${limitMax})`,
              position: "end",
              backgroundColor: "rgba(255,0,0,0.8)",
              color: "white",
              font: { size: 12, weight: "bold" },
              padding: 6,
            },
          },
          limitMinLine: {
            type: "line",
            yMin: limitMin,
            yMax: limitMin,
            borderColor: "yellow",
            borderWidth: 2,
            borderDash: [6, 6],
            label: {
              content: `Limit Low (${limitMin})`,
              position: "start",
              backgroundColor: "rgba(0,128,0,0.8)",
              color: "white",
              font: { size: 12, weight: "bold" },
              padding: 6,
            },
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white", // <--- แกน X
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
      y: {
        beginAtZero: false,
        ticks: {
          color: "white", // <--- แกน Y
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
    },
  };

  return (
    <div className="w-full h-64 md:h-100 bg-gradient-to-b from-sky-800 to-sky-900 rounded-sm">
      <Line data={data} options={options} />
    </div>
  );
}
