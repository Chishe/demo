"use client";

import React, { useEffect, useState } from "react";
import { PackageOpen, CirclePlay } from "lucide-react";

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

export default function PartTable() {
  const [data, setData] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);

  useEffect(() => {
    fetch("/api/log")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="overflow-x-auto custom-scrollbar rounded-lg shadow-md w-full h-full bg-sky-800">
      <table className="min-w-full table-auto border border-sky-700 text-sm text-black bg-white ">
        <thead className="bg-sky-700 text-xs uppercase sticky top-0 z-10">
          <tr>
            <th className="px-4 py-2 border border-sky-600 text-center">No</th>
            <th className="px-4 py-2 border border-sky-600 text-center">Part Number</th>
            <th className="px-4 py-2 border border-sky-600 text-center">Start Time</th>
            <th className="px-4 py-2 border border-sky-600 text-center">End Time</th>
            <th className="px-4 py-2 border border-sky-600 text-center">CT (sec)</th>
            <th className="px-4 py-2 border border-sky-600 text-center">Standard</th>
            <th className="px-4 py-2 border border-sky-600 text-center">Limit High</th>
            <th className="px-4 py-2 border border-sky-600 text-center">Limit Low</th>
            <th className="px-4 py-2 border border-sky-600 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={9} className="py-8 text-center text-sky-300">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-auto px-auto text-center">
                <div className="flex flex-col items-center justify-center gap-2 h-full p-20.5">
                  <PackageOpen className="w-12 h-12 text-sky-500" />
                  <span className="text-sky-400">No data available</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((item, index) => {
              const ct = Number(item.ct);
              const limitHigh = Number(item.limitHigh);
              const limitLow = Number(item.limitLow);

              let rowColor = "";

              if (ct < limitLow) {
                rowColor = "bg-yellow-400 text-black";
              } else if (ct > limitHigh) {
                rowColor = "bg-red-400 text-white";
              }

              return (
                <tr key={item.id} className={`hover:bg-sky-500 ${rowColor} text-center`}>
                  <td className="px-4 py-2 border border-sky-600">{index + 1}</td>
                  <td className="px-4 py-2 border border-sky-600">{item.partNumber}</td>
                  <td className="px-4 py-2 border border-sky-600">{item.startTime}</td>
                  <td className="px-4 py-2 border border-sky-600">{item.endTime}</td>
                  <td className="px-4 py-2 border border-sky-600">{item.ct}</td>
                  <td className="px-4 py-2 border border-sky-600">{item.standard}</td>
                  <td className="px-4 py-2 border border-sky-600">{item.limitHigh}</td>
                  <td className="px-4 py-2 border border-sky-600">{item.limitLow}</td>
                  <td className="px-4 py-2 border border-sky-600 text-center">
                    <button
                      className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded"
                      onClick={() => {
                        setSelectedLog(item);
                        setModalOpen(true);
                      }}
                    >
                      <CirclePlay />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {modalOpen && selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-sky-900 rounded-md shadow-lg max-w-xl w-full p-4 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-white text-xl font-bold hover:text-red-500"
              aria-label="Close modal"
            >
              &times;
            </button>

            <h2 className="text-white text-lg font-semibold mb-4">
              Video for {selectedLog.partNumber.split("-").slice(0, 2).join("-")}
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
    </div>
  );
}
