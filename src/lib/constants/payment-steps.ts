import type { Step } from "@/components/ui/stepper";

/**
 * Individual step definitions for payment flows
 */
export const PAYMENT_STEPS = {
  GHANA_CARD_VERIFICATION: {
    title: "Ghana Card Verification",
    description: "Verify your identity",
  },
  QUOTE_COMPLETION: {
    title: "Quote Completion",
    description: "Complete your quote details",
  },
  LOAN_CALCULATION: {
    title: "Loan Calculation",
    description: "Configure your loan terms",
  },
  DECLARATION: {
    title: "Declaration",
    description: "Review and accept terms",
  },
  REPAYMENT_SCHEDULE_PREVIEW: {
    title: "Repayment Schedule",
    description: "Preview your repayment schedule",
  },
  PAYMENT_DETAILS: {
    title: "Payment Details",
    description: "Enter payment information",
  },
  VERIFY_PAYMENT: {
    title: "Verify Payment",
    description: "Verify your payment",
  },
  PREVIEW_DETAILS: {
    title: "Preview details",
    description: "Review premium financing details captured by the agent",
  },
  LOAN_CALCULATION_STEP: {
    title: "Loan calculation step",
    description: "Calculate loan terms for premium financing",
  },
  CUSTOMER_VERIFICATION_STEP: {
    title: "Customer verification step",
    description: "Generate link for customer to continue remotely",
  },
} as const;

/**
 * Customer self-verification steps (for remote premium financing)
 */
export const CUSTOMER_SELF_VERIFICATION_STEPS: Step[] = [
  PAYMENT_STEPS.PREVIEW_DETAILS,
  {
    title: "Ghana Card Verification",
    description: "Verify your identity with your Ghana Card",
  },
  PAYMENT_STEPS.DECLARATION,
  PAYMENT_STEPS.REPAYMENT_SCHEDULE_PREVIEW,
  PAYMENT_STEPS.PAYMENT_DETAILS,
  PAYMENT_STEPS.VERIFY_PAYMENT,
];

/**
 * Agent remote premium financing steps
 */
export const AGENT_REMOTE_PREMIUM_FINANCING_STEPS: Step[] = [
  PAYMENT_STEPS.LOAN_CALCULATION_STEP,
  PAYMENT_STEPS.CUSTOMER_VERIFICATION_STEP,
];

/**
 * Get payment steps for standard payment flow (pay-direct, pay-direct/loyalty, bundles)
 * @param isPremiumFinancing - Whether this is a premium financing payment
 * @param isInstallment - Whether this is an installment payment
 * @returns Array of steps
 */
export const getStandardPaymentSteps = (
  isPremiumFinancing: boolean,
  isInstallment: boolean
): Step[] => {
  const baseSteps: Step[] = [PAYMENT_STEPS.GHANA_CARD_VERIFICATION];

  if (isPremiumFinancing && !isInstallment) {
    baseSteps.push(
      PAYMENT_STEPS.LOAN_CALCULATION,
      PAYMENT_STEPS.DECLARATION,
      PAYMENT_STEPS.REPAYMENT_SCHEDULE_PREVIEW,
      PAYMENT_STEPS.PAYMENT_DETAILS,
      PAYMENT_STEPS.VERIFY_PAYMENT
    );
  } else {
    baseSteps.push(
      PAYMENT_STEPS.DECLARATION,
      PAYMENT_STEPS.PAYMENT_DETAILS,
      PAYMENT_STEPS.VERIFY_PAYMENT
    );
  }

  return baseSteps;
};

/**
 * Get payment steps for quote payment flow (pay page with quote completion)
 * @param isPremiumFinancing - Whether this is a premium financing payment
 * @param isInstallment - Whether this is an installment payment
 * @returns Array of steps
 */
export const getQuotePaymentSteps = (
  isPremiumFinancing: boolean,
  isInstallment: boolean
): Step[] => {
  const baseSteps: Step[] = [
    PAYMENT_STEPS.GHANA_CARD_VERIFICATION,
    PAYMENT_STEPS.QUOTE_COMPLETION,
  ];

  if (isPremiumFinancing && !isInstallment) {
    baseSteps.push(
      PAYMENT_STEPS.LOAN_CALCULATION,
      PAYMENT_STEPS.DECLARATION,
      PAYMENT_STEPS.PAYMENT_DETAILS,
      PAYMENT_STEPS.VERIFY_PAYMENT
    );
  } else {
    baseSteps.push(
      PAYMENT_STEPS.DECLARATION,
      PAYMENT_STEPS.PAYMENT_DETAILS,
      PAYMENT_STEPS.VERIFY_PAYMENT
    );
  }

  return baseSteps;
};
