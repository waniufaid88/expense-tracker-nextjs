import db from "@/db";
import { Accounts, Transactions } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const body = await request.json();
    const { name, opening_balance } = body;

    if (!name || opening_balance === undefined || opening_balance === null) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    const existingAccount = await db
      .select()
      .from(Accounts)
      .where(eq(Accounts.id, id));

    if (existingAccount.length === 0) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const duplicateAccount = await db
      .select()
      .from(Accounts)
      .where(eq(Accounts.name, name));

    if (duplicateAccount.length > 0 && duplicateAccount[0].id !== id) {
      return NextResponse.json(
        { error: "Account with this name already exists" },
        { status: 409 },
      );
    }

    const updatedAccount = await db
      .update(Accounts)
      .set({ name, opening_balance })
      .where(eq(Accounts.id, id))
      .returning();

    return NextResponse.json(
      { message: "Account updated successfully", updatedAccount },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating account:", error);
    return NextResponse.json(
      { error: "Failed to update account" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const existingAccount = await db
      .select()
      .from(Accounts)
      .where(eq(Accounts.id, id));

    if (existingAccount.length === 0) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const transactionCount = await db
      .select({ count: count() })
      .from(Transactions)
      .where(eq(Transactions.account_id, id));

    if (transactionCount[0].count > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete this account because it has transactions",
        },
        { status: 409 },
      );
    }

    await db.delete(Accounts).where(eq(Accounts.id, id));

    return NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 },
    );
  }
}
