import db from "@/db";
import { Accounts } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await db.select().from(Accounts);

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, opening_balance } = body;

    if (!name || !opening_balance) {
      return NextResponse.json(
        {
          message: "All fields are required",
        },
        { status: 400 },
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
    console.log(error);
  }
}
