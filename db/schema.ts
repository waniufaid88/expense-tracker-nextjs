import { relations } from "drizzle-orm";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";

export const Categories = pgTable("categories", (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  name: t.varchar({ length: 255 }).notNull(),
  description: t.varchar({ length: 255 }),
  created_at: t.timestamp().defaultNow().notNull(),
  updated_at: t.timestamp().defaultNow().notNull(),
}));

export const Accounts = pgTable("accounts", (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  name: t.varchar({ length: 255 }).notNull(),
  opening_balance: t.smallint().notNull().default(0),
  created_at: t.timestamp().defaultNow().notNull(),
  updated_at: t.timestamp().defaultNow().notNull(),
}));

export const accountRelations = relations(Accounts, (t) => ({
  transactions: t.many(Transactions),
}));

export const transactionTypeEnum = pgEnum("transaction_type", [
  "Income",
  "Expense",
]);
export const Transactions = pgTable("transactions", (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  category_id: t
    .uuid()
    .notNull()
    .references(() => Categories.id, { onDelete: "restrict" }),
  account_id: t
    .uuid()
    .notNull()
    .references(() => Accounts.id, { onDelete: "restrict" }),
  remarks: t.varchar({ length: 255 }),
  amount: t.numeric().notNull(),
  date: t.date().notNull(),
  type: transactionTypeEnum("type").notNull(),
  created_at: t.timestamp().defaultNow().notNull(),
  updated_at: t.timestamp().defaultNow().notNull(),
}));

export const transactionRelations = relations(Transactions, (t) => ({
  account: t.one(Accounts, {
    fields: [Transactions.account_id],
    references: [Accounts.id],
  }),
  category: t.one(Categories, {
    fields: [Transactions.category_id],
    references: [Categories.id],
  }),
}));
