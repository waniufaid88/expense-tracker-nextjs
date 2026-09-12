export type Category = {
  id: string;
  name: string;
  description: string | null;
};

export type Account = {
  id: string;
  name: string;
  opening_balance: string;
};

export type Transaction = {
  id: string;
  date: string;
  type: "Income" | "Expense";
  remarks: string | null;
  amount: string;
  account_name: string;
  category_name: string;
};
