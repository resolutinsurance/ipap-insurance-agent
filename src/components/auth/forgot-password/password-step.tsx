"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/lib/constants";
import {
  VerifyPasswordResetCodeFormData,
  verifyPasswordResetCodeSchema,
} from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface PasswordStepProps {
  email: string;
}

export const PasswordStep = ({ email }: PasswordStepProps) => {
  const { changeUserPassword } = useAuth();

  const form = useForm<VerifyPasswordResetCodeFormData>({
    resolver: zodResolver(verifyPasswordResetCodeSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: VerifyPasswordResetCodeFormData) => {
    try {
      await changeUserPassword.mutateAsync({
        email,
        password: data.password,
      });
      toast.success("Password changed successfully");
      window.location.href = ROUTES.LOGIN;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to change password"
      );
    }
  };

  return (
    <>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Reset Your Password</h1>
        <p className="text-sm text-muted-foreground">
          Please enter your new password below.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <PasswordInput
            id="password"
            placeholder="Enter your new password"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-sm text-red-500">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Confirm your new password"
            {...form.register("confirmPassword")}
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={changeUserPassword.isPending}
        >
          {changeUserPassword.isPending
            ? "Changing Password..."
            : "Change Password"}
        </Button>
      </form>
    </>
  );
};
