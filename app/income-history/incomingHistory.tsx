"use client";

import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Transaction = {
  id: number;
  date: string;
  type: string;
  remarks: string | null;
  amount: string;
  account_name: string;
  category_name: string;
};

export default function IncomingHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const getTransactions = async () => {
    try {
      const response = await fetch("/api/transactions");

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();

      console.log("incoming transactions are:", data);

      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);

  const incomingTransactions = transactions.filter(
    (transaction) => transaction.type === "Income",
  );

  console.log("incoming trns :", incomingTransactions);

  const totalIncome = incomingTransactions.reduce(
    (total, transaction) => total + Number(transaction.amount),
    0,
  );

  console.log("total inc : ", totalIncome);

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Incoming History
          </h1>

          <p className="text-sm text-muted-foreground">
            Review all incoming payments.
          </p>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/20">
        <CardContent className="p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Income
            </p>

            <h2 className="text-3xl font-bold text-emerald-600 mt-1">
              ₹{totalIncome.toLocaleString("en-IN")}
            </h2>
          </div>

          <div className="flex gap-3">
            <div className="bg-background/80 backdrop-blur px-4 py-2 rounded-lg border text-right">
              <p className="text-xs text-muted-foreground">Transactions</p>

              <p className="text-sm font-semibold">
                {incomingTransactions.length} Entries
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {incomingTransactions.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No incoming transactions found.
            </CardContent>
          </Card>
        ) : (
          incomingTransactions.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-base">
                    {item.remarks || "Income"}
                  </h3>

                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="secondary" className="text-xs font-normal">
                      {item.category_name}
                    </Badge>

                    <span className="text-xs text-muted-foreground">•</span>

                    <span className="text-xs text-muted-foreground">
                      {item.account_name}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-emerald-600 font-bold text-lg">
                    +₹{Number(item.amount).toLocaleString("en-IN")}
                  </div>

                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(item.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
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
