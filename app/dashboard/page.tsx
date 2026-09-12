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
  console.log("opening balance is :", openingBalance);

  const expenses = transactions
    .filter((transaction) => transaction.type === "Expense")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  console.log("expense amount is :", expenses);

  const incomingBalance = transactions
    .filter((transaction) => transaction.type === "Income")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  console.log("incoming balance is :", incomingBalance);

  const totalBalance = openingBalance + incomingBalance - expenses;
  console.log("total balance is :", totalBalance);

  return (
    <div className="w-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your financial activity
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
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

        <Card>
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

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              ₹{expenses.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Total expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
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
      </div>
    </div>
  );
}
