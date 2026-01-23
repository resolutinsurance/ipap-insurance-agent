import {
  BundlePaymentRequestWithPremiumFinancing,
  ConfirmAutoDebitOTPRequest,
  CustomerPaymentRequestWithPremiumFinancing,
  DecryptPremiumFinancingRequest,
  PaymentRecord,
  PremiumFinancingCalculateDataRequest,
  QuotePaymentRequestWithPremiumFinancing,
  ResendOTPRequest,
  SetupPremiumFinancingRequest,
} from "@/lib/interfaces";
import {
  calculatePremiumFinancingData,
  confirmAutoDebitOTP,
  customerPurchasePremiumFinancing,
  decryptPremiumFinancingId,
  getDirectPremiumFinancingSchedule,
  getPolicyDetails,
  getPremiumFinancingByBundleId,
  getPremiumFinancingByEntityId,
  getPremiumFinancingById,
  getPremiumFinancingSchedule,
  purchaseBundleWithPremiumFinancing,
  purchaseWithPremiumFinancing,
  resendAutoDebitOTP,
  setupPremiumFinancing,
} from "@/lib/services/premium-financing";
import { convertDurationForPaymentFrequency } from "@/lib/utils/payments";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { useAuth } from "./use-auth";

export const usePurchaseWithPremiumFinancing = () => {
  const purchaseWithPremiumFinancingMutation = useMutation({
    mutationFn: (data: QuotePaymentRequestWithPremiumFinancing) =>
      purchaseWithPremiumFinancing(data),
    onSuccess: (data) => {
      console.log("Payment made successfully:", data);
    },
    onError: (error) => {
      console.error("Payment error:", error);
    },
  });

  const customerPurchasePremiumFinancingMutation = useMutation({
    mutationFn: (data: CustomerPaymentRequestWithPremiumFinancing) =>
      customerPurchasePremiumFinancing(data),
    onSuccess: (data) => {
      console.log("Payment made successfully:", data);
    },
    onError: (error) => {
      console.error("Payment error:", error);
    },
  });
  const purchaseBundleWithPremiumFinancingMutation = useMutation({
    mutationFn: (data: BundlePaymentRequestWithPremiumFinancing) =>
      purchaseBundleWithPremiumFinancing(data),
    onSuccess: (data) => {
      console.log("Payment made successfully:", data);
    },
    onError: (error) => {
      console.error("Payment error:", error);
    },
  });
  return {
    purchaseWithPremiumFinancing: purchaseWithPremiumFinancingMutation,
    customerPurchasePremiumFinancing: customerPurchasePremiumFinancingMutation,
    purchaseBundleWithPremiumFinancing: purchaseBundleWithPremiumFinancingMutation,
  };
};

export const usePremiumFinancingByEntityId = (id: string, enabled: boolean = true) => {
  const { isAuthenticated } = useAuth();
  const premiumFinancingQuery = useQuery({
    queryKey: ["get-premium-financing-by-entity-id", id],
    queryFn: async () => {
      const response = await getPremiumFinancingByEntityId(id);
      if (!response) {
        throw new Error("No data received from getAllBundles");
      }
      return response;
    },
    enabled: enabled && isAuthenticated && !!id,
  });

  return {
    getPremiumFinancingByEntityId: premiumFinancingQuery,
  };
};

export const usePremiumFinancingByBundleId = (
  bundleId: string,
  userID: string,
  enabled: boolean = true
) => {
  const { isAuthenticated } = useAuth();
  const premiumFinancingQuery = useQuery({
    queryKey: ["get-premium-financing-by-bundle-id", bundleId, userID],
    queryFn: async () => {
      const response = await getPremiumFinancingByBundleId(bundleId, userID);
      if (!response) {
        throw new Error("No data received from getPremiumFinancingByBundleId");
      }
      return response;
    },
    enabled: enabled && isAuthenticated && !!bundleId && !!userID,
  });

  return {
    getPremiumFinancingByBundleId: premiumFinancingQuery,
  };
};

export const usePremiumFinancingById = (id: string, enabled: boolean = true) => {
  const premiumFinancingQuery = useQuery({
    queryKey: ["get-premium-financing-by-id", id],
    queryFn: async () => {
      const response = await getPremiumFinancingById(id);
      if (!response) {
        throw new Error("No data received from getPremiumFinancingById");
      }
      return response;
    },
    enabled: enabled && !!id,
  });

  return {
    getPremiumFinancingById: premiumFinancingQuery,
  };
};

/**
 * Shared hook to handle the complex logic of fetching payment schedule data
 * across different views (MainPaymentPage, AgentPaymentPage, etc.)
 */
export const usePaymentScheduleData = (
  purchaseData: PaymentRecord | undefined,
  entityId: string
) => {
  const isBundle = !!purchaseData?.assignedBundleName;
  const bundleId = purchaseData?.assignedBundleName || "";
  const userID = purchaseData?.userID || "";
  const premiumFinancingID = purchaseData?.premiumfinancingID;

  // 1. If we have a direct premiumfinancingID, use it (highest priority)
  const { getPremiumFinancingById } = usePremiumFinancingById(
    premiumFinancingID || "",
    !!premiumFinancingID
  );

  // 2. Fallback to bundle endpoint if it's a bundle
  const { getPremiumFinancingByBundleId } = usePremiumFinancingByBundleId(
    bundleId,
    userID,
    isBundle && !premiumFinancingID && !!purchaseData
  );

  // 3. Fallback to entity endpoint if neither above worked
  const { getPremiumFinancingByEntityId } = usePremiumFinancingByEntityId(
    entityId,
    !isBundle && !premiumFinancingID && !!purchaseData
  );

  // Determine which data to return
  const paymentScheduleData = premiumFinancingID
    ? getPremiumFinancingById.data
    : isBundle
    ? getPremiumFinancingByBundleId.data
    : getPremiumFinancingByEntityId.data;

  const isLoadingPaymentSchedule = premiumFinancingID
    ? getPremiumFinancingById.isLoading
    : isBundle
    ? getPremiumFinancingByBundleId.isLoading
    : getPremiumFinancingByEntityId.isLoading;

  // Check if we should show the payment schedule tab
  const entityObj = purchaseData?.entityObj;
  const hasPartPaymentStatus =
    (entityObj &&
      "paymentStatus" in entityObj &&
      entityObj.paymentStatus &&
      typeof entityObj.paymentStatus === "string" &&
      entityObj.paymentStatus.includes("PART PAYMENT")) ||
    !!premiumFinancingID;

  const hasPaymentSchedule = hasPartPaymentStatus || !!paymentScheduleData;

  return {
    paymentScheduleData,
    isLoadingPaymentSchedule,
    hasPaymentSchedule,
  };
};

export const useCalculatePremiumFinancingData = () => {
  const calculateDataMutation = useMutation({
    mutationFn: (data: PremiumFinancingCalculateDataRequest) =>
      calculatePremiumFinancingData(data),
    onSuccess: (data) => {
      console.log("Premium financing data calculated successfully:", data);
    },
    onError: (error) => {
      console.error("Premium financing calculation error:", error);
    },
  });

  return {
    calculatePremiumFinancingData: calculateDataMutation,
  };
};

interface UseAutoCalculatePremiumFinancingParams {
  premiumAmount: number;
  initialDeposit: number;
  duration: number;
  paymentFrequency: string;
  type?: "one-time" | "premium-financing";
  quoteType: string;
  enabled?: boolean;
}

export const useAutoCalculatePremiumFinancing = ({
  premiumAmount,
  initialDeposit,
  duration,
  paymentFrequency,
  type = "one-time",
  quoteType,
  enabled = true,
}: UseAutoCalculatePremiumFinancingParams) => {
  const { calculatePremiumFinancingData } = useCalculatePremiumFinancingData();
  const prevCalculationParamsRef = React.useRef<string>("");

  // Early return optimization: only validate and calculate for premium-financing type
  const isPremiumFinancing = type === "premium-financing" && enabled;

  // Validate all required fields are present and valid (only if premium financing)
  const isValidPremiumAmount =
    isPremiumFinancing &&
    typeof premiumAmount === "number" &&
    !isNaN(premiumAmount) &&
    isFinite(premiumAmount) &&
    premiumAmount > 0;
  const isValidDeposit =
    isPremiumFinancing &&
    typeof initialDeposit === "number" &&
    !isNaN(initialDeposit) &&
    isFinite(initialDeposit) &&
    initialDeposit >= 0;
  const isValidDuration =
    isPremiumFinancing &&
    typeof duration === "number" &&
    !isNaN(duration) &&
    isFinite(duration) &&
    Number.isInteger(duration) &&
    duration >= 1;
  const isValidPaymentFrequency =
    isPremiumFinancing &&
    typeof paymentFrequency === "string" &&
    paymentFrequency.trim().length > 0;

  const shouldCalculate =
    isValidPremiumAmount && isValidDeposit && isValidDuration && isValidPaymentFrequency;

  // Calculate premium financing data on the fly when all required fields are available
  // Only runs for premium-financing type
  React.useEffect(() => {
    // Early return if not premium financing
    if (!isPremiumFinancing || !shouldCalculate) {
      return;
    }

    // Create a unique key for the current parameters to avoid duplicate calls
    const paramsKey = `${premiumAmount}-${initialDeposit}-${duration}-${paymentFrequency.trim()}`;

    // Only call API if parameters have actually changed
    if (prevCalculationParamsRef.current === paramsKey) {
      return;
    }

    prevCalculationParamsRef.current = paramsKey;

    const timeoutId = setTimeout(() => {
      // Convert duration based on payment frequency before sending to API
      const convertedDuration = convertDurationForPaymentFrequency(
        duration,
        paymentFrequency
      );
      calculatePremiumFinancingData.mutate({
        premiumAmount,
        initialDeposit,
        duration: convertedDuration,
        paymentFrequency: paymentFrequency.trim(),
        quoteType: quoteType,
      });
    }, 500); // Debounce to avoid excessive API calls

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isPremiumFinancing,
    shouldCalculate,
    premiumAmount,
    initialDeposit,
    duration,
    paymentFrequency,
  ]);

  // Validation helper function that can be used in forms
  const validatePremiumFinancingFields = (
    premiumAmount: number,
    initialDeposit: number,
    duration: number,
    paymentFrequency: string
  ): { isValid: boolean; error?: string } => {
    if (
      !premiumAmount ||
      isNaN(premiumAmount) ||
      !isFinite(premiumAmount) ||
      premiumAmount <= 0
    ) {
      return { isValid: false, error: "Please enter a valid premium amount" };
    }
    if (
      typeof initialDeposit !== "number" ||
      isNaN(initialDeposit) ||
      !isFinite(initialDeposit) ||
      initialDeposit < 0
    ) {
      return { isValid: false, error: "Please enter a valid initial deposit" };
    }
    if (
      typeof duration !== "number" ||
      isNaN(duration) ||
      !isFinite(duration) ||
      !Number.isInteger(duration) ||
      duration < 1
    ) {
      return {
        isValid: false,
        error: "Please enter a valid duration (minimum 1 installment)",
      };
    }
    if (
      !paymentFrequency ||
      typeof paymentFrequency !== "string" ||
      paymentFrequency.trim().length === 0
    ) {
      return { isValid: false, error: "Please select a payment frequency" };
    }
    return { isValid: true };
  };

  return {
    calculatePremiumFinancingData,
    isValid: shouldCalculate,
    validatePremiumFinancingFields,
  };
};

export const usePolicyDetails = (identifier?: string, quoteType?: string) => {
  const { isAuthenticated } = useAuth();
  const policyDetailsQuery = useQuery({
    queryKey: ["premium-policy-details", identifier, quoteType],
    queryFn: async () => {
      if (!identifier || !quoteType) {
        throw new Error(
          "Missing entity/bundle identifier or quote type for policy details"
        );
      }
      const response = await getPolicyDetails(identifier, quoteType);
      if (!response) {
        throw new Error("No data received from getPolicyDetails");
      }
      return response;
    },
    enabled: isAuthenticated && !!identifier && !!quoteType,
  });

  return {
    getPolicyDetails: policyDetailsQuery,
  };
};

/**
 * Combined hook for Auto Debit OTP operations
 */
export const useAutoDebitOTP = () => {
  const confirmOTPMutation = useMutation({
    mutationFn: (data: ConfirmAutoDebitOTPRequest) => confirmAutoDebitOTP(data),
    onSuccess: (data) => {
      console.log("Auto debit OTP confirmed successfully:", data);
    },
    onError: (error) => {
      console.error("Auto debit OTP confirmation error:", error);
    },
  });
  const resendOTPMutation = useMutation({
    mutationFn: (data: ResendOTPRequest) => resendAutoDebitOTP(data),
    onSuccess: (data) => {
      console.log("OTP resent successfully:", data);
    },
    onError: (error) => {
      console.error("Resend OTP error:", error);
    },
  });

  return {
    confirmAutoDebitOTP: confirmOTPMutation,
    resendAutoDebitOTP: resendOTPMutation,
  };
};

/**
 * Hook for decrypting Premium Financing ID from token
 */
export const useDecryptPremiumFinancing = () => {
  const decryptMutation = useMutation({
    mutationFn: (data: DecryptPremiumFinancingRequest) => decryptPremiumFinancingId(data),
    onSuccess: (data) => {
      console.log("Premium financing ID decrypted successfully:", data);
    },
    onError: (error) => {
      console.error("Decrypt premium financing ID error:", error);
    },
  });

  return {
    decryptPremiumFinancing: decryptMutation,
  };
};

/**
 * Hook for setting up Premium Financing by agent
 */
export const useSetupPremiumFinancing = () => {
  const setupMutation = useMutation({
    mutationFn: (data: SetupPremiumFinancingRequest) => setupPremiumFinancing(data),
    onSuccess: (data) => {
      console.log("Premium financing setup successfully:", data);
    },
    onError: (error) => {
      console.error("Setup premium financing error:", error);
    },
  });

  return {
    setupPremiumFinancing: setupMutation,
  };
};

export const usePremiumFinancingSchedule = (id: string) => {
  const { isAuthenticated } = useAuth();
  const premiumFinancingScheduleQuery = useQuery({
    queryKey: ["get-premium-financing-schedule", id],
    queryFn: async () => {
      const response = await getPremiumFinancingSchedule(id);
      if (!response) {
        throw new Error("No data received from getPremiumFinancingSchedule");
      }
      return response;
    },
    enabled: isAuthenticated && !!id,
  });

  return {
    getPremiumFinancingSchedule: premiumFinancingScheduleQuery,
  };
};

export const useDirectPremiumFinancingSchedule = (paymentData?: {
  initialDeposit: string;
  totalRepayment: string;
  totalPaid: string;
  loanAmount: string;
  noofInstallments: number;
  paymentFrequency: "daily" | "weekly" | "monthly";
}) => {
  const premiumFinancingScheduleQuery = useQuery({
    queryKey: ["get-direct-premium-financing-schedule", paymentData],
    queryFn: async () => {
      if (!paymentData) {
        throw new Error("Missing payment data for direct schedule");
      }
      const response = await getDirectPremiumFinancingSchedule(paymentData);
      if (!response) {
        throw new Error("No data received from getDirectPremiumFinancingSchedule");
      }
      return response;
    },
    enabled: !!paymentData?.paymentFrequency && !!paymentData.noofInstallments,
  });

  return {
    getPremiumFinancingSchedule: premiumFinancingScheduleQuery,
  };
};
