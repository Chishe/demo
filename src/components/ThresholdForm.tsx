"use client";
import { useState } from "react";
import toast from "react-hot-toast";

interface PartInfoProps {
  id?: number;
  partNumber: string;
  standard: string;
  limitHigh: number;
  limitLow: number;
  created_at?: string;
}

export default function ThresholdForm() {
  const [formData, setFormData] = useState<PartInfoProps>({
    partNumber: "",
    standard: "",
    limitHigh: 0,
    limitLow: 0,
  });
  const [editId, setEditId] = useState<number | null>(null);

  const inputs = [
    {
      name: "partNumber",
      label: "Part Number",
      type: "text",
      required: true,
    },
    {
      name: "standard",
      label: "Standard",
      type: "text",
      required: true,
    },
    {
      name: "limitHigh",
      label: "Limit High",
      type: "number",
      required: true,
    },
    {
      name: "limitLow",
      label: "Limit Low",
      type: "number",
      required: true,
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editId) {
      toast.success("Updated successfully");
    } else {
      toast.success("Inserted successfully");
    }
    setFormData({
      partNumber: "",
      standard: "",
      limitHigh: 0,
      limitLow: 0,
    });
    setEditId(null);
  };

  return (
    <form className="w-full h-full max-w-sm" onSubmit={handleSubmit}>
      <div className="relative w-full mb-4">
        <input
          id="partNumber"
          name="partNumber"
          type="text"
          required
          value={formData.partNumber}
          onChange={handleChange}
          placeholder=" "
          className="peer block w-full appearance-none border border-gray-300 rounded-md bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
        />
        <label
          htmlFor="partNumber"
          className="absolute left-3 top-2 text-gray-500 text-sm transition-all transform origin-left scale-100
                 peer-placeholder-shown:translate-y-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400
                 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-blue-600"
        >
          Part Number
        </label>
      </div>

      <div className="relative w-full mb-4">
        <input
          id="standard"
          name="standard"
          type="text"
          required
          value={formData.standard}
          onChange={handleChange}
          placeholder=" "
          className="peer block w-full appearance-none border border-gray-300 rounded-md bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
        />
        <label
          htmlFor="standard"
          className="absolute left-3 top-2 text-gray-500 text-sm transition-all transform origin-left scale-100
                 peer-placeholder-shown:translate-y-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400
                 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-blue-600"
        >
          Standard
        </label>
      </div>
      <div className="flex gap-4 mb-2">
        <div className="relative flex-1">
          <input
            id="limitLow"
            name="limitLow"
            type="number"
            required
            value={formData.limitLow}
            onChange={handleChange}
            placeholder=" "
            className="peer block w-full appearance-none border border-gray-300 rounded-md bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          <label
            htmlFor="limitLow"
            className="absolute left-3 top-2 text-gray-500 text-sm transition-all transform origin-left scale-100
                   peer-placeholder-shown:translate-y-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400
                   peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-blue-600"
          >
            Limit Low
          </label>
        </div>
        <div className="relative flex-1">
          <input
            id="limitHigh"
            name="limitHigh"
            type="number"
            required
            value={formData.limitHigh}
            onChange={handleChange}
            placeholder=" "
            className="peer block w-full appearance-none border border-gray-300 rounded-md bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          <label
            htmlFor="limitHigh"
            className="absolute left-3 top-2 text-gray-500 text-sm transition-all transform origin-left scale-100
                   peer-placeholder-shown:translate-y-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400
                   peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-blue-600"
          >
            Limit High
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        {editId ? "UPDATE" : "INSERT"}
      </button>
    </form>
  );
}
