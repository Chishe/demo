"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { TbSend } from "react-icons/tb";
import { AiOutlineClear } from "react-icons/ai";

export default function InputForm() {
  const [text, setText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("myInput");
    if (saved) setText(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("myInput", text);
  }, [text]);

  const handleSubmit = async () => {
    toast.promise(
      fetch("http://localhost:1880/setGlobal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: text }),
      }),
      {
        loading: "กำลังส่งค่า...",
        success: "ส่งค่าไป Node-RED แล้ว",
        error: "ส่งค่าไม่สำเร็จ",
      }
    );
  };

  const handleClear = async () => {
    toast.promise(
      fetch("http://localhost:1880/clearGlobal", {
        method: "POST",
      }).then(() => {
        setText("");
        localStorage.removeItem("myInput");
      }),
      {
        loading: "กำลังล้างค่า...",
        success: "ล้างค่าแล้ว",
        error: "ล้างค่าไม่สำเร็จ",
      }
    );
  };

  return (
    <div className="p-4  space-y-4 h-full w-full bg-[#000053] rounded-md shadow-lg border-2 border-amber-50">
      <label
        htmlFor="modelInput"
        className="block text-center text-lg font-semibold text-white"
      >
        MODEL TO DAY
      </label>
      <input
        id="modelInput"
        type="text"
        className="border p-3 rounded w-full bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="พิมพ์ข้อความ..."
      />
      <div className="flex gap-4 justify-center">
        <button
          onClick={handleSubmit}
          className="flex items-center justify-center bg-green-500 hover:bg-green-700 transition-colors text-white px-6 py-2 rounded w-full"
          aria-label="Submit"
          title="Submit"
        >
          <TbSend size={20} />
        </button>
        <button
          onClick={handleClear}
          className="flex items-center justify-center bg-gray-500 hover:bg-gray-700 transition-colors text-white px-6 py-2 rounded w-full"
          aria-label="Clear"
          title="Clear"
        >
          <AiOutlineClear size={20} />
        </button>
      </div>
    </div>
  );
}
