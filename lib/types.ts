export type Category = {
  id: string;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
};

export interface Account {
  id: string;
  name: string;
  opening_balance: number;
  created_at: Date;
  updated_at: Date;
}

export type Transaction = {
  id: string;
  date: string;
  type: "Income" | "Expense";
  remarks: string | null;
  amount: string;
  account_name: string;
  category_name: string;
};
