import db from "@/db";
import { Categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await db.select().from(Categories);

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 },
      );
    }

    const existingCategory = await db
      .select()
      .from(Categories)
      .where(eq(Categories.name, name));

    if (existingCategory.length > 0) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 409 },
      );
    }

    const newCategory = await db
      .insert(Categories)
      .values({
        name,
        description,
      })
      .returning();

    return NextResponse.json(
      {
        message: "Category created successfully",
        newCategory,
      },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
  }
}
