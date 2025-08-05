"use client";

import React from "react";
import { PackageOpen ,} from "lucide-react";

export default function PartTable() {
  const data: any[] = [];

  return (
    <div className="overflow-x-auto rounded-lg shadow-md w-full h-full bg-sky-800">
      <table className="min-w-full table-auto border border-sky-700 text-sm text-white bg-sky-800 ">
        <thead className="bg-sky-700 text-xs uppercase ">
          <tr>
            <th className="px-4 py-2 border border-sky-600 text-center ">No</th>
            <th className="px-4 py-2 border border-sky-600 text-center">
              Part Number
            </th>
            <th className="px-4 py-2 border border-sky-600 text-center">
              Start Time
            </th>
            <th className="px-4 py-2 border border-sky-600 text-center">
              End Time
            </th>
            <th className="px-4 py-2 border border-sky-600 text-center">
              CT (sec)
            </th>
            <th className="px-4 py-2 border border-sky-600 text-center">
              Standard
            </th>
            <th className="px-4 py-2 border border-sky-600 text-center">
              Limit high
            </th>
            <th className="px-4 py-2 border border-sky-600 text-center">
              Limit low
            </th>
            <th className="px-4 py-2 border border-sky-600 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-auto px-auto text-center">
                <div className="flex flex-col items-center justify-center gap-2 h-full p-20.5">
                  <PackageOpen className="w-12 h-12 text-sky-500" />
                  <span className="text-sky-400">No data available</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={index} className="hover:bg-sky-700">
                <td className="px-4 py-2 border border-sky-600">
                  {index + 1}
                </td>
                <td className="px-4 py-2 border border-sky-600">
                  {item.partNumber}
                </td>
                <td className="px-4 py-2 border border-sky-600">
                  {item.startTime}
                </td>
                <td className="px-4 py-2 border border-sky-600">
                  {item.endTime}
                </td>
                <td className="px-4 py-2 border border-sky-600">{item.ct}</td>
                <td className="px-4 py-2 border border-sky-600">
                  {item.standard}
                </td>
                <td className="px-4 py-2 border border-sky-600">
                  {item.limitHigh}
                </td>
                <td className="px-4 py-2 border border-sky-600">
                  {item.limitLow}
                </td>
                <td className="px-4 py-2 border border-sky-600">
                  <button className="px-2 py-1 text-xs bg-sky-600 hover:bg-sky-700 rounded">
                    Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
