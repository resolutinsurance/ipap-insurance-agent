"use client";

import { CustomerVerificationLinkStep } from "@/components/dashboard/agent/customer-verification-link-step";
import { LoanCalculationStep } from "@/components/dashboard/payment/loan-calculation-step";
import { RepaymentSchedulePreviewStep } from "@/components/dashboard/payment/repayment-schedule-preview-step";
import { Card, CardContent } from "@/components/ui/card";
import { Stepper, type Step } from "@/components/ui/stepper";
import WidthConstraint from "@/components/ui/width-constraint";
import { useAgent } from "@/hooks/use-agent";
import { useSetupPremiumFinancing } from "@/hooks/use-premium-financing";
import {
  useQuotePremiumAmount,
  type ProductTypeForPremium,
} from "@/hooks/use-quote-premium-amount";
import { AGENT_REMOTE_PREMIUM_FINANCING_STEPS } from "@/lib/constants";
import { remotePremiumFinancingAtom } from "@/lib/store";
import { transformProductTypeToQuoteType } from "@/lib/utils";
import { convertDurationForPaymentFrequency } from "@/lib/utils/payments";
import { goToStepInUrl } from "@/lib/utils/step-navigation";
import { useAtom } from "jotai";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const AgentRemotePremiumFinancing = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [paymentVerification] = useAtom(remotePremiumFinancingAtom);
  const { setupPremiumFinancing } = useSetupPremiumFinancing();
  const { agent } = useAgent();

  const currentStep = (Number(searchParams.get("step") || "1") || 1) as 1 | 2 | 3;
  const [linkSent, setLinkSent] = React.useState(false);
  const [clientLink, setClientLink] = React.useState<string | null>(null);

  const requestId = searchParams.get("requestId");
  const companyId = searchParams.get("companyId") || "";
  const customerId = searchParams.get("cId") || "";
  const policyId = searchParams.get("policyId") || "";
  const productType = (searchParams.get("productType") ||
    "thirdparty") as ProductTypeForPremium;

  // Use shared hook to fetch quote data and calculate premium amount
  const { premiumAmount } = useQuotePremiumAmount({
    productType,
    quoteId: requestId || "",
    policyId: policyId || "",
  });

  if (!requestId || !productType || !customerId || !companyId) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Missing information for remote premium financing. Please return and start again.
        </p>
      </div>
    );
  }

  const goToStep = (step: number) => {
    goToStepInUrl({
      router,
      pathname,
      searchParams,
      step,
      maxStep: 3,
    });
  };

  const handleGenerateLink = async () => {
    const loanData = paymentVerification.loanData;
    if (!agent) {
      toast.error("Agent not found. Please try again.");
      console.warn("Agent not found");
      return;
    }

    if (!loanData) {
      toast.error("Loan data is missing. Please complete the loan calculation step.");
      console.warn("Loan data missing when trying to set up premium financing");
      return;
    }

    const finalDuration = loanData?.duration ?? 0;
    const finalPaymentFrequency = loanData?.paymentFrequency ?? "monthly";

    // Convert duration based on payment frequency (same as other premium financing flows)
    const convertedDuration = convertDurationForPaymentFrequency(
      finalDuration,
      finalPaymentFrequency
    );

    try {
      const response = await setupPremiumFinancing.mutateAsync({
        premiumAmount: premiumAmount,
        initialDeposit: loanData?.initialDeposit ?? 0,
        duration: convertedDuration,
        paymentFrequency: finalPaymentFrequency,
        quoteType: transformProductTypeToQuoteType(productType),
        userID: customerId,
        userAgentID: agent?.id,
        companyID: companyId,
        entityid: requestId,
        fromAgent: true,
      });

      if (response.encryptedClientLink) {
        setClientLink(response.encryptedClientLink);
      }
      // Link is sent directly to customer's email/SMS by the backend
      setLinkSent(true);
      toast.success("Verification link sent successfully to the customer!");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to generate verification link. Please try again.";
      toast.error(errorMessage);
      console.error("Failed to set up premium financing for remote verification", error);
    }
  };

  const steps: Step[] = AGENT_REMOTE_PREMIUM_FINANCING_STEPS;

  return (
    <section>
      <Card>
        <CardContent className="flex flex-col gap-6 md:flex-row">
          <WidthConstraint className="flex flex-col lg:flex-row gap-6 sm:gap-10 mx-0 p-5">
            <div className="w-full md:w-80">
              <Stepper steps={steps} currentStep={currentStep} className="h-auto" />
            </div>

            <div className="flex-1 space-y-4">
              {currentStep === 1 && (
                <LoanCalculationStep
                  premiumAmount={premiumAmount}
                  quoteType={transformProductTypeToQuoteType(productType)}
                  verificationAtom={remotePremiumFinancingAtom}
                  onNext={() => goToStep(2)}
                  onCancel={() => window.history.back()}
                  nextButtonLabel="Proceed to next"
                />
              )}

              {currentStep === 2 &&
                (paymentVerification.loanData?.noofInstallments &&
                paymentVerification.loanData?.loanAmount != null &&
                paymentVerification.loanData?.totalRepayment != null &&
                paymentVerification.loanData?.totalPaid != null ? (
                  <RepaymentSchedulePreviewStep
                    paymentData={{
                      initialDeposit: String(
                        paymentVerification.loanData?.initialDeposit ?? 0
                      ),
                      totalRepayment: String(
                        paymentVerification.loanData?.totalRepayment ?? 0
                      ),
                      totalPaid: String(paymentVerification.loanData?.totalPaid ?? 0),
                      loanAmount: String(paymentVerification.loanData?.loanAmount ?? 0),
                      noofInstallments: Number(
                        paymentVerification.loanData?.noofInstallments ?? 0
                      ),
                      paymentFrequency:
                        paymentVerification.loanData?.paymentFrequency || "monthly",
                    }}
                    onNext={() => goToStep(3)}
                    onCancel={() => goToStep(1)}
                  />
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <p className="text-muted-foreground text-sm sm:text-base">
                      Please complete loan calculation to view repayment schedule
                    </p>
                  </div>
                ))}

              {currentStep === 3 && (
                <CustomerVerificationLinkStep
                  linkSent={linkSent}
                  onGenerateLink={handleGenerateLink}
                  onCancel={() => goToStep(2)}
                  clientLink={clientLink}
                  isGenerating={setupPremiumFinancing.isPending}
                />
              )}
            </div>
          </WidthConstraint>
        </CardContent>
      </Card>
    </section>
  );
};

export default AgentRemotePremiumFinancing;
