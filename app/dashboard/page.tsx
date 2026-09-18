import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import db from "@/db";
import { Accounts, Transactions } from "@/db/schema";

export default async function Dashboard() {
  const accounts = await db.select().from(Accounts);
  const transactions = await db.select().from(Transactions);

  const openingBalance = accounts.reduce(
    (total, account) => total + Number(account.opening_balance),
    0,
  );

  const expenses = transactions
    .filter((transaction) => transaction.type === "Expense")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const incomingBalance = transactions
    .filter((transaction) => transaction.type === "Income")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const totalBalance = openingBalance + incomingBalance - expenses;

  return (
    <div className="w-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your financial activity
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Link href="/income-history" className="block group">
          <Card className="transition-all duration-200 group-hover:border-green-500 group-hover:shadow-md cursor-pointer ">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Incoming Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                ₹{incomingBalance.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Total income</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/accounts" className="block group">
          <Card className="transition-all duration-200 group-hover:border-primary group-hover:shadow-md cursor-pointer">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Opening Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                ₹{openingBalance.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Starting balance
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/expense-history" className="block group">
          <Card className="transition-all duration-200 group-hover:border-red-500 group-hover:shadow-md cursor-pointer">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">
                ₹{expenses.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Total expenses
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/transaction-history" className="block group">
          <Card className="transition-all duration-200 group-hover:border-blue-500 group-hover:shadow-md cursor-pointer">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">
                ₹{totalBalance.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Current available balance
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
