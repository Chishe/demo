"use client";

import React, { useEffect, useState, useRef } from "react";
import { FilePlus2, RotateCcw, FilePenLine, Trash } from "lucide-react";
import toast from "react-hot-toast";

type Threshold = {
  id: number;
  partNumber: string;
  standard: string;
  limitHigh: number;
  limitLow: number;
};

type Mode = "add" | "edit";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ThresholdModal({ isOpen, onClose }: Props) {
  const [thresholds, setThresholds] = useState<Threshold[]>([]);
  const [mode, setMode] = useState<Mode>("add");
  const [selected, setSelected] = useState<Threshold | null>(null);

  const [partNumber, setPartNumber] = useState("");
  const [standard, setStandard] = useState("");
  const [limitHigh, setLimitHigh] = useState<number | "">("");
  const [limitLow, setLimitLow] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Delete confirm modal state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Dropdown search filter ตาราง
  const [availablePartNumbers, setAvailablePartNumbers] = useState<string[]>(
    []
  );
  const [filterPartNumberSearch, setFilterPartNumberSearch] = useState("");
  const [filterPartNumberSelected, setFilterPartNumberSelected] = useState<
    string | null
  >(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchThresholds();
      resetForm();
      resetFilter();
    }
  }, [isOpen]);

  useEffect(() => {
    if (mode === "edit" && selected) {
      setPartNumber(selected.partNumber);
      setStandard(selected.standard);
      setLimitHigh(selected.limitHigh);
      setLimitLow(selected.limitLow);
      setError(null);
    }
  }, [mode, selected]);

  useEffect(() => {
    // ดึง partNumber จาก thresholds (ตัดซ้ำ)
    const parts = Array.from(new Set(thresholds.map((t) => t.partNumber)));
    setAvailablePartNumbers(parts);
  }, [thresholds]);

  // คลิกนอก filter dropdown เพื่อปิด
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setShowFilterDropdown(false);
      }
    }
    if (showFilterDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilterDropdown]);

  function resetForm() {
    setPartNumber("");
    setStandard("");
    setLimitHigh("");
    setLimitLow("");
    setSelected(null);
    setMode("add");
    setError(null);
    setLoading(false);
  }

  function resetFilter() {
    setFilterPartNumberSearch("");
    setFilterPartNumberSelected(null);
  }

  async function fetchThresholds() {
    try {
      const res = await fetch("/api/thresholds");
      if (res.ok) {
        const data = await res.json();
        setThresholds(data);
      }
    } catch {
      // silent fail
    }
  }

  // แปลง input ให้รับได้ทั้ง number หรือ "" (empty)
  function parseNumberInput(value: string): number | "" {
    return value === "" ? "" : Number(value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!partNumber.trim() || !standard.trim()) {
      setError("Part Number และ Standard ต้องไม่ว่าง");
      return;
    }
    if (limitHigh === "" || limitLow === "") {
      setError("กรุณากรอก Limit ให้ครบ");
      return;
    }
    if (typeof limitHigh !== "number" || typeof limitLow !== "number") {
      setError("Limit ต้องเป็นตัวเลข");
      return;
    }
    if (limitLow > limitHigh) {
      setError("Limit Low ไม่ควรสูงกว่า Limit High");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const body = { partNumber, standard, limitHigh, limitLow };
      let res: Response;

      if (mode === "add") {
        res = await fetch("/api/thresholds", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else if (mode === "edit" && selected?.id) {
        res = await fetch(`/api/thresholds/${selected.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        throw new Error("Invalid operation");
      }

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json?.error || "บันทึกข้อมูลล้มเหลว");
      }

      await fetchThresholds();
      resetForm();
      resetFilter();
      toast.success("บันทึกข้อมูลเรียบร้อยแล้ว");
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาด");
      toast.error(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    setShowDeleteConfirm(false);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/thresholds/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json?.error || "ลบข้อมูลล้มเหลว");
      }

      await fetchThresholds();
      resetForm();
      resetFilter();
      toast.success("ลบข้อมูลเรียบร้อยแล้ว");
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาด");
      toast.error(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  const handleClose = () => {
    resetForm();
    resetFilter();
    onClose();
  };

  // ฟังก์ชันเลือก filter partNumber
  function handleSelectFilterPartNumber(pn: string | null) {
    setFilterPartNumberSelected(pn);
    setFilterPartNumberSearch(pn || "");
    setShowFilterDropdown(false);
  }

  // กรอง partNumber dropdown ใน filter ตาม search
  const filteredFilterPartNumbers = availablePartNumbers.filter((pn) =>
    pn.toLowerCase().includes(filterPartNumberSearch.toLowerCase())
  );

  // กรอง thresholds ในตารางตาม filter
  const displayedThresholds =
    filterPartNumberSelected && filterPartNumberSelected.length > 0
      ? thresholds.filter((t) => t.partNumber === filterPartNumberSelected)
      : thresholds;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-start pt-20 z-50 overflow-auto"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          จัดการ Threshold
        </h2>
        <hr></hr>
        <br></br>
        {/* Dropdown Search Filter Part Number */}
        <div className="mb-4 w-124 relative" ref={filterDropdownRef}>
          <label className="block font-medium mb-1">
            ค้นหา Part Number (Filter ตาราง)
          </label>
          <div className="flex flex-col items-end">
            <input
              type="text"
              value={filterPartNumberSearch}
              onChange={(e) => {
                setFilterPartNumberSearch(e.target.value);
                setShowFilterDropdown(true);
              }}
              onFocus={() => setShowFilterDropdown(true)}
              placeholder="พิมพ์เพื่อค้นหา..."
              className="w-full border rounded px-3 py-2"
              autoComplete="off"
            />
          </div>
          {showFilterDropdown && filteredFilterPartNumbers.length > 0 && (
            <ul className="absolute z-10 w-full max-h-40 overflow-auto border border-gray-300 bg-white rounded shadow-md mt-1">
              <li
                className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSelectFilterPartNumber(null)}
              >
                แสดงทั้งหมด
              </li>
              {filteredFilterPartNumbers.map((pn) => (
                <li
                  key={pn}
                  className="px-3 py-2 cursor-pointer hover:bg-blue-600 hover:text-white"
                  onClick={() => handleSelectFilterPartNumber(pn)}
                >
                  {pn}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ตารางรายการ Thresholds */}
        <div className="overflow-x-auto custom-scrollbar max-h-64 mb-6 border rounded">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="border border-gray-300 px-3 py-2 text-left">
                  Part Number
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left">
                  Standard
                </th>
                <th className="border border-gray-300 px-3 py-2 text-right">
                  Limit High
                </th>
                <th className="border border-gray-300 px-3 py-2 text-right">
                  Limit Low
                </th>
                <th className="border border-gray-300 px-3 py-2 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedThresholds.map((t) => (
                <tr
                  key={t.id}
                  className={`cursor-pointer ${
                    selected?.id === t.id ? "bg-blue-100" : ""
                  } hover:bg-blue-50`}
                  onClick={() => {
                    setSelected(t);
                    setMode("edit");
                  }}
                >
                  <td className="border border-gray-300 px-3 py-2">
                    {t.partNumber}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    {t.standard}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {t.limitHigh}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {t.limitLow}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(t.id);
                        setShowDeleteConfirm(true);
                      }}
                      disabled={loading}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      type="button"
                      aria-label={`ลบ Threshold ของ ${t.partNumber}`}
                    >
                      <Trash />
                    </button>
                  </td>
                </tr>
              ))}
              {displayedThresholds.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    ยังไม่มีข้อมูล
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ฟอร์มเพิ่ม/แก้ไข */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
          <div>
            <label className="block font-medium mb-1" htmlFor="partNumber">
              Part Number
            </label>
            <input
              id="partNumber"
              type="text"
              value={partNumber}
              disabled={mode === "edit"}
              onChange={(e) => setPartNumber(e.target.value)}
              className="w-full border rounded px-3 py-2"
              maxLength={100}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="standard">
              Standard
            </label>
            <input
              id="standard"
              type="text"
              value={standard}
              onChange={(e) => setStandard(e.target.value)}
              className="w-full border rounded px-3 py-2"
              maxLength={255}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="limitHigh">
              Limit High
            </label>
            <input
              id="limitHigh"
              type="number"
              value={limitHigh}
              onChange={(e) => setLimitHigh(parseNumberInput(e.target.value))}
              className="w-full border rounded px-3 py-2"
              min={0}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="limitLow">
              Limit Low
            </label>
            <input
              id="limitLow"
              type="number"
              value={limitLow}
              onChange={(e) => setLimitLow(parseNumberInput(e.target.value))}
              className="w-full border rounded px-3 py-2"
              min={0}
              required
            />
          </div>

          {error && (
            <div className="text-red-600 font-semibold text-center">
              {error}
            </div>
          )}

          <div className="flex justify-between pt-4 gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              cancel
            </button>
            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded"
            >
              <RotateCcw className="inline mr-1 -mb-1" />
              Reset form
            </button> 
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded text-white ${
                mode === "add"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              {loading ? (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className={`inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 ${
                      mode === "add" ? "fill-green-600" : "fill-yellow-500"
                    }`}
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              ) : mode === "add" ? (
                <>
                  <FilePlus2 className="inline mr-1 -mb-1" />
                  Add
                </>
              ) : (
                <>
                  <FilePenLine className="inline mr-1 -mb-1" />
                  Edit
                </>
              )}
            </button>
          </div>
        </form>

        {/* Delete Confirmation Modal (แสดงทีเดียว) */}
        {showDeleteConfirm && deleteId !== null && (
          <div
            className="fixed inset-0 flex justify-center items-center z-50"
            onClick={() => setShowDeleteConfirm(false)}
            aria-modal="true"
            role="dialog"
          >
            <div
              className="bg-white rounded p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">ยืนยันการลบ</h3>
              <p className="mb-6">คุณต้องการลบ Threshold นี้ใช่หรือไม่?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-400 hover:bg-gray-500 rounded text-white"
                  disabled={loading}
                  type="button"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() => {
                    handleDelete(deleteId);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
                  disabled={loading}
                  type="button"
                >
                  {loading ? "กำลังลบ..." : "ลบ"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
