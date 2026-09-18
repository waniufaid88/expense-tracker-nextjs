"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { SquarePen } from "lucide-react";

import { Category } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(200, "Category name cannot exceed 200 characters"),

  description: z.string().max(300, "Description cannot exceed 300 characters"),
});

type CategoryFormValues = z.infer<typeof formSchema>;

type CategoryFormProps = {
  mode?: "add" | "edit";
  category?: Category;
};

export default function CategoryForm({
  mode = "add",
  category,
}: CategoryFormProps) {
  const [showDialog, setShowDialog] = useState(false);

  const router = useRouter();
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
    },
  });

  const handleClose = () => {
    reset();
    setShowDialog(false);
  };

  const onSubmit = async (formData: CategoryFormValues) => {
    try {
      const url = isEdit
        ? `/api/categories/${category?.id}`
        : "/api/categories";

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            result.message ||
            `Failed to ${isEdit ? "update" : "create"} category`,
        );
      }

      toast.success(
        result.message ||
          `Category ${isEdit ? "updated" : "created"} successfully`,
      );

      reset();
      setShowDialog(false);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : `An error occurred while ${
              isEdit ? "updating" : "creating"
            } the category`;

      toast.error(message);
    }
  };

  return (
    <>
      {isEdit ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowDialog(true)}
        >
          <SquarePen size={16} className="text-secondary" />
        </Button>
      ) : (
        <Button
          type="button"
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={() => setShowDialog(true)}
        >
          Add Category
        </Button>
      )}

      <Dialog
        open={showDialog}
        onOpenChange={(open) => {
          if (!open) {
            handleClose();
          } else {
            setShowDialog(true);
          }
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <Label htmlFor="name">Category Name</Label>

                <Input
                  id="name"
                  placeholder="Enter category name..."
                  {...register("name")}
                />

                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </Field>

              <Field>
                <Label htmlFor="description">Description</Label>

                <Input
                  id="description"
                  placeholder="Enter description..."
                  {...register("description")}
                />

                {errors.description && (
                  <p className="text-xs text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </Field>
            </FieldGroup>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : isEdit
                    ? "Update Category"
                    : "Save Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
