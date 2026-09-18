"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { SquarePen } from "lucide-react";

import { Account } from "@/lib/types";

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
    .min(1, "Account name is required")
    .max(100, "Account name cannot exceed 100 characters"),

  opening_balance: z.number().nonnegative("Amount should not be negative."),
});

type AccountFormValues = z.infer<typeof formSchema>;

type AccountFormProps = {
  mode?: "add" | "edit";
  account?: Account;
};

export default function AccountForm({
  mode = "add",
  account,
}: AccountFormProps) {
  const [showDialog, setShowDialog] = useState(false);

  const router = useRouter();
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: account?.name ?? "",
      opening_balance: account?.opening_balance ?? 0,
    },
  });

  const handleClose = () => {
    reset();
    setShowDialog(false);
  };

  const onSubmit = async (formData: AccountFormValues) => {
    try {
      const url = isEdit ? `/api/accounts/${account?.id}` : "/api/accounts";

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
            `Failed to ${isEdit ? "update" : "create"} account`,
        );
      }

      toast.success(
        result.message ||
          `Account ${isEdit ? "updated" : "created"} successfully`,
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
            } the account`;

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
          Add Account
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
            <DialogTitle>{isEdit ? "Edit Account" : "Add Account"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <Label htmlFor="name">Account Name</Label>

                <Input
                  id="name"
                  placeholder="Enter account name..."
                  {...register("name")}
                />

                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </Field>

              <Field>
                <Label htmlFor="opening_balance">Opening Balance</Label>

                <Input
                  id="opening_balance"
                  type="number"
                  placeholder="Enter your opening balance..."
                  {...register("opening_balance", {
                    valueAsNumber: true,
                  })}
                />

                {errors.opening_balance && (
                  <p className="text-xs text-red-500">
                    {errors.opening_balance.message}
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
                    ? "Update Account"
                    : "Save Account"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
