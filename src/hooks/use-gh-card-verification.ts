/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getSingleGhCardDetails,
  GhanaCardVerificationData,
  verifyGhanaCard,
  verifyGhanaCardPublic,
} from "@/lib/services/gh-card-verfication";
import { useMutation, useQuery } from "@tanstack/react-query";

/**
 * Extract error message from Ghana card verification response
 */
const getGhanaCardErrorMessage = (response: any): string => {
  // Check various possible locations for error message
  if (response?.msg) return response.msg;
  if (response?.message && typeof response.message === "string") return response.message;
  if (response?.message && typeof response.message === "object" && response.message.msg) {
    return response.message.msg;
  }
  // Check for error in response data
  if (response?.error) {
    if (typeof response.error === "string") return response.error;
    if (response.error?.message) return response.error.message;
  }
  return "Ghana Card verification failed. Please ensure your details are correct and try again.";
};

/**
 * Validate Ghana card verification response and throw error if verification failed
 */
const validateGhanaCardResponse = (response: any): void => {
  // Extract error message helper
  const getErrorMessage = () => getGhanaCardErrorMessage(response);

  // Check for explicit failure cases
  // Case 1: response.success is explicitly false
  if (response?.success === false) {
    throw new Error(getErrorMessage());
  }

  // Case 2: Check verified flag in various response structures
  const verifiedStatus =
    response?.verified ?? // Root level verified
    (response?.message && typeof response.message === "object"
      ? response.message.verified
      : undefined); // Nested in message object

  // If verified is explicitly false, it's a failure
  if (verifiedStatus === false) {
    throw new Error(getErrorMessage());
  }

  // Case 3: If success is true but we have a message object with verified === false
  if (
    response?.success === true &&
    response?.message &&
    typeof response.message === "object" &&
    response.message.verified === false
  ) {
    throw new Error(getErrorMessage());
  }

  // Case 4: Only proceed if we have explicit success indicators
  // We need at least one of:
  // - verified === true (at root or in message)
  // - success === true AND verified is not false
  const hasExplicitSuccess =
    verifiedStatus === true || (response?.success === true && verifiedStatus !== false);

  if (!hasExplicitSuccess) {
    // If we can't confirm success, treat as failure
    throw new Error("Ghana Card verification could not be confirmed. Please try again.");
  }
};

export const useGhCardVerification = () => {
  const verifyMutation = useMutation({
    mutationFn: async (data: GhanaCardVerificationData) => {
      // verifyGhanaCard will throw an error with the proper message if the API call fails
      // If it succeeds, we get the response data
      const response = await verifyGhanaCard(data);

      // Validate response and throw error if verification failed
      validateGhanaCardResponse(response);

      console.log("Ghana Card verification successful:", response);
      return response;
    },
    onError: (error) => {
      console.error("Ghana Card verification error:", error);
    },
  });

  return {
    verifyGhanaCard: verifyMutation,
  };
};

export const useGhCardDetails = (id: string) => {
  return useQuery({
    queryKey: ["gh-card-details", id],
    queryFn: () => getSingleGhCardDetails(id),
    enabled: !!id,
  });
};

/**
 * Hook for public Ghana card verification (used for payments)
 * Returns the verification ID that should be passed to premium financing
 */
export const useGhCardVerificationPublic = () => {
  const verifyMutation = useMutation({
    mutationFn: async (data: GhanaCardVerificationData) => {
      // verifyGhanaCardPublic will throw an error with the proper message if the API call fails
      // If it succeeds, we get the response data
      const response = await verifyGhanaCardPublic(data);

      // Validate response and throw error if verification failed
      validateGhanaCardResponse(response);

      console.log("Ghana Card verification successful:", response);
      return response;
    },
    onError: (error) => {
      console.error("Ghana Card verification error:", error);
    },
  });

  return {
    verifyGhanaCardPublic: verifyMutation,
  };
};
