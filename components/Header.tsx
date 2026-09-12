"use client";

import { SidebarTrigger } from "./ui/sidebar";

export default function Header() {
  return (
    <div className="flex flex-row gap-4 w-full p-3 border-b border-gray-500/10">
      <SidebarTrigger />
      <div className="text-lg font-bold text-green-800 tracking-wide">
        Expense Tracker{" "}
      </div>
    </div>
  );
}
