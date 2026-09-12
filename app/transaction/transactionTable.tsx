"use client";

import { Category, Account, Transaction } from "@/lib/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddTransaction from "./addTransaction";

type TransactionTableProps = {
  categories: Category[];
  accounts: Account[];
  transactions: Transaction[];
};

export default function TransactionTable({
  categories,
  accounts,
  transactions: initialTransactions,
}: TransactionTableProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);

  async function refreshTransactions() {
    try {
      const response = await fetch("/api/transactions");

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      setTransactions(await response.json());
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Transaction History
          </h1>
        </div>

        <Button
          onClick={() => setShowDialog(true)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          + Add Transaction
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-semibold text-gray-700">
                Date
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Account
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Category
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Remarks
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Type
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-700">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-gray-400"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((t) => (
                <TableRow
                  key={t.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <TableCell className="text-gray-600">{t.date}</TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {t.account_name}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {t.category_name}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {t.remarks || "-"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        t.type === "Expense"
                          ? "bg-red-50 text-red-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {t.type}
                    </span>
                  </TableCell>
                  <TableCell
                    className={`text-right font-semibold tabular-nums ${
                      t.type === "Expense" ? "text-red-600" : "text-emerald-600"
                    }`}
                  >
                    {t.type === "Expense" ? "-" : "+"}₹{t.amount}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AddTransaction
        isOpen={showDialog}
        onClose={() => {
          setShowDialog(false);
          refreshTransactions();
        }}
        categories={categories}
        accounts={accounts}
      />
    </div>
  );
}
