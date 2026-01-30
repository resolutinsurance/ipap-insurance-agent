import useGeneratePDF from "@/hooks/use-generate-pdf";
import { usePurchaseWithPremiumFinancing } from "@/hooks/use-premium-financing";
import { useQuotePayments } from "@/hooks/use-quote-payments";
import { MOBILE_MONEY_METHODS, MainProductQuoteType } from "@/lib/constants";
import {
  CustomerPaymentRequestWithPremiumFinancing,
  QuotePaymentRequest,
} from "@/lib/interfaces";
import { customerUpdatePremiumFinancing } from "@/lib/services/premium-financing";
import { updateQuotePayment } from "@/lib/services/quote-requests/quote-payments";
import { customerSelfVerificationAtom } from "@/lib/store";
import { validateAccountName } from "@/lib/utils/name-validation";
import { parsePremiumAmount } from "@/lib/utils/payments";
import { useAtom } from "jotai";
import React from "react";
import { toast } from "sonner";

interface UseSubmitCustomerQuotePaymentParams {
  pfId: string;
  premiumAmount: number;
  customerId: string; // Required for customer self-verification
  selectedCompanyId: string;
  selectedQuoteId: string;
  type?: "one-time" | "premium-financing";
  quoteType: MainProductQuoteType;
  isInstallment?: boolean;
  installmentDuration?: number;
  installmentPaymentFrequency?: string;
  verificationType: "remote-verification" | "standard-verification";
}

export function useSubmitCustomerQuotePayment({
  pfId,
  premiumAmount,
  customerId,
  selectedCompanyId,
  selectedQuoteId,
  type = "premium-financing",
  quoteType,
  isInstallment = false,
  installmentDuration,
  installmentPaymentFrequency,
  verificationType,
}: UseSubmitCustomerQuotePaymentParams) {
  const [paymentVerification] = useAtom(customerSelfVerificationAtom);
  const { makeQuotePayment } = useQuotePayments();
  const { customerPurchasePremiumFinancing } = usePurchaseWithPremiumFinancing();
  const { generatePDF } = useGeneratePDF();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const submitPayment = React.useCallback(async () => {
    setIsSubmitting(true);
    try {
      // Read all data from Jotai state (directly, no session key)
      const loanData = paymentVerification.loanData;
      const paymentData = paymentVerification.paymentData;
      const signatureFilename = paymentVerification.signatureFilename;

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

      // Validate account name matches Ghana Card and policy details
      const nameValidation = validateAccountName(paymentVerification);
      if (!nameValidation.isValid) {
        nameValidation.errors.forEach((error) => {
          toast.error(error);
        });
        setIsSubmitting(false);
        return null;
      }

      if (type === "premium-financing" && !isInstallment) {
        // Validate premium financing data (not needed for installments)
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

        // Use premium financing endpoint
        const financingRequest: CustomerPaymentRequestWithPremiumFinancing = {
          id: pfId,
          premiumAmount: parsedPremiumAmount,
          method: paymentData.method,
          accountNumber: paymentData.accountNumber,
          accountName: paymentData.accountName,
          methodCode:
            paymentData.methodCode as (typeof MOBILE_MONEY_METHODS)[number]["methodCode"],
          methodName:
            paymentData.methodName as (typeof MOBILE_MONEY_METHODS)[number]["methodName"],
          userID: customerId, // Use customerId directly (from premium financing)
          companyID: selectedCompanyId,
          quoteType: quoteType,
          entityid: selectedQuoteId,
          currentDeposit: loanData.initialDeposit,
          paymentFrequency: finalPaymentFrequency.trim(),
          duration: finalDuration,
          GhanaCardId: paymentVerification.ghanaCardId,
          fromAgent: true,
          ...(signatureFilename && { signature: signatureFilename }),
          ...(paymentVerification.ghanaCardId && {}),
        };

        const financingResponse = await customerPurchasePremiumFinancing.mutateAsync(
          financingRequest
        );

        const paymentId = financingResponse.id || financingResponse.refId || "";

        // Generate and upload PDF in background
        const generateAndUploadPDF = async () => {
          try {
            // Wait longer to ensure backend has finished processing
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const fullPreviewUrl = `${window.location.origin}/premium-financing/${paymentId}?type=${verificationType}`;

            const blob = await generatePDF({
              url: fullPreviewUrl,
              params: {},
            });

            const fileName = `Premium-Financing-Contract-${paymentId}.pdf`;
            const formData = new FormData();
            formData.append("declarationDoc", blob, fileName);

            await customerUpdatePremiumFinancing(paymentId, formData);
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
          userID: customerId, // Use customerId directly (from premium financing)
          companyID: selectedCompanyId,
          quoteType: quoteType,
          entityid: selectedQuoteId,
          ...(signatureFilename && { signature: signatureFilename }),
        };

        const response = await makeQuotePayment.mutateAsync(paymentRequest);

        const paymentId = response.id || "";

        // Generate and upload PDF in background
        const generateAndUploadPDF = async () => {
          try {
            // Wait longer to ensure backend has finished processing
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const fullPreviewUrl = `${window.location.origin}/quote-payment/${paymentId}?type=${verificationType}`;

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
    pfId,
    paymentVerification,
    premiumAmount,
    customerId,
    selectedCompanyId,
    selectedQuoteId,
    type,
    quoteType,
    isInstallment,
    installmentDuration,
    installmentPaymentFrequency,
    verificationType,
    makeQuotePayment,
    customerPurchasePremiumFinancing,
    generatePDF,
  ]);

  return {
    submitPayment,
    isSubmitting:
      isSubmitting ||
      makeQuotePayment.isPending ||
      customerPurchasePremiumFinancing.isPending,
  };
}
