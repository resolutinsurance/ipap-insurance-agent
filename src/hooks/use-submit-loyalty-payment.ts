import { useAgent } from "@/hooks/use-agent";
import { useAuth } from "@/hooks/use-auth";
import useGeneratePDF from "@/hooks/use-generate-pdf";
import { usePurchaseWithPremiumFinancing } from "@/hooks/use-premium-financing";
import { useQuotePayments } from "@/hooks/use-quote-payments";
import {
  COOKIE_KEYS,
  MOBILE_MONEY_METHODS,
  MainProductQuoteType,
  USER_TYPES,
} from "@/lib/constants";
import {
  QuotePaymentRequest,
  QuotePaymentRequestWithPremiumFinancing,
} from "@/lib/interfaces";
import { updatePremiumFinancing } from "@/lib/services/premium-financing";
import { updateQuotePayment } from "@/lib/services/quote-requests/quote-payments";
import { loyaltyPaymentVerificationAtom } from "@/lib/store";
import {
  convertDurationForPaymentFrequency,
  parsePremiumAmount,
} from "@/lib/utils/payments";
import { useAtom } from "jotai";
import Cookies from "js-cookie";
import React from "react";
import { toast } from "sonner";

interface UseSubmitLoyaltyPaymentParams {
  premiumAmount: number;
  customerId?: string;
  selectedCompanyId: string;
  selectedQuoteId: string;
  type?: "one-time" | "premium-financing";
  quoteType: MainProductQuoteType;
  isInstallment?: boolean;
  installmentDuration?: number;
  installmentPaymentFrequency?: string;
}

export function useSubmitLoyaltyPayment({
  premiumAmount,
  customerId,
  selectedCompanyId,
  selectedQuoteId,
  type = "one-time",
  quoteType,
  isInstallment = false,
  installmentDuration,
  installmentPaymentFrequency,
}: UseSubmitLoyaltyPaymentParams) {
  const { user, userType } = useAuth();
  const { agent } = useAgent();
  const [loyaltyVerification] = useAtom(loyaltyPaymentVerificationAtom);
  const { makeQuotePayment } = useQuotePayments();
  const { purchaseWithPremiumFinancing } = usePurchaseWithPremiumFinancing();
  const { generatePDF } = useGeneratePDF();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const submitPayment = React.useCallback(async () => {
    setIsSubmitting(true);
    try {
      // Read all data from Jotai state (directly, no session key)
      const loanData = loyaltyVerification.loanData;
      const paymentData = loyaltyVerification.paymentData;
      const signatureFilename = loyaltyVerification.signatureFilename;

      // Validate required data
      if (!paymentData) {
        toast.error("Please fill in payment details");
        setIsSubmitting(false);
        return null;
      }

      if (!paymentData.method || !paymentData.accountName || !paymentData.accountNumber) {
        toast.error("Please complete all payment fields");
        setIsSubmitting(false);
        return null;
      }

      if (paymentData.method === "mobile-money" && !paymentData.methodName) {
        toast.error("Please select a mobile money provider");
        setIsSubmitting(false);
        return null;
      }

      if (type === "premium-financing") {
        // Validate premium financing data
        if (
          !loanData ||
          loanData.initialDeposit === undefined ||
          loanData.initialDeposit === null ||
          loanData.duration === undefined ||
          loanData.duration === null ||
          !loanData.paymentFrequency
        ) {
          toast.error("Please complete loan calculation");
          setIsSubmitting(false);
          return null;
        }

        const parsedPremiumAmount = parsePremiumAmount(premiumAmount);
        const finalDuration =
          isInstallment && installmentDuration ? installmentDuration : loanData.duration;
        const finalPaymentFrequency =
          isInstallment && installmentPaymentFrequency
            ? installmentPaymentFrequency
            : loanData.paymentFrequency;

        // Convert duration based on payment frequency
        const convertedDuration = isInstallment
          ? finalDuration
          : convertDurationForPaymentFrequency(finalDuration, finalPaymentFrequency);

        // Use premium financing endpoint (same as regular quote payments)
        const financingRequest: QuotePaymentRequestWithPremiumFinancing = {
          premiumAmount: parsedPremiumAmount,
          method: paymentData.method,
          accountNumber: paymentData.accountNumber,
          accountName: paymentData.accountName,
          methodCode:
            paymentData.methodCode as (typeof MOBILE_MONEY_METHODS)[number]["methodCode"],
          methodName:
            paymentData.methodName as (typeof MOBILE_MONEY_METHODS)[number]["methodName"],
          userID: userType === USER_TYPES.AGENT ? customerId! : user!.id!,
          companyID: selectedCompanyId,
          quoteType: quoteType,
          entityid: selectedQuoteId,
          currentDeposit: loanData.initialDeposit,
          paymentFrequency: finalPaymentFrequency.trim(),
          duration: convertedDuration,
          ...(userType === USER_TYPES.AGENT && { userAgentID: agent?.id }),
          ...(signatureFilename && { signature: signatureFilename }),
          ...(loyaltyVerification.ghanaCardId && {
            GhanaCardId: loyaltyVerification.ghanaCardId,
          }),
        };

        const financingResponse = await purchaseWithPremiumFinancing.mutateAsync(
          financingRequest
        );

        const paymentId = financingResponse.id || financingResponse.refId || "";

        // Generate and upload PDF in background
        const generateAndUploadPDF = async () => {
          try {
            // Wait longer to ensure backend has finished processing
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const fullPreviewUrl = `${window.location.origin}/premium-financing/${paymentId}`;

            const blob = await generatePDF({
              url: fullPreviewUrl,
              params: {},
            });

            const fileName = `Premium-Financing-Contract-${paymentId}.pdf`;
            const formData = new FormData();
            formData.append("declarationDoc", blob, fileName);

            await updatePremiumFinancing(paymentId, formData);
            toast.success("Payment processed and document uploaded successfully");
          } catch (error) {
            console.error("Failed to generate or upload PDF:", error);
            toast.error(
              "Payment processed but failed to upload document. You can download it from the preview page."
            );
          }
        };

        generateAndUploadPDF();

        toast.success("Premium financing payment processed successfully");

        return {
          paymentId,
          network: paymentData.methodName || "MTN",
          refId: selectedQuoteId,
          accountNumber: paymentData.accountNumber,
          pfId: financingResponse.id || "", // Premium Financing ID for OTP verification
        };
      } else {
        // Use regular payment endpoint for one-time payments
        const basePremiumAmount = parsePremiumAmount(premiumAmount);

        const paymentRequest: QuotePaymentRequest = {
          premiumAmount: basePremiumAmount,
          method: paymentData.method,
          accountNumber: paymentData.accountNumber,
          accountName: paymentData.accountName,
          methodCode:
            paymentData.methodCode as (typeof MOBILE_MONEY_METHODS)[number]["methodCode"],
          methodName:
            paymentData.methodName as (typeof MOBILE_MONEY_METHODS)[number]["methodName"],
          userID: userType === USER_TYPES.AGENT ? customerId! : user!.id!,
          companyID: selectedCompanyId,
          quoteType: quoteType,
          entityid: selectedQuoteId,
          ...(userType === USER_TYPES.AGENT && { userAgentID: agent?.id }),
          ...(signatureFilename && { signature: signatureFilename }),
        };

        const response = await makeQuotePayment.mutateAsync(paymentRequest);

        const paymentId = response.id || "";

        // Generate and upload PDF in background
        const generateAndUploadPDF = async () => {
          try {
            const previewUrl = `/quote-payment/${paymentId}`;
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const fullPreviewUrl = `${
              window.location.origin
            }${previewUrl}&authorization=${Cookies.get(COOKIE_KEYS.accessToken)}`;

            const blob = await generatePDF({
              url: fullPreviewUrl,
              params: {},
            });

            const fileName = `Quote-Payment-Contract-${paymentId}.pdf`;
            const formData = new FormData();
            formData.append("declarationDoc", blob, fileName);

            await updateQuotePayment(paymentId, formData);
            toast.success("Payment processed and document uploaded successfully");
          } catch (error) {
            console.error("Failed to generate or upload PDF:", error);
            toast.error(
              "Payment processed but failed to upload document. You can download it from the preview page."
            );
          }
        };

        generateAndUploadPDF();

        toast.success("Payment processed successfully");

        return {
          paymentId,
          network: paymentData.methodName || "MTN",
          refId: selectedQuoteId,
          accountNumber: paymentData.accountNumber,
          pfId: response.premiumfinancingID || "", // Premium Financing ID if available
        };
      }
    } catch (error) {
      toast.error("Failed to process payment. Please try again.");
      console.error("Payment error:", error);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [
    loyaltyVerification,
    premiumAmount,
    customerId,
    selectedCompanyId,
    selectedQuoteId,
    type,
    quoteType,
    isInstallment,
    installmentDuration,
    installmentPaymentFrequency,
    userType,
    user,
    agent,
    makeQuotePayment,
    purchaseWithPremiumFinancing,
    generatePDF,
  ]);

  return {
    submitPayment,
    isSubmitting:
      isSubmitting ||
      makeQuotePayment.isPending ||
      purchaseWithPremiumFinancing.isPending,
  };
}
