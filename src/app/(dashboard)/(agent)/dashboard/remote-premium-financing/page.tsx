"use client";

import { CustomerVerificationLinkStep } from "@/components/dashboard/agent/customer-verification-link-step";
import { LoanCalculationStep } from "@/components/dashboard/payment/loan-calculation-step";
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
import { paymentVerificationAtom } from "@/lib/store";
import { transformProductTypeToQuoteType } from "@/lib/utils";
import { convertDurationForPaymentFrequency } from "@/lib/utils/payments";
import { useAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import React from "react";

const AgentRemotePremiumFinancingPage = () => {
  const searchParams = useSearchParams();
  const [paymentVerification] = useAtom(paymentVerificationAtom);
  const { setupPremiumFinancing } = useSetupPremiumFinancing();
  const { agent } = useAgent();

  const [currentStep, setCurrentStep] = React.useState<1 | 2>(1);
  const [linkSent, setLinkSent] = React.useState(false);

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

  const handleGenerateLink = async () => {
    const loanData = paymentVerification.loanData;
    if (!agent) {
      console.warn("Agent not found");
      return;
    }

    if (!loanData) {
      console.warn("Loan data missing when trying to set up premium financing");
    }

    const finalDuration = loanData?.duration ?? 0;
    const finalPaymentFrequency = loanData?.paymentFrequency ?? "monthly";

    // Convert duration based on payment frequency (same as other premium financing flows)
    const convertedDuration = convertDurationForPaymentFrequency(
      finalDuration,
      finalPaymentFrequency
    );

    try {
      await setupPremiumFinancing.mutateAsync({
        premiumAmount: premiumAmount,
        initialDeposit: loanData?.initialDeposit ?? 0,
        duration: convertedDuration,
        paymentFrequency: finalPaymentFrequency,
        quoteType: transformProductTypeToQuoteType(productType),
        userID: customerId,
        userAgentID: agent?.id,
        companyID: companyId,
        entityid: requestId,
      });

      // Link is sent directly to customer's email/SMS by the backend
      setLinkSent(true);
    } catch (error) {
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
                  onNext={() => setCurrentStep(2)}
                  onCancel={() => window.history.back()}
                  nextButtonLabel="Proceed to next"
                />
              )}

              {currentStep === 2 && (
                <CustomerVerificationLinkStep
                  linkSent={linkSent}
                  onGenerateLink={handleGenerateLink}
                  onCancel={() => window.history.back()}
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

export default AgentRemotePremiumFinancingPage;
