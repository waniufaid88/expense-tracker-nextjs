import db from "@/db";
import { Accounts } from "@/db/schema";
import AccountsTable from "./accountsTable";

export default async function Page() {
  const accounts = await db.select().from(Accounts);

  return <AccountsTable accounts={accounts} />;
}
