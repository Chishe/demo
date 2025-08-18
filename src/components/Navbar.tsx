"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { User, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { logEvent } from "@/lib/client-log";

interface User {
  id: number;
  firstname: string;
  lastname: string;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (pathname === "/login") return;

    const interval = setInterval(() => {
      fetch("/api/profile")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setUser(data.user);
        })
        .catch(console.error);
    }, 5000);

    return () => clearInterval(interval);
  }, [pathname]);

  const handleLogout = async () => {
    if (user)
      await logEvent(user.id, "logout", "button", { buttonId: "logout" });
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    toast.success("Logout successful!");
    router.push("/login");
  };

  const handleClickButton = async (buttonId: string) => {
    if (user) await logEvent(user.id, "click_button", "button", { buttonId });
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-[#000053] p-4 border-b border-blue-200 shadow-md">
      <div className="w-full mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img
            src="/ANIWAT-LOGOS.png"
            alt="Logo"
            className="w-20 h-10 rounded-full"></img>
          <h1 className="text-3xl text-sky-600 font-bold">
            EVISION MONITORING SYSTEM DEMO
          </h1>
        </div>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                onClick={() => handleClickButton("user_dropdown")}
              >
                <User className=" text-black" />
                <Separator className="bg-black" orientation="vertical" />
                {user.firstname} {user.lastname}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-[#000053] text-white"
            >
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </nav>
  );
}
