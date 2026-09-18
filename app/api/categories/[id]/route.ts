import db from "@/db";
import { Categories, Transactions } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const body = await request.json();
    const { name, description } = body;

    if (!name || !description) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    const existingCategory = await db
      .select()
      .from(Categories)
      .where(eq(Categories.id, id));

    if (existingCategory.length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    const duplicateCategory = await db
      .select()
      .from(Categories)
      .where(eq(Categories.name, name));

    if (duplicateCategory.length > 0) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 409 },
      );
    }

    const updatedCategory = await db
      .update(Categories)
      .set({ name, description })
      .where(eq(Categories.id, id))
      .returning();

    return NextResponse.json(
      { message: "Category updated successfully", updatedCategory },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
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

    const existingCategory = await db
      .select()
      .from(Categories)
      .where(eq(Categories.id, id));

    if (existingCategory.length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    const transactionCount = await db
      .select({ count: count() })
      .from(Transactions)
      .where(eq(Transactions.category_id, id));

    if (transactionCount[0].count > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with transactions" },
        { status: 400 },
      );
    }

    await db.delete(Categories).where(eq(Categories.id, id));

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 },
    );
  }
}
