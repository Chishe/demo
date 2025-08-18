"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { TbSend } from "react-icons/tb";
import { AiOutlineClear } from "react-icons/ai";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { logEvent } from "@/lib/client-log";

interface InputFormProps {
  userId: number;
  userIp: string;
}

export default function InputForm({ userId, userIp }: InputFormProps) {
  const [text, setText] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [mode, setMode] = useState<"manual" | "auto">("auto");

  useEffect(() => {
    const saved = localStorage.getItem("myInput");
    if (saved) setText(saved);

    if (mode === "auto") {
      const interval = setInterval(async () => {
        try {
          const res = await fetch("http://localhost:1880/getModel");
          const data = await res.json();
          if (data?.value !== undefined) {
            setText((prev) => {
              if (prev !== data.value) {
                localStorage.setItem("myInput", data.value);
                setIsNew(true);
                setTimeout(() => setIsNew(false), 2000);
                logEvent(
                  userId,
                  "auto_update",
                  "input",
                  { value: data.value },
                  userIp
                );
                return data.value;
              }
              return prev;
            });
          }
        } catch (err) {
          console.error("Error fetching model from Node-RED", err);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [mode]);

  const handleSubmit = async () => {
    logEvent(userId, "submit_input", "button", { value: text }, userIp);
    const strText = String(text || "");
    if (!strText.trim()) {
      toast.error("กรุณากรอก Part Number");

      return;
    }

    try {
      const checkRes = await fetch(
        `/api/check-partnumber?partNumber=${encodeURIComponent(strText)}`
      );
      const checkData = await checkRes.json();

      if (!checkRes.ok || !checkData.exists) {
        toast.error("ไม่มี Part Number นี้ใน Threshold");
        return;
      }

      localStorage.setItem("myInput", strText);

      toast.promise(
        fetch("http://localhost:1880/setGlobal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: strText }),
        }),
        {
          loading: "กำลังส่งค่า...",
          success: "ส่งค่าไป Node-RED แล้ว",
          error: "ส่งค่าไม่สำเร็จ",
        }
      );
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการตรวจสอบ");
    }
  };

  const handleClear = async () => {
    logEvent(userId, "clear_input", "button", { value: text }, userIp);
    toast.promise(
      fetch("http://localhost:1880/clearGlobal", { method: "POST" }).then(
        () => {
          setText("");
          setIsNew(false);
          localStorage.removeItem("myInput");
        }
      ),
      {
        loading: "กำลังล้างค่า...",
        success: "ล้างค่าแล้ว",
        error: "ล้างค่าไม่สำเร็จ",
      }
    );
  };

  return (
    <div className="p-4 space-y-4 h-full w-full bg-[#000053] rounded-md shadow-lg border-2 border-amber-50">
      <div className="flex justify-between items-center">
        <label className="text-lg font-semibold text-white">MODEL TO DAY</label>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    if (userId === 1 || userId === 2 || userId === 3) {
                      setMode("manual");
                      logEvent(
                        userId,
                        "switch_mode",
                        "button",
                        { mode: "manual" },
                        userIp
                      );
                    } else {
                      toast.error("สิทธิ์ไม่เพียงพอในการเลือก Manual");
                    }
                  }}
                  disabled={!(userId === 1 || userId === 2 || userId === 3)}
                  className={`px-3 py-1 rounded ${
                    mode === "manual" ? "bg-blue-500 text-white" : "bg-gray-300"
                  } ${
                    !(userId === 1 || userId === 2 || userId === 3)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Manual
                </button>
              </TooltipTrigger>

              {userId === 4 && (
                <TooltipContent>
                  ต้องใช้บัญชีที่มีสิทธิ์ MANAGER หรือ EXECUTIVE ขึ้นไป
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <button
            onClick={() => {
              setMode("auto");
              logEvent(userId, "switch_mode", "button", {
                mode: "auto",
                ip: userIp,
              });
            }}
            className={`px-3 py-1 rounded ${
              mode === "auto" ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            Auto
          </button>
        </div>
      </div>

      <input
        id="modelInput"
        type="text"
        disabled={mode === "auto"}
        className={`border p-3 rounded w-full placeholder-gray-400 focus:outline-none focus:ring-2 
          ${isNew ? "bg-green-500 text-white" : "bg-white text-gray-800"} 
          focus:ring-green-400`}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          logEvent(
            userId,
            "input_change",
            "input",
            {
              value: e.target.value,
            },
            userIp
          );
        }}
        placeholder="พิมพ์ข้อความ..."
      />

      <div className="flex gap-4 justify-center">
        {/* ปุ่ม Submit */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleSubmit}
                disabled={!(userId === 1 || userId === 2 || userId === 3)}
                className={`flex items-center justify-center px-6 py-2 rounded w-full transition-colors ${
                  userId === 1 || userId === 2 || userId === 3
                    ? "bg-green-500 hover:bg-green-700 text-white"
                    : "bg-green-300 text-white opacity-50 cursor-not-allowed"
                }`}
                aria-label="Submit"
              >
                <TbSend size={20} />
              </button>
            </TooltipTrigger>
            {!(userId === 1 || userId === 2 || userId === 3) && (
              <TooltipContent>
                ต้องใช้บัญชีที่มีสิทธิ์ MANAGER หรือ EXECUTIVE ขึ้นไป
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        {/* ปุ่ม Clear */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleClear}
                disabled={userId === 4}
                className={`flex items-center justify-center px-6 py-2 rounded w-full transition-colors ${
                  userId === 4
                    ? "bg-gray-300 text-white opacity-50 cursor-not-allowed"
                    : "bg-gray-500 hover:bg-gray-700 text-white"
                }`}
                aria-label="Clear"
              >
                <AiOutlineClear size={20} />
              </button>
            </TooltipTrigger>
            {userId === 4 && (
              <TooltipContent>
                ผู้ใช้ทั่วไป (USER) ไม่มีสิทธิ์ล้างข้อมูล
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
