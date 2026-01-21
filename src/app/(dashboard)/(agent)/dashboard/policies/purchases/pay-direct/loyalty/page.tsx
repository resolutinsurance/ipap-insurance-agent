"use client";
import { DeclarationForm } from "@/components/dashboard/declaration/declaration-form";
import ApprovalScreen from "@/components/dashboard/payment/approval-screen";
import { GhanaCardVerificationStep } from "@/components/dashboard/payment/ghana-card-verification-step";
import { LoanCalculationStep } from "@/components/dashboard/payment/loan-calculation-step";
import { PaymentDetailsStep } from "@/components/dashboard/payment/payment-details-step";
import { Card, CardContent } from "@/components/ui/card";
import { Stepper, type Step } from "@/components/ui/stepper";
import WidthConstraint from "@/components/ui/width-constraint";
import { usePaymentVerification } from "@/hooks/use-payment-verification";
import {
  useQuotePremiumAmount,
  type ProductTypeForPremium,
} from "@/hooks/use-quote-premium-amount";
import { useSubmitLoyaltyPayment } from "@/hooks/use-submit-loyalty-payment";
import { getStandardPaymentSteps, UPLOADS_BASE_URL } from "@/lib/constants";
import {
  getDefaultPaymentVerificationState,
  loyaltyPaymentVerificationAtom,
} from "@/lib/store";
import type { PaymentVerificationState } from "@/lib/store/payment-verification";
import { transformProductTypeToQuoteType } from "@/lib/utils";
import { useAtom } from "jotai";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const PaymentDirectPage = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [loyaltyVerification, setLoyaltyVerification] = useAtom(
    loyaltyPaymentVerificationAtom
  );

  const productType = (searchParams.get("productType") ||
    "buy-money-insurance") as ProductTypeForPremium;
  const companyId = searchParams.get("companyId") || "";
  const quoteId = searchParams.get("requestId") || "";
  const paymentType = (searchParams.get("type") || "one-time") as
    | "premium-financing"
    | "one-time";
  const customerId = searchParams.get("cId") || "";
  const policyId = searchParams.get("policyId") || "";
  const currentStep = Number(searchParams.get("step") || "1") || 1;
  const [justVerified, setJustVerified] = React.useState(false);

  // Get verification state directly from Jotai atom (no session key needed since sessionStorage is session-specific)
  const quoteVerificationState = loyaltyVerification || {
    ghanaVerified: false,
    loanCalculated: false,
    declarationAccepted: false,
    loanData: undefined,
    signatureFilename: undefined,
  };

  const isLoanCalculated = quoteVerificationState.loanCalculated;
  const isDeclarationAccepted = quoteVerificationState.declarationAccepted;
  const signatureFilename = quoteVerificationState.signatureFilename;
  const declarations = quoteVerificationState.declarations;

  const isPremiumFinancing = paymentType === "premium-financing";
  const isInstallment = searchParams.get("isInstallment") === "true";

  // Use shared hook to fetch quote data and calculate premium amount
  const { premiumAmount } = useQuotePremiumAmount({
    productType,
    quoteId,
    policyId,
  });

  const quoteType = transformProductTypeToQuoteType(productType);

  // Payment submission hook
  const { submitPayment, isSubmitting: isPaymentSubmitting } = useSubmitLoyaltyPayment({
    premiumAmount,
    customerId,
    selectedCompanyId: companyId,
    selectedQuoteId: quoteId,
    type: paymentType,
    quoteType,
    isInstallment,
  });

  // Dynamic steps based on payment type
  const steps: Step[] = React.useMemo(
    () => getStandardPaymentSteps(isPremiumFinancing, isInstallment),
    [isPremiumFinancing, isInstallment]
  );

  // Update verification state helper
  // Helper function to convert File to base64 string for storage

  const updateVerificationState = React.useCallback(
    async (updates: Partial<PaymentVerificationState>) => {
      setLoyaltyVerification((prev) => {
        return {
          ...prev,
          type: "loyalty", // Ensure type is set
          ...updates,
          // Preserve loanData if it exists and not being updated
          loanData: updates.loanData || prev.loanData,
          // Preserve other fields that aren't being updated
          ghanaVerified: updates.ghanaVerified ?? prev.ghanaVerified,
          loanCalculated: updates.loanCalculated ?? prev.loanCalculated,
          declarationAccepted: updates.declarationAccepted ?? prev.declarationAccepted,
          declarations: updates.declarations ?? prev.declarations,
          paymentData: updates.paymentData ?? prev.paymentData,
          signatureFilename: updates.signatureFilename ?? prev.signatureFilename,
        };
      });
    },
    [setLoyaltyVerification]
  );

  // Determine which step index corresponds to which action
  const getStepIndex = (stepName: string): number => {
    if (stepName === "verification") return 1;
    if (isPremiumFinancing && !isInstallment) {
      if (stepName === "loan-calculation") return 2;
      if (stepName === "declaration") return 3;
      if (stepName === "payment-details") return 4;
      if (stepName === "verify") return 5;
    } else {
      if (stepName === "declaration") return 2;
      if (stepName === "payment-details") return 3;
      if (stepName === "verify") return 4;
    }
    return 1;
  };

  const [approvalDetails, setApprovalDetails] = React.useState<{
    paymentId: string;
    network: string;
    refId: string;
    accountNumber: string;
    pfId?: string;
  } | null>(null);

  // Get user data for verification (but always require verification, don't check status)
  const { user: verificationUser, isLoading: isVerificationLoading } =
    usePaymentVerification({ customerId });

  // Determine if verification is complete
  // Verification is complete when both verification ID and Ghana card number have been collected successfully
  const isVerificationComplete = React.useMemo(() => {
    // Check if verification ID exists (from public verification)
    const hasVerificationId =
      !!quoteVerificationState.ghanaCardId &&
      quoteVerificationState.ghanaCardId.trim() !== "";
    // Check if Ghana card number was collected
    const hasGhanaCardNumber =
      !!quoteVerificationState.ghanaCardNumber &&
      quoteVerificationState.ghanaCardNumber.trim() !== "";
    // Check if verification was marked as complete
    const isVerified = quoteVerificationState.ghanaVerified;

    // All three must be present: verification ID, Ghana card number, and verification status
    return hasVerificationId && hasGhanaCardNumber && isVerified;
  }, [
    quoteVerificationState.ghanaCardId,
    quoteVerificationState.ghanaCardNumber,
    quoteVerificationState.ghanaVerified,
  ]);

  // Clear verification state when quoteId or customerId changes (new payment session)
  // Since sessionStorage is already session-specific, we just reset to initial state
  React.useEffect(() => {
    // Reset to initial state when starting a new payment session
    setLoyaltyVerification(getDefaultPaymentVerificationState("loyalty"));
  }, [quoteId, customerId, setLoyaltyVerification]);

  // Enforce verification requirement
  React.useEffect(() => {
    if (
      currentStep > 1 &&
      !isVerificationLoading &&
      !isVerificationComplete &&
      !justVerified
    ) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", "1");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [
    currentStep,
    isVerificationLoading,
    isVerificationComplete,
    justVerified,
    pathname,
    router,
    searchParams,
  ]);

  const goToStep = (step: number) => {
    if (step > 1 && !isVerificationComplete && !justVerified) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", "1");
      router.replace(`${pathname}?${params.toString()}`);
      return;
    }

    const nextStep = Math.max(1, Math.min(step, steps.length));
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", String(nextStep));
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="">
      <Card>
        <CardContent>
          <WidthConstraint className="space-y-4 sm:space-y-5 p-5">
            <div className="flex flex-col lg:flex-row gap-6 sm:gap-10">
              <Stepper
                steps={steps}
                currentStep={currentStep}
                className="w-full lg:w-[320px] h-auto lg:h-[120px]"
              />

              <div className="flex-1 max-w-xl">
                {currentStep === 1 &&
                  (isVerificationLoading ? (
                    <div className="text-center py-6 sm:py-8">
                      <p className="text-muted-foreground text-sm sm:text-base">
                        Loading user information...
                      </p>
                    </div>
                  ) : verificationUser ? (
                    <GhanaCardVerificationStep
                      userEmail={verificationUser.email}
                      userPhone={verificationUser.phone}
                      ghanaCardNumber={verificationUser.GhcardNo}
                      onSuccess={(ghanaCardResponse, verificationId, ghanaCardNumber) => {
                        setJustVerified(true);
                        setLoyaltyVerification((prev) => ({
                          ...prev,
                          ghanaVerified: true,
                          ghanaCardId: verificationId,
                          ghanaCardNumber: ghanaCardNumber,
                          ghanaCardResponse: ghanaCardResponse,
                          declarationAccepted: prev.declarationAccepted || false,
                        }));
                        goToStep(2);
                      }}
                      onCancel={() => router.back()}
                    />
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <p className="text-muted-foreground text-sm sm:text-base">
                        Unable to load user information. Please try again.
                      </p>
                    </div>
                  ))}

                {/* Loan Calculation Step (Premium Financing only, not installments) */}
                {currentStep === getStepIndex("loan-calculation") &&
                  isPremiumFinancing &&
                  !isInstallment &&
                  (isVerificationComplete ? (
                    <LoanCalculationStep
                      premiumAmount={premiumAmount}
                      quoteType={quoteType}
                      verificationAtom={loyaltyPaymentVerificationAtom}
                      onNext={async () => {
                        // Get the latest loanData from state before marking as calculated
                        const latestLoanData = loyaltyVerification.loanData;

                        // Ensure loanData is saved and mark as calculated
                        await updateVerificationState({
                          loanCalculated: true,
                          loanData: latestLoanData, // Preserve loanData
                        });
                        goToStep(getStepIndex("declaration"));
                      }}
                      onCancel={() => goToStep(currentStep - 1)}
                    />
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <p className="text-muted-foreground text-sm sm:text-base">
                        Please complete Ghana card verification first
                      </p>
                    </div>
                  ))}

                {/* Declaration Step */}
                {currentStep === getStepIndex("declaration") &&
                  (isVerificationComplete &&
                  (!isPremiumFinancing || isInstallment || isLoanCalculated) ? (
                    <DeclarationForm
                      updateVerificationState={updateVerificationState}
                      initialDeclarations={declarations}
                      initialSignature={
                        signatureFilename
                          ? `${UPLOADS_BASE_URL}${signatureFilename}`
                          : undefined
                      }
                      skipQuoteUpdate={true}
                      onSuccess={async (sigFilename) => {
                        await updateVerificationState({
                          declarationAccepted: true,
                          signatureFilename: sigFilename,
                        });
                        goToStep(getStepIndex("payment-details"));
                      }}
                      onCancel={() => goToStep(currentStep - 1)}
                    />
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <p className="text-muted-foreground text-sm sm:text-base">
                        {!isVerificationComplete
                          ? "Please complete Ghana card verification first"
                          : "Please complete the previous steps first"}
                      </p>
                    </div>
                  ))}

                {/* Payment Details Step */}
                {currentStep === getStepIndex("payment-details") &&
                  (isVerificationComplete && isDeclarationAccepted ? (
                    <PaymentDetailsStep
                      premiumAmount={premiumAmount}
                      selectedCompanyId={companyId}
                      quoteType={quoteType}
                      type={paymentType}
                      onNext={async () => {
                        // Submit payment using hook
                        const details = await submitPayment();
                        if (details) {
                          setApprovalDetails(details);
                          goToStep(getStepIndex("verify"));
                        }
                      }}
                      onCancel={() => goToStep(currentStep - 1)}
                      isLoading={isPaymentSubmitting}
                    />
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <p className="text-muted-foreground text-sm sm:text-base">
                        {!isVerificationComplete
                          ? "Please complete Ghana card verification first"
                          : "Please complete the previous steps first"}
                      </p>
                    </div>
                  ))}

                {/* Verify Payment Step */}
                {currentStep === getStepIndex("verify") && approvalDetails && (
                  <ApprovalScreen
                    type={paymentType}
                    paymentId={approvalDetails.paymentId}
                    network={approvalDetails.network}
                    refId={approvalDetails.refId}
                    accountNumber={approvalDetails.accountNumber}
                    pfId={approvalDetails.pfId}
                  />
                )}
              </div>
            </div>
          </WidthConstraint>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentDirectPage;
