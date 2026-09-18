import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Category } from "@/lib/types";
import { format } from "date-fns";

import CategoryForm from "./categoryFormDialog";
import DeleteCategory from "./deleteCategory";

type CategoriesTableProps = {
  categories: Category[];
};

export default function CategoriesTable({ categories }: CategoriesTableProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories Table</h1>
          Total categories: {categories.length}
        </div>

        <CategoryForm />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-semibold text-gray-700">
                Category Name
              </TableHead>

              <TableHead className="font-semibold text-gray-700">
                Description
              </TableHead>

              <TableHead className="font-semibold text-gray-700">
                Created-At
              </TableHead>

              <TableHead className="font-semibold text-gray-700">
                Updated-At
              </TableHead>

              <TableHead className="text-right  font-semibold text-gray-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>

                <TableCell>{category.description}</TableCell>

                <TableCell>
                  {format(new Date(category.created_at), "dd-MMM-yy")}
                </TableCell>

                <TableCell>
                  {format(new Date(category.updated_at), "dd-MMM-yy")}
                </TableCell>

                <TableCell>
                  <div className="flex items-center justify-end gap-3">
                    <CategoryForm mode="edit" category={category} />

                    <DeleteCategory category={category} />
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-6 text-center">
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
