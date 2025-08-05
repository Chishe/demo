import "./globals.css";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "EVISION MONITORING SYSTEM DEMO",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="h-screen bg-gray-100">
        <Navbar />
        <main className="p-4">{children}</main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
