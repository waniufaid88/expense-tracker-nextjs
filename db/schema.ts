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

  opening_balance: t
    .numeric({
      precision: 12,
      scale: 2,
    })
    .notNull()
    .default("0"),

  created_at: t.timestamp().defaultNow().notNull(),

  updated_at: t.timestamp().defaultNow().notNull(),
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
    .references(() => Categories.id, {
      onDelete: "restrict",
    }),

  account_id: t
    .uuid()
    .notNull()
    .references(() => Accounts.id, {
      onDelete: "restrict",
    }),

  remarks: t.text(),

  amount: t
    .numeric({
      precision: 12,
      scale: 2,
    })
    .notNull(),

  date: t.date().notNull(),

  type: transactionTypeEnum("type").notNull(),

  created_at: t.timestamp().defaultNow().notNull(),

  updated_at: t.timestamp().defaultNow().notNull(),
}));
