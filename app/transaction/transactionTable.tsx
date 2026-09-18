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
  accounts: Omit<Account, "hasTransactions">[];
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

  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);

  const transactionsPerPage = 5;

  const totalPages = Math.ceil(transactions.length / transactionsPerPage);
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const endIndex = startIndex + transactionsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  async function refreshTransactions() {
    setIsLoading(true);

    try {
      const response = await fetch("/api/transactions");

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();

      setTransactions(data);

      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Transaction History
          </h1>

          <p className="text-sm text-gray-500">
            {transactions.length} transaction
            {transactions.length !== 1 ? "s" : ""} recorded
          </p>
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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-gray-500"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
                    Loading transactions...
                  </div>
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-gray-400"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              currentTransactions.map((t) => (
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

      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-700">{startIndex + 1}</span>{" "}
            to{" "}
            <span className="font-medium text-gray-700">
              {Math.min(endIndex, transactions.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-700">
              {transactions.length}
            </span>{" "}
            transactions
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ),
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <AddTransaction
        isOpen={showDialog}
        onClose={() => {
          setShowDialog(false);
        }}
        onTransactionAdded={refreshTransactions}
        categories={categories}
        accounts={accounts}
      />
    </div>
  );
}
