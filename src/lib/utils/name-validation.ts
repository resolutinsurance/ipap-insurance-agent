import {
  MainUserGhanaCardVerificationResponse,
  PublicGhanaCardVerificationResponse,
} from "@/lib/interfaces/response";
import type { PaymentVerificationState } from "@/lib/store/payment-verification";

/**
 * Normalizes a name string by:
 * - Converting to lowercase
 * - Removing extra whitespace
 * - Removing special characters (keeping only letters, spaces, and hyphens)
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters except hyphens
    .replace(/\s+/g, " "); // Replace multiple spaces with single space
}

/**
 * Compares two names after normalization
 * Returns true if they match (case-insensitive, ignoring special characters)
 */
function compareNames(name1: string, name2: string): boolean {
  const normalized1 = normalizeName(name1);
  const normalized2 = normalizeName(name2);
  return normalized1 === normalized2;
}

/**
 * Gets the full name from Ghana Card response
 */
function getGhanaCardFullName(
  ghanaCardResponse:
    | PublicGhanaCardVerificationResponse
    | MainUserGhanaCardVerificationResponse
    | null
): string | null {
  if (!ghanaCardResponse) return null;

  // Public verification response has forenames and surname
  if ("forenames" in ghanaCardResponse && "surname" in ghanaCardResponse) {
    const forenames = ghanaCardResponse.forenames?.trim() || "";
    const surname = ghanaCardResponse.surname?.trim() || "";
    if (forenames || surname) {
      return `${forenames} ${surname}`.trim();
    }
  }

  return null;
}

export interface NameValidationResult {
  isValid: boolean;
  errors: string[];
  matches: {
    ghanaCard: boolean;
    policyDetails: boolean;
  };
}

/**
 * Validates that the account name from payment data matches:
 * 1. The name from Ghana Card verification (forenames + surname)
 * 2. The customer name from policy details
 *
 * @param paymentVerification - The payment verification state containing paymentData and ghanaCardResponse
 * @param policyDetails - Optional policy details object
 * @returns Validation result with isValid flag and any errors
 */
export function validateAccountName(
  paymentVerification: PaymentVerificationState
): NameValidationResult {
  const errors: string[] = [];
  const matches = {
    ghanaCard: false,
    policyDetails: false,
  };

  const accountName = paymentVerification.paymentData?.accountName;
  if (!accountName) {
    return {
      isValid: false,
      errors: ["Account name is required"],
      matches,
    };
  }

  // Compare with Ghana Card name
  const ghanaCardFullName = getGhanaCardFullName(paymentVerification.ghanaCardResponse);
  if (ghanaCardFullName) {
    matches.ghanaCard = compareNames(accountName, ghanaCardFullName);
    if (!matches.ghanaCard) {
      errors.push(
        `Account name "${accountName}" does not match Ghana Card name "${ghanaCardFullName}"`
      );
    }
  } else {
    errors.push("Ghana Card verification response is missing or invalid");
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    matches,
  };
}
