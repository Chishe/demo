"use client";

import React, { useEffect, useState } from "react";
import { PackageOpen, CirclePlay } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

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

  // ===== Excel Export =====
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Logs");
    XLSX.writeFile(workbook, "logs.xlsx");
  };

  const exportPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();
    doc.text("Logs", 14, 10);

    const tableColumn = [
      "No",
      "Part Number",
      "Start Time",
      "End Time",
      "CT (sec)",
      "Standard",
      "Limit High",
      "Limit Low",
    ];
    const tableRows = data.map((item, index) => [
      index + 1,
      item.partNumber,
      item.startTime,
      item.endTime,
      item.ct,
      item.standard,
      item.limitHigh,
      item.limitLow,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("logs.pdf");
  };

  return (
    <div className="overflow-x-auto custom-scrollbar rounded-lg shadow-md w-full h-full bg-sky-700">
      <div className="flex gap-2 p-2 bg-sky-800">
        <button
          onClick={exportExcel}
          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          Export Excel
        </button>
        <button
          onClick={exportPDF}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          Export PDF
        </button>
      </div>

      <table className="min-w-full table-auto border border-sky-700 text-sm text-black bg-white ">
        <thead className="bg-[#1c96c5] text-xs uppercase sticky top-0 z-10">
          <tr>
            <th className="px-4 py-2 border border-[#20a7db] text-center">
              No
            </th>
            <th className="px-4 py-2 border border-[#20a7db] text-center">
              Part Number
            </th>
            <th className="px-4 py-2 border border-[#20a7db] text-center">
              Start Time
            </th>
            <th className="px-4 py-2 border border-[#20a7db] text-center">
              End Time
            </th>
            <th className="px-4 py-2 border border-[#20a7db] text-center">
              CT (sec)
            </th>
            <th className="px-4 py-2 border border-[#20a7db] text-center">
              Standard
            </th>
            <th className="px-4 py-2 border border-[#20a7db] text-center">
              Limit High
            </th>
            <th className="px-4 py-2 border border-[#20a7db] text-center">
              Limit Low
            </th>
            <th className="px-4 py-2 border border-[#20a7db] text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={9} className="py-32 text-center">
                <div className="flex gap-4 justify-center items-center">
                  <div className="w-4 h-4 rounded-full animate-bounce bg-blue-500" />
                  <div className="w-4 h-4 rounded-full animate-bounce bg-blue-500 delay-100" />
                  <div className="w-4 h-4 rounded-full animate-bounce bg-blue-500 delay-200" />
                </div>
                <p className="text-sky-500 mt-2 text-sm">Loading data...</p>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-20 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
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
              if (ct < limitLow) rowColor = "bg-yellow-400 text-black";
              else if (ct > limitHigh) rowColor = "bg-red-400 text-white";

              return (
                <tr
                  key={item.id}
                  className={`hover:bg-[#62c1e5] ${rowColor} text-center`}
                >
                  <td className="px-4 py-2 border border-[#20a7db]">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 border border-[#20a7db]">
                    {item.partNumber}
                  </td>
                  <td className="px-4 py-2 border border-[#20a7db]">
                    {item.startTime}
                  </td>
                  <td className="px-4 py-2 border border-[#20a7db]">
                    {item.endTime}
                  </td>
                  <td className="px-4 py-2 border border-[#20a7db]">
                    {item.ct}
                  </td>
                  <td className="px-4 py-2 border border-[#20a7db]">
                    {item.standard}
                  </td>
                  <td className="px-4 py-2 border border-[#20a7db]">
                    {item.limitHigh}
                  </td>
                  <td className="px-4 py-2 border border-[#20a7db]">
                    {item.limitLow}
                  </td>
                  <td className="px-4 py-2 border border-[#20a7db] text-center">
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
          <div
            className="bg-sky-900 rounded-md shadow-lg max-w-xl w-full p-4 relative         
            transform transition-all duration-300 ease-out
            opacity-0 scale-100 animate-[popIn_0.3s_ease-out_forwards]"
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-white text-xl font-bold hover:text-red-500"
            >
              &times;
            </button>

            <h2 className="text-white text-lg font-semibold mb-4">
              Video for{" "}
              {selectedLog.partNumber.split("-").slice(0, 2).join("-")}
            </h2>

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
    </div>
  );
}
