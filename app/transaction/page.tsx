import db from "@/db";
import { Accounts, Categories, Transactions } from "@/db/schema";
import TransactionTable from "./transactionTable";

export default async function Page() {
  const transactions = await db.select().from(Transactions);
  const categories = await db.select().from(Categories);
  const accounts = await db.select().from(Accounts);

  const transactionNames = transactions.map((t) => {
    const category = categories.find((c) => c.id === t.category_id);
    const account = accounts.find((a) => a.id === t.account_id);

    return {
      ...t,
      category_name: category?.name ?? "Unknown",
      account_name: account?.name ?? "Unknown",
    };
  });

  return (
    <div className="w-full">
      <TransactionTable
        categories={categories}
        accounts={accounts}
        transactions={transactionNames}
      />
    </div>
  );
}
