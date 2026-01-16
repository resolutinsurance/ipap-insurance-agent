"use client";

import { PremiumFinancingSummary } from "@/components/quote-payments/premium-financing-summary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAutoCalculatePremiumFinancing } from "@/hooks/use-premium-financing";
import { useValidateAccount } from "@/hooks/use-validate-account";
import {
  BANK_CODES,
  MainProductQuoteType,
  MOBILE_MONEY_METHODS,
  PAYMENT_METHODS,
} from "@/lib/constants";
import { paymentVerificationAtom } from "@/lib/store";
import type { PaymentVerificationState } from "@/lib/store/payment-verification";
import { useAtom, WritableAtom } from "jotai";
import React, { SetStateAction, useEffect, useRef } from "react";
import { toast } from "sonner";

interface PaymentDetailsStepProps {
  premiumAmount: number;
  selectedCompanyId: string;
  quoteType: MainProductQuoteType;
  type?: "one-time" | "premium-financing";
  onNext: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  verificationAtom?: WritableAtom<
    PaymentVerificationState,
    [SetStateAction<PaymentVerificationState>],
    void
  >;
}

export function PaymentDetailsStep({
  premiumAmount,
  selectedCompanyId,
  quoteType,
  type = "one-time",
  onNext,
  onCancel,
  isLoading = false,
  verificationAtom = paymentVerificationAtom,
}: PaymentDetailsStepProps) {
  console.log(selectedCompanyId, quoteType);
  const [paymentVerification, setPaymentVerification] = useAtom(verificationAtom);

  // Read initial values from Jotai state (directly, no session key)
  const defaultPaymentData = React.useMemo(
    () => ({
      method: PAYMENT_METHODS.MOBILE_MONEY,
      methodName: MOBILE_MONEY_METHODS[0].methodName,
      methodCode: MOBILE_MONEY_METHODS[0].methodCode,
      accountName: "",
      accountNumber: "",
    }),
    []
  );

  const paymentData = React.useMemo(
    () => paymentVerification.paymentData || defaultPaymentData,
    [paymentVerification.paymentData, defaultPaymentData]
  );

  const loanData = paymentVerification.loanData;

  const [method, setMethod] = React.useState(paymentData.method);
  const [methodName, setMethodName] = React.useState(paymentData.methodName);
  const [methodCode, setMethodCode] = React.useState(
    paymentData.methodCode || defaultPaymentData.methodCode
  );
  const [accountName, setAccountName] = React.useState(paymentData.accountName);
  const [accountNumber, setAccountNumber] = React.useState(paymentData.accountNumber);
  const validateAccount = useValidateAccount();
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update Jotai state immediately when values change
  const updatePaymentData = React.useCallback(
    (updates: Partial<typeof paymentData>) => {
      setPaymentVerification((prev) => ({
        ...prev,
        paymentData: {
          ...(prev.paymentData || paymentData),
          ...updates,
        },
      }));
    },
    [setPaymentVerification, paymentData]
  );

  // Filter banks - exclude mobile money providers for bank transfer
  const bankTransferBanks = React.useMemo(() => {
    const mobileMoneyCodes = MOBILE_MONEY_METHODS.map((m) => m.methodCode);
    return BANK_CODES.filter((bank) => !mobileMoneyCodes.includes(bank.assigned_code));
  }, []);

  const validateAccountNumber = React.useCallback(
    async (number: string, bankCode: string) => {
      // Only validate if account number is 10 or more characters
      if (!number || !bankCode || number.trim().length < 10) {
        return;
      }

      try {
        const result = await validateAccount.mutateAsync({
          customerNumber: number.trim(),
          bankCode: bankCode,
        });

        if (result.name) {
          setAccountName(result.name);
          updatePaymentData({ accountName: result.name });
        }
      } catch (error) {
        // Silently fail - account name will remain empty
        console.error("Account validation failed:", error);
      }
    },
    [validateAccount, updatePaymentData]
  );

  const handleMethodChange = (value: string) => {
    setMethod(value);
    if (value === PAYMENT_METHODS.MOBILE_MONEY) {
      const defaultMethod = MOBILE_MONEY_METHODS[0];
      setMethodName(defaultMethod.methodName);
      setMethodCode(defaultMethod.methodCode);
      updatePaymentData({
        method: value,
        methodName: defaultMethod.methodName,
        methodCode: defaultMethod.methodCode,
      });
    } else if (value === PAYMENT_METHODS.BANK_TRANSFER) {
      setMethodName("");
      setMethodCode("");
      updatePaymentData({ method: value, methodName: "", methodCode: "" });
    } else {
      // Card payment
      setMethodName("");
      setMethodCode("");
      updatePaymentData({ method: value, methodName: "", methodCode: "" });
    }
    // Clear account name when method changes
    setAccountName("");
    updatePaymentData({ accountName: "" });
  };

  const handleMobileMoneyProviderChange = (value: string) => {
    const selectedMethod = MOBILE_MONEY_METHODS.find((m) => m.methodName === value);
    if (selectedMethod) {
      setMethodName(selectedMethod.methodName);
      setMethodCode(selectedMethod.methodCode);
      updatePaymentData({
        methodName: selectedMethod.methodName,
        methodCode: selectedMethod.methodCode,
      });
      // Clear account name when provider changes to trigger re-validation
      if (accountNumber.trim()) {
        setAccountName("");
        updatePaymentData({ accountName: "" });
        // Trigger validation if account number exists
        if (accountNumber.trim().length >= 10) {
          validateAccountNumber(accountNumber.trim(), selectedMethod.methodCode);
        }
      }
    }
  };

  const handleBankChange = (value: string) => {
    const selectedBank = BANK_CODES.find((b) => b.assigned_code === value);
    if (selectedBank) {
      setMethodName(selectedBank.bank_name);
      setMethodCode(selectedBank.assigned_code);
      updatePaymentData({
        methodName: selectedBank.bank_name,
        methodCode: selectedBank.assigned_code,
      });
      // Clear account name when bank changes to trigger re-validation
      if (accountNumber.trim()) {
        setAccountName("");
        updatePaymentData({ accountName: "" });
        // Trigger validation if account number exists
        if (accountNumber.trim().length >= 10) {
          validateAccountNumber(accountNumber.trim(), selectedBank.assigned_code);
        }
      }
    }
  };

  const handleAccountNumberChange = (value: string) => {
    setAccountNumber(value);
    updatePaymentData({ accountNumber: value });

    // Clear previous timeout
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    // Clear account name when number changes
    setAccountName("");
    updatePaymentData({ accountName: "" });

    // Validate account after user stops typing (debounce)
    if (value.trim().length >= 10 && methodCode) {
      validationTimeoutRef.current = setTimeout(() => {
        validateAccountNumber(value.trim(), methodCode);
      }, 800); // Wait 800ms after user stops typing
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, []);

  // Calculate premium financing summary if needed
  const { calculatePremiumFinancingData } = useAutoCalculatePremiumFinancing({
    premiumAmount,
    initialDeposit: loanData?.initialDeposit || 0,
    duration: loanData?.duration || 12,
    paymentFrequency: loanData?.paymentFrequency || "monthly",
    type: "premium-financing",
    enabled: type === "premium-financing" && !!loanData,
  });

  const handleSubmit = () => {
    // Validate payment method is selected
    if (!method) {
      toast.error("Please select a payment method");
      return;
    }

    // Validate mobile money provider if mobile money is selected
    if (method === PAYMENT_METHODS.MOBILE_MONEY) {
      if (!methodName || !methodCode) {
        toast.error("Please select a mobile money provider");
        return;
      }
      const selectedProvider = MOBILE_MONEY_METHODS.find(
        (m) => m.methodName === methodName
      );
      if (!selectedProvider?.methodCode) {
        toast.error("Invalid mobile money provider selected");
        return;
      }
    }

    // Validate bank if bank transfer is selected
    if (method === PAYMENT_METHODS.BANK_TRANSFER) {
      if (!methodName || !methodCode) {
        toast.error("Please select a bank");
        return;
      }
      const selectedBank = BANK_CODES.find((b) => b.assigned_code === methodCode);
      if (!selectedBank) {
        toast.error("Invalid bank selected");
        return;
      }
    }

    // Validate account name
    if (!accountName.trim()) {
      toast.error("Please enter your account name");
      return;
    }

    // Validate account number
    if (!accountNumber.trim()) {
      toast.error("Please enter your account number");
      return;
    }

    // Validate account number format (should be numeric and reasonable length)
    if (!/^\d{10,15}$/.test(accountNumber.trim())) {
      toast.error("Please enter a valid account number (10-15 digits)");
      return;
    }

    // All validations passed, proceed to next step
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
        <p className="text-gray-600 mt-2">
          Enter your payment method and account information to complete the payment
        </p>
      </div>

      <div className="space-y-4">
        {/* Show loan summary for premium financing */}
        {type === "premium-financing" && loanData && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="initialDepositDisplay">Initial Deposit</Label>
              <Input
                id="initialDepositDisplay"
                type="number"
                value={loanData.initialDeposit}
                readOnly
                className="bg-gray-50"
              />
              <p className="text-sm text-gray-500">
                This amount was set during loan calculation
              </p>
            </div>
            <PremiumFinancingSummary
              data={calculatePremiumFinancingData.data}
              isLoading={calculatePremiumFinancingData.isPending}
              error={calculatePremiumFinancingData.error}
              enabled={true}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="method">Payment Method</Label>
          <Select value={method} onValueChange={handleMethodChange}>
            <SelectTrigger id="method" className="w-full">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PAYMENT_METHODS.MOBILE_MONEY}>Mobile Money</SelectItem>
              <SelectItem value={PAYMENT_METHODS.BANK_TRANSFER} disabled>
                Bank Transfer
              </SelectItem>
              <SelectItem value={PAYMENT_METHODS.CARD}>Card</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {method === PAYMENT_METHODS.MOBILE_MONEY && (
          <div className="space-y-2">
            <Label htmlFor="methodName">Mobile Money Provider</Label>
            <Select value={methodName} onValueChange={handleMobileMoneyProviderChange}>
              <SelectTrigger id="methodName" className="w-full">
                <SelectValue placeholder="Select mobile money provider" />
              </SelectTrigger>
              <SelectContent>
                {MOBILE_MONEY_METHODS.map((m) => (
                  <SelectItem key={m.methodCode} value={m.methodName}>
                    {m.methodName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {method === PAYMENT_METHODS.BANK_TRANSFER && (
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank</Label>
            <Select value={methodCode} onValueChange={handleBankChange}>
              <SelectTrigger id="bankName" className="w-full">
                <SelectValue placeholder="Select bank" />
              </SelectTrigger>
              <SelectContent>
                {bankTransferBanks.map((bank) => (
                  <SelectItem key={bank.assigned_code} value={bank.assigned_code}>
                    {bank.bank_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="accountNumber">Account Number</Label>
          <Input
            id="accountNumber"
            placeholder="Enter account number"
            value={accountNumber}
            onChange={(e) => handleAccountNumberChange(e.target.value)}
            disabled={validateAccount.isPending}
          />
          {validateAccount.isPending && (
            <p className="text-sm text-gray-500">Validating account...</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountName">Account Name</Label>
          <Input
            id="accountName"
            placeholder={
              validateAccount.isPending
                ? "Validating..."
                : accountNumber.trim().length < 10
                ? "Enter account number to validate"
                : "Account name will be auto-filled"
            }
            value={accountName}
            readOnly
            className="bg-gray-50 cursor-not-allowed"
            disabled={validateAccount.isPending}
          />
          {accountName && !validateAccount.isPending && (
            <p className="text-sm text-green-600">Account name validated</p>
          )}
          {accountNumber.trim().length >= 10 &&
            !accountName &&
            !validateAccount.isPending && (
              <p className="text-sm text-amber-600">
                Account validation failed. Please check your account number and try again.
              </p>
            )}
        </div>
      </div>

      <div className="flex gap-4 justify-end">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
          Previous
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Processing..." : "Continue to make payment"}
        </Button>
      </div>
    </div>
  );
}
