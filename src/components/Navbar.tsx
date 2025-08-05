// app/components/Navbar.tsx
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-gradient-to-b from-gray-500 to-white p-4 border-b border-gray-100 shadow-md">
      <div className="w-full mx-auto flex items-center space-x-2 justify-start">
        <Image src="/ANIWAT-LOGOS.png" alt="Logo" width={100} height={40} />
        <div className="relative inline-block">
          <h1 className="text-3xl text-sky-600 font-bold">
            EVISION MONITORING SYSTEM DEMO
          </h1>
          <p className="text-3xl text-sky-600 font-bold opacity-50 blur-sm transform scale-y-[-0.8] absolute left-0 top-full">
            EVISION MONITORING SYSTEM DEMO
          </p>
        </div>
      </div>
    </nav>
  );
}
