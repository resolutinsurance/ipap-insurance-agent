import {
  MainUserGhanaCardVerificationResponse,
  PublicGhanaCardVerificationResponse,
} from "../interfaces/response";
import { atomWithSessionStorage } from "./payment-storage";

// Unified storage key for all payment verification states
// This ensures all payment types share the same sessionStorage entry
export const PAYMENT_VERIFICATION_STORAGE_KEY = "payment-verification";

// Payment type to distinguish between different payment flows
export type PaymentType = "quote" | "bundle" | "direct" | "loyalty";

// Unified payment verification state for all payment types
// All payment types share the same state structure, distinguished by the `type` field
export interface PaymentVerificationState {
  // Payment type identifier
  type?: PaymentType;
  // Verification status
  ghanaVerified: boolean;
  ghanaCardId?: string; // Ghana card verification ID from public verification
  ghanaCardNumber?: string; // Ghana card number used for verification
  quoteUpdated?: boolean; // Only for quote payments
  loanCalculated?: boolean; // For premium financing
  declarationAccepted: boolean;
  // Signature filename (stored after uploading to API, originalname from upload response)
  signatureFilename?: string;
  // Declaration checkboxes state
  declarations?: {
    termsAndConditions: boolean;
    dataProcessing: boolean;
    insuranceTerms: boolean;
    premiumPayment: boolean;
    policyValidity: boolean;
  };
  ghanaCardResponse:
    | PublicGhanaCardVerificationResponse
    | MainUserGhanaCardVerificationResponse
    | null;
  // Loan calculation data
  loanData?: {
    initialDeposit: number;
    duration: number;
    paymentFrequency: string;
  };
  // Payment details
  paymentData?: {
    method: string;
    methodName: string;
    methodCode: string;
    accountName: string;
    accountNumber: string;
  };
}

// Legacy type aliases for backward compatibility (all point to the same unified interface)
export type BundlePaymentVerificationState = PaymentVerificationState;
export type DirectPaymentVerificationState = PaymentVerificationState;
export type LoyaltyPaymentVerificationState = PaymentVerificationState;

// Initial state for payment verification
const initialPaymentState: PaymentVerificationState = {
  ghanaCardResponse: null,
  ghanaVerified: false,
  declarationAccepted: false,
};

/**
 * Creates a default payment verification state for a given payment type
 * @param type - The payment type ("quote" | "bundle" | "direct" | "loyalty")
 * @returns Default PaymentVerificationState with the specified type
 */
export function getDefaultPaymentVerificationState(
  type: PaymentType
): PaymentVerificationState {
  const baseState: PaymentVerificationState = {
    type,
    ghanaCardResponse: null,
    ghanaVerified: false,
    declarationAccepted: false,
  };

  // Quote payments also need quoteUpdated field
  if (type === "quote") {
    return {
      ...baseState,
      quoteUpdated: false,
    };
  }

  return baseState;
}

// Single unified atom for all payment types
// All payment pages use this same atom, distinguished by the `type` field
export const paymentVerificationAtom = atomWithSessionStorage<PaymentVerificationState>(
  PAYMENT_VERIFICATION_STORAGE_KEY,
  initialPaymentState
);

// Legacy atom exports for backward compatibility (all point to the same atom)
export const bundlePaymentVerificationAtom = paymentVerificationAtom;
export const directPaymentVerificationAtom = paymentVerificationAtom;
export const loyaltyPaymentVerificationAtom = paymentVerificationAtom;

// Customer self-verification storage key (separate from regular payment verification)
export const CUSTOMER_SELF_VERIFICATION_STORAGE_KEY = "customer-self-verification";

// Customer self-verification atom (separate from regular payment verification)
// This is used for the customer self-verification flow accessed via token/ID
export const customerSelfVerificationAtom =
  atomWithSessionStorage<PaymentVerificationState>(
    CUSTOMER_SELF_VERIFICATION_STORAGE_KEY,
    initialPaymentState
  );
