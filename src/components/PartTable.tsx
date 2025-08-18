"use client";

import React, { useEffect, useState } from "react";
import { PackageOpen, CirclePlay, Notebook } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ThresholdModal from "@/components/ThresholdModal";
import { RiFileExcel2Line } from "react-icons/ri";
import { FaRegFilePdf } from "react-icons/fa6";
import { MdOutlineDataThresholding } from "react-icons/md";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { logEvent } from "@/lib/client-log";

type Log = {
  id: number;
  partNumber: string;
  startTime: string;
  endTime: string;
  ct: string;
  standard: string;
  limitHigh: number;
  limitLow: number;
  filename: string;
  created_at: string;
};
interface PartTableProps {
  userId: number;
  userIp: string;
}
export default function PartTable({ userId, userIp }: PartTableProps) {
  const [data, setData] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [open, setOpen] = useState(false);

useEffect(() => {
  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/log", {
        headers: { SAKUMPOA: process.env.NEXT_PUBLIC_API_KEY || "" },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data: Log[] = await res.json();
      setData(data);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchLogs();

  // If you want polling:
  // const interval = setInterval(fetchLogs, 1000);
  // return () => clearInterval(interval);
}, []);


  const getTimestamp = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    return `${yyyy}${mm}${dd}_${hh}${min}${ss}`;
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Logs");
    XLSX.writeFile(workbook, `RAW_DATA_${getTimestamp()}.xlsx`);
  };

  const exportPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();
    doc.text(`RAW DATA: ${new Date().toLocaleString()}`, 14, 10);

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

    doc.save(`RAW_DATA_${getTimestamp()}.pdf`);
  };

  return (
    <div className="overflow-x-auto custom-scrollbar rounded-lg shadow-md w-full h-full bg-[#000053]">
      <div className="flex gap-2 p-2 bg-[#000053]">
        <button
          onClick={() => {
            exportExcel();
            logEvent(
              userId,
              "export_excel",
              "click",
              { rowCount: data.length },
              userIp
            );
          }}
          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          <RiFileExcel2Line className="w-8 h-8" />
        </button>
        <button
          onClick={async () => {
            await exportPDF();
            logEvent(
              userId,
              "export_pdf",
              "click",
              { rowCount: data.length },
              userIp
            );
          }}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          <FaRegFilePdf className="w-8 h-8" />
        </button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  if (userId === 1 || userId === 2 || userId === 3) {
                    setOpen(true);
                    logEvent(
                      userId,
                      "threshold_modal_open",
                      "click",
                      {},
                      userIp
                    );
                  }
                }}
                className={`px-3 py-1 rounded ${
                  userId === 1 || userId === 2 || userId === 3
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-300 text-white opacity-50 cursor-not-allowed"
                }`}
              >
                <MdOutlineDataThresholding className="w-8 h-8" />
              </button>
            </TooltipTrigger>
            {userId === 4 && (
              <TooltipContent>
                ต้องใช้บัญชีที่มีสิทธิ์ MANAGER หรือ EXECUTIVE ขึ้นไป
              </TooltipContent>
            )}
          </Tooltip>

          {/* Modal */}
          <ThresholdModal
            isOpen={open}
            onClose={() => setOpen(false)}
            userId={userId}
            userIp={userIp}
          />
        </TooltipProvider>
      </div>

      <table className="min-w-full table-auto border border-[#000053] text-sm text-black bg-white ">
        <thead className="bg-[#000053] text-xs uppercase sticky top-0 z-10 text-white">
          <tr>
            <th className="px-4 py-2 border border-[#1c1c84] text-center">
              No
            </th>
            <th className="px-4 py-2 border border-[#1c1c84] text-center">
              Part Number
            </th>
            <th className="px-4 py-2 border border-[#1c1c84] text-center">
              Start Time
            </th>
            <th className="px-4 py-2 border border-[#1c1c84] text-center">
              End Time
            </th>
            <th className="px-4 py-2 border border-[#1c1c84] text-center">
              CT (sec)
            </th>
            <th className="px-4 py-2 border border-[#1c1c84] text-center">
              Standard
            </th>
            <th className="px-4 py-2 border border-[#1c1c84] text-center">
              Limit High
            </th>
            <th className="px-4 py-2 border border-[#1c1c84] text-center">
              Limit Low
            </th>
            <th className="px-4 py-2 border border-[#1c1c84] text-center">
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
              <td
                colSpan={9}
                className="py-20 text-center bg-gray-300 w-full h-full"
              >
                <div className="flex flex-col items-center justify-center gap-2 ">
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
                    {item.startTime
                      ? new Date(item.startTime).toLocaleTimeString("en-GB")
                      : ""}
                  </td>
                  <td className="px-4 py-2 border border-[#20a7db]">
                    {item.endTime
                      ? new Date(item.endTime).toLocaleTimeString("en-GB")
                      : ""}
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
                        logEvent(
                          userId,
                          "video_modal_open",
                          "click",
                          { partNumber: item.partNumber },
                          userIp
                        );
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
              onClick={() => {
                setModalOpen(false);
                logEvent(
                  userId,
                  "video_modal_close",
                  "click",
                  { partNumber: selectedLog.partNumber },
                  userIp
                );
              }}
              className="absolute top-2 right-2 text-white text-xl font-bold hover:text-red-500"
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
              src={`/videos/${selectedLog.filename}.mp4`}
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
