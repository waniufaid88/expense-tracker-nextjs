"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

type Transaction = {
  id: number;
  date: string;
  type: string;
  remarks: string | null;
  amount: string;
  account_name: string;
  category_name: string;
};

export default function ExpenseHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getTransactions = async () => {
    try {
      const response = await fetch("/api/transactions");

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();

      console.log("expense transactions are:", data);

      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);

  const expenseTransactions = transactions.filter(
    (transaction) => transaction.type === "Expense",
  );

  console.log("expenses are:", expenseTransactions);

  const totalExpenses = expenseTransactions.reduce(
    (total, transaction) => total + Number(transaction.amount),
    0,
  );

  console.log("total expense:", totalExpenses);

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Expense History</h1>

          <p className="text-sm text-muted-foreground">
            Review all expense payments.
          </p>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-red-500/20 via-red-500/10 to-transparent border-red-500/20">
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Expense
            </p>

            <h2 className="text-3xl font-bold text-red-600 mt-1">
              ₹{totalExpenses.toLocaleString("en-IN")}
            </h2>
          </div>

          <div className="flex gap-3">
            <div className="bg-background/80 backdrop-blur px-4 py-2 rounded-lg border text-right">
              <p className="text-xs text-muted-foreground">Transactions</p>

              <p className="text-sm font-semibold">
                {expenseTransactions.length} Entries
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {isLoading ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Loading expenses...
            </CardContent>
          </Card>
        ) : expenseTransactions.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No expense transactions found.
            </CardContent>
          </Card>
        ) : (
          expenseTransactions.map((transaction) => (
            <Card
              key={transaction.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-base">
                    {transaction.remarks || "Expense"}
                  </h3>

                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="secondary" className="text-xs font-normal">
                      {transaction.category_name}
                    </Badge>

                    <span className="text-xs text-muted-foreground">•</span>

                    <span className="text-xs text-muted-foreground">
                      {transaction.account_name}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-red-600 font-bold text-lg">
                    -₹{Number(transaction.amount).toLocaleString("en-IN")}
                  </div>

                  <p className="text-xs text-muted-foreground mt-0.5">
                    {transaction.date}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
