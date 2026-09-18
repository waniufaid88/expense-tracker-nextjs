import db from ".";
import { Accounts } from "./schema";

export async function getAccounts() {
  const accounts = await db.query.Accounts.findMany({
    with: {
      transactions: true,
    },
  });

  return accounts;
}
