"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="border-b border-gray-100 px-4 py-5">
        <div className="flex items-center gap-2.5">
          <div>
            <h2 className="text-base font-semibold leading-tight text-gray-900">
              Expense Tracker
            </h2>
            <p className="text-xs text-gray-400">Manage your money</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-col gap-1 px-3 py-4">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
            pathname === "/dashboard"
              ? "bg-emerald-50 text-emerald-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Dashboard
        </Link>

        <Link
          href="/transaction"
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
            pathname === "/transaction"
              ? "bg-emerald-50 text-emerald-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Transaction History
        </Link>

        <Link
          href="/income"
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
            pathname === "/transaction"
              ? "bg-emerald-50 text-emerald-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Income History
        </Link>

        <Link
          href="/expense"
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
            pathname === "/transaction"
              ? "bg-emerald-50 text-emerald-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Expense History
        </Link>

        <Link
          href="/addAccount"
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
            pathname === "/addAccount"
              ? "bg-emerald-50 text-emerald-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Add Account
        </Link>

        <Link
          href="/addCategory"
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
            pathname === "/addCategory"
              ? "bg-emerald-50 text-emerald-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Add Category
        </Link>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100"></div>
          <div>
            <p className="text-sm font-medium text-gray-900">Ufaid</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
