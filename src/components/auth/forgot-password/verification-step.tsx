"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { OTPInput } from "@/components/ui/otp-input";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { toast } from "sonner";

interface VerificationStepProps {
  email: string;
  onSuccess: () => void;
}

export const VerificationStep = ({ email, onSuccess }: VerificationStepProps) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [isResending, setIsResending] = useState(false);
  const {
    requestPasswordResetCode,
    verifyPasswordResetCodeMutation,
  } = useAuth();

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
      toast.success("Code verified successfully");
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Verification failed"
      );
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await requestPasswordResetCode.mutateAsync(email);
      toast.success("Reset code resent to your email");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to resend code"
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Verify Your Email</h1>
        <p className="text-sm text-muted-foreground">
          We sent a verification code to {email}. Enter the code below to reset
          your password.
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
  );
};
