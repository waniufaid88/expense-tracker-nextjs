"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Category, Account } from "@/lib/types";

const formSchema = z.object({
  type: z.enum(["Income", "Expense"], {
    message: "Please select a transaction type.",
  }),
  amount: z
    .number({
      message: "Amount is required",
    })
    .positive("Amount must be greater than 0."),
  category_id: z.string().uuid("Please select a category."),
  account_id: z.string().uuid("Please select an account."),
  remarks: z
    .string()
    .max(200, "Remarks cannot exceed 200 characters.")
    .optional(),
  date: z.string().min(1, "Date is required."),
});

type TransactionFormValues = z.infer<typeof formSchema>;

type AddTransactionProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  accounts: Account[];
};

export default function AddTransaction({
  isOpen,
  onClose,
  categories,
  accounts,
}: AddTransactionProps) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      type: undefined,
      amount: 0,
      category_id: "",
      account_id: "",
      remarks: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  function handleClose() {
    onClose();
  }

  async function onSubmit(formData: TransactionFormValues) {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create transaction");
      }

      reset();
      router.refresh();
      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Add Transaction
          </DialogTitle>

          <DialogDescription className="text-sm text-gray-500">
            Enter the details of your transaction below.
          </DialogDescription>
        </DialogHeader>

        <form
          id="transaction-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <FieldGroup>
            <Field>
              <FieldLabel
                htmlFor="type"
                className="text-sm font-medium text-gray-700"
              >
                Type
              </FieldLabel>

              <select
                {...register("type")}
                id="type"
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">Select type</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>

              {errors.type && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.type.message}
                </p>
              )}
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel
                  htmlFor="amount"
                  className="text-sm font-medium text-gray-700"
                >
                  Amount
                </FieldLabel>

                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    ₹
                  </span>
                  <Input
                    {...register("amount", { valueAsNumber: true })}
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="h-10 pl-7 focus-visible:ring-emerald-500/20"
                  />
                </div>

                {errors.amount && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.amount.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="date"
                  className="text-sm font-medium text-gray-700"
                >
                  Date
                </FieldLabel>

                <Input
                  {...register("date")}
                  id="date"
                  type="date"
                  className="h-10 focus-visible:ring-emerald-500/20"
                />

                {errors.date && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.date.message}
                  </p>
                )}
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <div>
                  <FieldLabel
                    htmlFor="category_id"
                    className="text-sm font-medium text-gray-700"
                  >
                    Category
                  </FieldLabel>
                  <Button>Add Category</Button>
                </div>

                <select
                  {...register("category_id")}
                  id="category_id"
                  className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="">Select category</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {errors.category_id && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.category_id.message}
                  </p>
                )}
              </Field>

              <Field>
                <div>
                  <FieldLabel
                    htmlFor="account_id"
                    className="text-sm font-medium text-gray-700"
                  >
                    Account
                  </FieldLabel>
                  <Button>Add Account</Button>
                </div>

                <select
                  {...register("account_id")}
                  id="account_id"
                  className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="">Select account</option>

                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>

                {errors.account_id && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.account_id.message}
                  </p>
                )}
              </Field>
            </div>

            <Field>
              <FieldLabel
                htmlFor="remarks"
                className="text-sm font-medium text-gray-700"
              >
                Remarks{" "}
                <span className="font-normal text-gray-400">(optional)</span>
              </FieldLabel>

              <Input
                {...register("remarks")}
                id="remarks"
                placeholder="e.g. Grocery shopping at the market"
                autoComplete="off"
                className="h-10 focus-visible:ring-emerald-500/20"
              />

              {errors.remarks && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.remarks.message}
                </p>
              )}
            </Field>
          </FieldGroup>
        </form>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="border-gray-300"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="transaction-form"
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Add Transaction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
