"use client";

import PreviewPremiumFinancingDetails from "@/components/dashboard/agent/preview-premium-financing-details";
import { DeclarationForm } from "@/components/dashboard/declaration/declaration-form";
import ApprovalScreen from "@/components/dashboard/payment/approval-screen";
import { GhanaCardVerificationStep } from "@/components/dashboard/payment/ghana-card-verification-step";
import { PaymentDetailsStep } from "@/components/dashboard/payment/payment-details-step";
import { RepaymentSchedulePreviewStep } from "@/components/dashboard/payment/repayment-schedule-preview-step";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stepper, type Step } from "@/components/ui/stepper";
import WidthConstraint from "@/components/ui/width-constraint";
import {
  useDecryptPremiumFinancing,
  usePremiumFinancingById,
} from "@/hooks/use-premium-financing";
import { useSubmitCustomerQuotePayment } from "@/hooks/use-submit-customer-quote-payment";
import {
  CUSTOMER_SELF_VERIFICATION_STEPS,
  MainProductQuoteType,
  UPLOADS_BASE_URL,
} from "@/lib/constants";
import { customerSelfVerificationAtom } from "@/lib/store";
import type { PaymentVerificationState } from "@/lib/store/payment-verification";
import { useAtom } from "jotai";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

const CustomerPremiumFinancingVerificationPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  // Decode the token from URL to handle URL-encoded characters (e.g., %3A -> :)
  const rawToken = params?.id as string;
  const token = rawToken ? decodeURIComponent(rawToken) : "";

  const { decryptPremiumFinancing } = useDecryptPremiumFinancing();
  const [customerVerification, setCustomerVerification] = useAtom(
    customerSelfVerificationAtom
  );

  const [currentStep, setCurrentStep] = React.useState(1);
  const [approvalDetails, setApprovalDetails] = React.useState<{
    paymentId: string;
    network: string;
    refId: string;
    accountNumber: string;
    pfId?: string;
  } | null>(null);
  const hasDecrypted = React.useRef(false);

  React.useEffect(() => {
    // Call decrypt only once on first load when token is available
    if (!token || hasDecrypted.current) return;

    hasDecrypted.current = true;
    decryptPremiumFinancing.mutateAsync({ token }).catch((error) => {
      console.error("Failed to decrypt premium financing token", error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const financingId = decryptPremiumFinancing.data?.id;

  const entityIdFromQuery = searchParams.get("entityId");
  const entityId = financingId || entityIdFromQuery || "";

  const { getPremiumFinancingById } = usePremiumFinancingById(financingId || "");
  const premiumFinancing = getPremiumFinancingById.data;
  // Product type must come from the params on the link – do not default it here
  const productTypeParam = premiumFinancing?.quoteType as MainProductQuoteType | null;

  // Extract premium amount from financing data
  const premiumAmount = premiumFinancing ? parseFloat(premiumFinancing.premiumAmount) : 0;

  // Get verification state from atom
  const isGhanaVerified = customerVerification.ghanaVerified;
  const isDeclarationAccepted = customerVerification.declarationAccepted;
  const signatureFilename = customerVerification.signatureFilename;
  const declarations = customerVerification.declarations;

  // Update verification state helper
  const updateVerificationState = React.useCallback(
    async (updates: Partial<PaymentVerificationState>) => {
      setCustomerVerification((prev) => {
        return {
          ...prev,
          ...updates,
          // Preserve fields that aren't being updated
          ghanaVerified: updates.ghanaVerified ?? prev.ghanaVerified,
          declarationAccepted: updates.declarationAccepted ?? prev.declarationAccepted,
          declarations: updates.declarations ?? prev.declarations,
          paymentData: updates.paymentData ?? prev.paymentData,
          signatureFilename: updates.signatureFilename ?? prev.signatureFilename,
          ghanaCardId: updates.ghanaCardId ?? prev.ghanaCardId,
          ghanaCardNumber: updates.ghanaCardNumber ?? prev.ghanaCardNumber,
        };
      });
    },
    [setCustomerVerification]
  );

  // Payment submission hook
  const { submitPayment, isSubmitting: isPaymentSubmitting } =
    useSubmitCustomerQuotePayment({
      pfId: premiumFinancing?.id || "",
      premiumAmount,
      customerId: premiumFinancing?.userID || "",
      selectedCompanyId: premiumFinancing?.companyID || "",
      selectedQuoteId: premiumFinancing?.entityid || "",
      type: "premium-financing",
      quoteType: productTypeParam!,
      isInstallment: false,
    });
  if (decryptPremiumFinancing.isPending && !decryptPremiumFinancing.data) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Preparing your verification link...
        </p>
      </div>
    );
  }

  if (!entityId || !financingId) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Invalid verification link</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We couldn&apos;t find the premium financing details for this link. It may be
              invalid or expired. Please contact your insurance agent for a new link.
            </p>
            {decryptPremiumFinancing.error && (
              <p className="mt-2 text-xs text-red-500">
                {decryptPremiumFinancing.error.message ||
                  "Unable to decrypt verification token."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const steps: Step[] = CUSTOMER_SELF_VERIFICATION_STEPS;

  return (
    <section className=" flex-col gap-6 py-6">
      <WidthConstraint>
        <Card>
          <CardHeader>
            <CardTitle>Customer verification steps</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 md:flex-row">
            <div className="flex flex-col gap-6 md:flex-row p-5 w-full">
              <div className="w-full md:w-64 lg:max-h-[500px]">
                <Stepper steps={steps} currentStep={currentStep} className="h-auto" />
              </div>

              <div className="flex-1 space-y-4">
                {currentStep === 1 && (
                  <PreviewPremiumFinancingDetails
                    id={financingId}
                    onNext={(loanData) => {
                      if (loanData) {
                        setCustomerVerification((prev) => ({
                          ...prev,
                          loanCalculated: true,
                          loanData,
                        }));
                      }
                      setCurrentStep(2);
                    }}
                    onCancel={() => setCurrentStep(1)}
                  />
                )}

                {/* Repayment Schedule Preview Step - Now Step 2 */}
                {currentStep === 2 &&
                  (financingId ? (
                    <RepaymentSchedulePreviewStep
                      paymentData={{
                        initialDeposit: String(premiumFinancing?.initialDeposit ?? "0"),
                        totalRepayment: String(premiumFinancing?.totalRepayment ?? "0"),
                        totalPaid: String(premiumFinancing?.totalPaid ?? "0"),
                        loanAmount: String(premiumFinancing?.loanAmount ?? "0"),
                        noofInstallments: Number(premiumFinancing?.noofInstallments ?? 0),
                        paymentFrequency: premiumFinancing?.paymentFrequency || "monthly",
                      }}
                      onNext={() => setCurrentStep(3)}
                      onCancel={() => setCurrentStep(1)}
                    />
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <p className="text-muted-foreground text-sm sm:text-base">
                        Premium finance ID is required to view repayment schedule
                      </p>
                    </div>
                  ))}

                {currentStep === 3 && (
                  <GhanaCardVerificationStep
                    userEmail=""
                    userPhone=""
                    ghanaCardNumber={null}
                    onSuccess={async (
                      ghanaCardResponse,
                      verificationId,
                      ghanaCardNumber
                    ) => {
                      await updateVerificationState({
                        ghanaVerified: true,
                        ghanaCardId: verificationId,
                        ghanaCardNumber: ghanaCardNumber,
                        ghanaCardResponse: ghanaCardResponse,
                      });
                      setCurrentStep(4);
                    }}
                  />
                )}

                {currentStep === 4 && (
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
                      setCurrentStep(5);
                    }}
                    onCancel={() => setCurrentStep(3)}
                  />
                )}

                {currentStep === 5 &&
                  (productTypeParam ? (
                    isGhanaVerified && isDeclarationAccepted ? (
                      <PaymentDetailsStep
                        premiumAmount={premiumAmount}
                        selectedCompanyId={premiumFinancing?.companyID || ""}
                        quoteType={productTypeParam}
                        type="premium-financing"
                        verificationAtom={customerSelfVerificationAtom}
                        onNext={async () => {
                          // Submit payment using hook (validation happens inside hook)
                          const details = await submitPayment();
                          if (details) {
                            setApprovalDetails(details);
                            setCurrentStep(6);
                          }
                        }}
                        onCancel={() => setCurrentStep(4)}
                        isLoading={isPaymentSubmitting}
                      />
                    ) : (
                      <div className="text-center py-6 sm:py-8">
                        <p className="text-muted-foreground text-sm sm:text-base">
                          {!isGhanaVerified
                            ? "Please complete Ghana card verification first"
                            : "Please complete the previous steps first"}
                        </p>
                      </div>
                    )
                  ) : (
                    <p className="text-sm text-red-500">
                      Missing product type for this verification link. Please contact your
                      insurance agent to resend the correct link.
                    </p>
                  ))}

                {/* Verify Payment Step */}
                {currentStep === 6 && approvalDetails && (
                  <ApprovalScreen
                    type="premium-financing"
                    paymentId={approvalDetails.paymentId}
                    network={approvalDetails.network}
                    refId={approvalDetails.refId}
                    accountNumber={approvalDetails.accountNumber}
                    pfId={approvalDetails.pfId}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </WidthConstraint>
    </section>
  );
};

export default CustomerPremiumFinancingVerificationPage;
