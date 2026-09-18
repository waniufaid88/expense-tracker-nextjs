import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Account } from "@/lib/types";
import { format } from "date-fns";
import DeleteAccount from "./deleteAccount";
import AccountForm from "./accountFormDialog";

type AccountsTableProps = {
  accounts: Account[];
};

export default function AccountsTable({ accounts }: AccountsTableProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Accounts Table</h1>
          Total accounts: {accounts.length}
        </div>
        <AccountForm />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-semibold text-gray-700">
                Account Name
              </TableHead>

              <TableHead className="font-semibold text-gray-700">
                Created-At
              </TableHead>

              <TableHead className="font-semibold text-gray-700">
                Opening Balance
              </TableHead>

              <TableHead className="text-right font-semibold text-gray-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>{account.name}</TableCell>

                <TableCell>
                  {format(new Date(account.created_at), "dd-MMM-yy")}
                </TableCell>

                <TableCell className="font-semibold text-primary">
                  ₹{account.opening_balance.toLocaleString()}
                </TableCell>

                <TableCell>
                  <div className="flex items-center justify-end gap-3">
                    <AccountForm mode="edit" account={account} />

                    <DeleteAccount account={account} />
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {accounts.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-6 text-center">
                  No accounts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
