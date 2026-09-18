import db from "@/db";
import { Transactions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const body = await request.json();
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

    const updatedTransaction = await db
      .update(Transactions)
      .set({
        category_id,
        account_id,
        remarks: remarks || null,
        amount: amount.toString(),
        date,
        type,
      })
      .where(eq(Transactions.id, id))
      .returning();

    if (updatedTransaction.length === 0) {
      return NextResponse.json(
        {
          message: "Transaction not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Transaction updated successfully",
        transaction: updatedTransaction[0],
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("PUT transaction error:", error);
  }
}
