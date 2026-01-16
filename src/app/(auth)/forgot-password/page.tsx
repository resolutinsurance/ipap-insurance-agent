"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OTPInput } from "@/components/ui/otp-input";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/lib/constants";
import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
  VerifyPasswordResetCodeFormData,
  verifyPasswordResetCodeSchema,
} from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState<"email" | "verification" | "password">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [isResending, setIsResending] = useState(false);
  const {
    requestPasswordResetCode,
    verifyPasswordResetCodeMutation,
    changeUserPassword,
  } = useAuth();

  const emailForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const passwordForm = useForm<VerifyPasswordResetCodeFormData>({
    resolver: zodResolver(verifyPasswordResetCodeSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmitEmail = async (data: ForgotPasswordFormData) => {
    try {
      await requestPasswordResetCode.mutateAsync(data.email);
      setEmail(data.email);
      setStep("verification");
      toast.success("Reset code sent to your email");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send reset code");
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      toast.error("Please enter the complete verification code");
      return;
    }

    try {
      await verifyPasswordResetCodeMutation.mutateAsync({
        email,
        otp: verificationCode,
      });
      setStep("password");
      toast.success("Code verified successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Verification failed");
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await requestPasswordResetCode.mutateAsync(email);
      toast.success("Reset code resent to your email");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to resend code");
    } finally {
      setIsResending(false);
    }
  };

  const onSubmitPassword = async (data: VerifyPasswordResetCodeFormData) => {
    try {
      await changeUserPassword.mutateAsync({
        email,
        password: data.password,
      });
      toast.success("Password changed successfully");
      window.location.href = ROUTES.LOGIN;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to change password");
    }
  };

  return (
    <div className="flex items-center justify-center bg-background h-full">
      <div className="w-full max-w-[500px] space-y-8 p-8">
        {step === "email" && (
          <>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Forgot your password?</h1>
              <p className="text-sm text-muted-foreground">
                Please enter the email address associated with your account and we will
                email you a link to reset your password.
              </p>
            </div>

            <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...emailForm.register("email")}
                />
                {emailForm.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {emailForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={requestPasswordResetCode.isPending}
              >
                {requestPasswordResetCode.isPending
                  ? "Sending..."
                  : "Send reset password code"}
              </Button>
            </form>
          </>
        )}

        {step === "verification" && (
          <>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">Verify Your Email</h1>
              <p className="text-sm text-muted-foreground">
                We sent a verification code to {email}. Enter the code below to reset your
                password.
              </p>
            </div>

            <div className="space-y-4">
              <Label className="block text-sm font-medium">
                Enter the 6-digit verification code
              </Label>
              <OTPInput value={code} onChange={setCode} />
            </div>

            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={handleVerify}
                disabled={
                  code.some((digit) => !digit) ||
                  verifyPasswordResetCodeMutation.isPending
                }
              >
                {verifyPasswordResetCodeMutation.isPending
                  ? "Verifying..."
                  : "Verify Code"}
              </Button>

              <p className="text-sm text-muted-foreground">
                Didn&apos;t receive the code?{" "}
                <button
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-primary hover:underline disabled:opacity-50"
                >
                  {isResending ? "Resending..." : "Resend"}
                </button>
              </p>
            </div>
          </>
        )}

        {step === "password" && (
          <>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">Reset Your Password</h1>
              <p className="text-sm text-muted-foreground">
                Please enter your new password below.
              </p>
            </div>

            <form
              onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <PasswordInput
                  id="password"
                  placeholder="Enter your new password"
                  {...passwordForm.register("password")}
                />
                {passwordForm.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {passwordForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="Confirm your new password"
                  {...passwordForm.register("confirmPassword")}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {passwordForm.formState.errors.confirmPassword.message}
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
        )}

        <Button asChild variant="outline" className="w-full">
          <Link href="/sign-in">Back to sign in</Link>
        </Button>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
