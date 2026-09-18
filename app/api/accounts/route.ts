import db from "@/db";
import { Accounts } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const offset = (page - 1) * limit;

    const data = await db
      .select()
      .from(Accounts)
      .orderBy(desc(Accounts.created_at))
      .limit(limit)
      .offset(offset);

    const totalResult = await db.select({ count: count() }).from(Accounts);

    const totalAccounts = totalResult[0]?.count || 0;

    const totalPages = Math.ceil(totalAccounts / limit);

    return NextResponse.json({
      accounts: data,
      pagination: {
        currentPage: page,
        limit,
        totalAccounts,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, opening_balance } = body;

    if (!name || opening_balance === undefined || opening_balance === null) {
      return NextResponse.json(
        {
          message: "All fields are required",
        },
        { status: 400 },
      );
    }

    const existingAccount = await db
      .select()
      .from(Accounts)
      .where(eq(Accounts.name, name));

    if (existingAccount.length > 0) {
      return NextResponse.json(
        {
          error: "Account with this name already exists",
        },
        { status: 409 },
      );
    }

    const addAccount = await db.insert(Accounts).values({
      name,
      opening_balance,
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        addAccount,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating account:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 },
    );
  }
}
