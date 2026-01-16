"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordFormData, passwordSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface PasswordChangeSectionProps {
  userEmail?: string;
  onChangePassword: (email: string, newPassword: string) => Promise<void>;
}

export const PasswordChangeSection = ({
  userEmail,
  onChangePassword,
}: PasswordChangeSectionProps) => {
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState<PasswordFormData | null>(null);

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordSubmit = (data: PasswordFormData) => {
    setPasswordFormData(data);
    setShowPasswordConfirm(true);
  };

  const onSubmitPassword = async () => {
    if (!userEmail || !passwordFormData) return;

    try {
      await onChangePassword(userEmail, passwordFormData.newPassword);

      toast.success("Password changed successfully");
      setShowPasswordConfirm(false);
      passwordForm.reset();
    } catch (err) {
      console.error("Password change error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setPasswordFormData(null);
    }
  };

  const isPasswordFormDirty = passwordForm.formState.isDirty;

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Change Password</h2>
            <p className="text-sm text-muted-foreground">
              To change your password please confirm here
            </p>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Password</label>
                <PasswordInput
                  className="rounded-xl"
                  {...passwordForm.register("currentPassword")}
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-sm text-red-500">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <PasswordInput
                  className="rounded-xl"
                  {...passwordForm.register("newPassword")}
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-sm text-red-500">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <PasswordInput
                  className="rounded-xl"
                  {...passwordForm.register("confirmPassword")}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {isPasswordFormDirty && (
                <Button type="submit" className="w-full">
                  Update Password
                </Button>
              )}
            </form>
          </div>
        </CardContent>
      </Card>

      <ConfirmModal
        isOpen={showPasswordConfirm}
        onClose={() => setShowPasswordConfirm(false)}
        onConfirm={onSubmitPassword}
        title="Change Password"
        description="Are you sure you want to change your password? This action cannot be undone."
        confirmText="Change Password"
      />
    </>
  );
};
