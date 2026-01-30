"use client";

import { DurationSelector } from "@/components/quote-payments/duration-selector";
import { PaymentFrequencySelector } from "@/components/quote-payments/payment-frequency-selector";
import { PremiumFinancingSummary } from "@/components/quote-payments/premium-financing-summary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAutoCalculatePremiumFinancing } from "@/hooks/use-premium-financing";
import { MainProductQuoteType } from "@/lib/constants";
import { DEFAULT_LOAN_DATA } from "@/lib/constants/payment-steps";
import { PaymentFrequency } from "@/lib/interfaces";
import { paymentVerificationAtom } from "@/lib/store";
import type { PaymentVerificationState } from "@/lib/store/payment-verification";
import { formatCurrencyToGHS } from "@/lib/utils";
import { useAtom, WritableAtom } from "jotai";
import React, { SetStateAction } from "react";

interface LoanCalculationStepProps {
  premiumAmount: number;
  onNext: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  quoteType: MainProductQuoteType;
  nextButtonLabel?: string;
  verificationAtom?: WritableAtom<
    PaymentVerificationState,
    [SetStateAction<PaymentVerificationState>],
    void
  >;
}

export function LoanCalculationStep({
  premiumAmount,
  onNext,
  onCancel,
  isLoading = false,
  quoteType,
  nextButtonLabel = "Continue to Declaration",
  verificationAtom = paymentVerificationAtom,
}: LoanCalculationStepProps) {
  const [paymentVerification, setPaymentVerification] = useAtom(verificationAtom);
  // Read initial values from Jotai state (directly, no session key)
  const loanData = paymentVerification.loanData || DEFAULT_LOAN_DATA;

  const [initialDeposit, setInitialDeposit] = React.useState(loanData.initialDeposit);
  const [duration, setDuration] = React.useState(loanData.duration);
  const [paymentFrequency, setPaymentFrequency] = React.useState<PaymentFrequency>(
    loanData.paymentFrequency
  );

  // Update Jotai state immediately when values change
  // Use functional update to avoid stale closure issues
  const updateLoanData = React.useCallback(
    (updates: Partial<PaymentVerificationState["loanData"]>) => {
      setPaymentVerification((prev) => {
        const currentLoanData = prev.loanData || DEFAULT_LOAN_DATA;
        return {
          ...prev,
          loanData: {
            ...currentLoanData,
            ...updates,
          },
        };
      });
    },
    [setPaymentVerification]
  );

  const handleInitialDepositChange = (value: number) => {
    setInitialDeposit(value);
    updateLoanData({ initialDeposit: value });
  };

  const handleDurationChange = (value: number) => {
    setDuration(value);
    updateLoanData({ duration: value });
  };

  const handlePaymentFrequencyChange = (value: PaymentFrequency) => {
    setPaymentFrequency(value);
    updateLoanData({ paymentFrequency: value });
  };

  const { calculatePremiumFinancingData } = useAutoCalculatePremiumFinancing({
    premiumAmount,
    initialDeposit,
    duration,
    paymentFrequency,
    type: "premium-financing",
    quoteType: quoteType,
    enabled: true,
  });

  const canProceed =
    !!calculatePremiumFinancingData.data && !calculatePremiumFinancingData.isPending;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Loan Calculation</h2>
        <p className="text-gray-600 mt-2">
          Configure your loan terms to see the payment schedule and proceed with payment
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg space-y-2">
          <h4 className="font-semibold text-sm">Premium Amount</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="text-sm">
              <span className="text-gray-600">Net premium amount:</span>
              <span className="font-medium ml-2">
                {formatCurrencyToGHS(premiumAmount)}
              </span>
            </div>
          </div>
        </div>
        <DurationSelector value={duration} onChange={handleDurationChange} />
        <PaymentFrequencySelector
          value={paymentFrequency}
          onChange={handlePaymentFrequencyChange}
        />
        <div className="space-y-2">
          <Label htmlFor="currentDeposit">Initial Deposit</Label>
          <Input
            id="currentDeposit"
            type="number"
            inputMode="numeric"
            min="0"
            value={initialDeposit === 0 ? "" : initialDeposit}
            onChange={(e) => handleInitialDepositChange(Number(e.target.value) || 0)}
            placeholder="Enter initial deposit"
          />
        </div>

        <PremiumFinancingSummary
          data={calculatePremiumFinancingData.data}
          isLoading={calculatePremiumFinancingData.isPending}
          error={calculatePremiumFinancingData.error}
          enabled={true}
          quoteType={quoteType}
        />
      </div>

      <div className="flex gap-4 justify-end">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
          Previous
        </Button>
        <Button
          type="button"
          onClick={async () => {
            // Ensure final loanData is saved before proceeding
            // Save loanData with all current values
            const finalLoanData = {
              initialDeposit,
              duration,
              paymentFrequency,
              // Persist calculated summary fields (used later for repayment schedule preview)
              ...(calculatePremiumFinancingData.data
                ? {
                    noofInstallments: calculatePremiumFinancingData.data.noofInstallments,
                    loanAmount: calculatePremiumFinancingData.data.loanAmount,
                    totalRepayment: calculatePremiumFinancingData.data.totalRepayment,
                    totalPaid: calculatePremiumFinancingData.data.totalPaid,
                    regularInstallment:
                      calculatePremiumFinancingData.data.regularInstallment,
                    actualProcessingFee:
                      calculatePremiumFinancingData.data.actualProcessingFee,
                    stickerFee: calculatePremiumFinancingData.data.stickerFee,
                  }
                : {}),
            };

            // Update state with final loanData - use functional update to ensure we have latest state
            setPaymentVerification((prev) => {
              const updatedState = {
                ...prev,
                loanData: finalLoanData,
              };

              // Debug: Log to verify loanData is saved
              console.log("LoanCalculationStep: Saving loanData", {
                finalLoanData,
                savedState: updatedState,
              });

              return updatedState;
            });

            // Wait a tick to ensure state is persisted to sessionStorage
            await new Promise((resolve) => setTimeout(resolve, 100));
            // Then proceed to next step
            onNext();
          }}
          disabled={!canProceed || isLoading}
        >
          {isLoading ? "Processing..." : nextButtonLabel}
        </Button>
      </div>
    </div>
  );
}
