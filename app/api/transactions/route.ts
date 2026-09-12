import db from "@/db";
import { Accounts, Categories, Transactions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await db
      .select({
        id: Transactions.id,
        date: Transactions.date,
        type: Transactions.type,
        remarks: Transactions.remarks,
        amount: Transactions.amount,
        account_name: Accounts.name,
        category_name: Categories.name,
      })
      .from(Transactions)
      .innerJoin(Accounts, eq(Transactions.account_id, Accounts.id))
      .innerJoin(Categories, eq(Transactions.category_id, Categories.id));

    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error) {
    console.error("GET transactions error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch transactions",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("Request body:", body);

    const { category_id, account_id, remarks, amount, date, type } = body;

    if (!category_id || !account_id || amount === undefined || !date || !type) {
      return NextResponse.json(
        {
          message: "All fields are required",
        },
        {
          status: 400,
        },
      );
    }

    const newTransaction = await db
      .insert(Transactions)
      .values({
        category_id,
        account_id,
        remarks: remarks || null,
        amount: amount.toString(),
        date,
        type,
      })
      .returning();

    return NextResponse.json(
      {
        message: "Transaction created successfully",
        transaction: newTransaction[0],
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("POST transaction error:", error);

    return NextResponse.json(
      {
        message: "Failed to create transaction",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}
