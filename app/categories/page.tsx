import db from "@/db";
import { Categories } from "@/db/schema";
import CategoriesTable from "./categoryTable";

export default async function Page() {
  const categories = await db.select().from(Categories);

  return <CategoriesTable categories={categories} />;
}
