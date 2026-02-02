import { MAIN_PRODUCT_QUOTE_TYPES } from "../constants";

export function parsePremiumAmount(amount: string | number): number {
  if (typeof amount === "number") return amount;
  // Remove all non-digit, non-dot characters
  const cleaned = amount.replace(/[^\d.]/g, "");
  return parseFloat(cleaned);
}

/**
 * Converts duration from months to the appropriate unit based on payment frequency
 * @param durationInMonths - Duration in months (1-11)
 * @param paymentFrequency - Payment frequency ("daily", "weekly", "monthly")
 * @returns Converted duration:
 *   - daily: months * 30 (days)
 *   - weekly: months * 4 (weeks)
 *   - monthly: months (no conversion)
 */
export function convertDurationForPaymentFrequency(
  durationInMonths: number,
  paymentFrequency: string
): number {
  const frequency = paymentFrequency.trim().toLowerCase();

  switch (frequency) {
    case "daily":
      return durationInMonths * 30; // Convert months to days (average 30 days per month)
    case "weekly":
      return durationInMonths * 4; // Convert months to weeks (4 weeks per month)
    case "monthly":
      return durationInMonths; // No conversion needed
    default:
      // Default to monthly if frequency is not recognized
      return durationInMonths;
  }
}

export const calculateProcessingFee = (
  initialDeposit: number,
  premiumAmount: number,
  quoteType: string
): number => {
  const FEE = 0.02;
  const STICKY_FEE = 52;

  let processingFee = 0;

  if (quoteType === MAIN_PRODUCT_QUOTE_TYPES.THIRDPARTY) {
    const loanAmount = premiumAmount - initialDeposit;
    processingFee = (loanAmount + STICKY_FEE) * FEE;
  } else {
    processingFee = (premiumAmount - initialDeposit) * FEE;
  }
  return parseFloat(processingFee.toFixed(2));
};

// /**
//  * Determines the processing fee percentage based on premium amount
//  * Handles formats:
//  * - "GHS X" - means 0 to X
//  * - "Above GHS X" - means greater than X
//  * - "GHS X - GHS Y" - means X to Y (legacy format)
//  *
//  * Default is 2% if no matching range found
//  */
// function getProcessingFeePercentage(
//   premiumAmount: number,
//   processingFees: { loanAmountRange: string; feePercentage: string }[]
// ): string {
//   if (!processingFees || processingFees.length === 0) {
//     return "2%";
//   }

//   // Check each fee range to find the matching one
//   for (const fee of processingFees) {
//     const range = fee.loanAmountRange;

//     if (range.includes("Above")) {
//       // Format: "Above GHS X" - means greater than X
//       const lowerBound = parseFloat(range.replace("Above GHS ", "").trim());
//       if (premiumAmount > lowerBound) {
//         return fee.feePercentage;
//       }
//     } else if (range.includes(" - ")) {
//       // Legacy format: "GHS X - GHS Y" - means X to Y
//       const parts = range.split(" - ");
//       if (parts.length === 2) {
//         const lower = parseFloat(parts[0].replace("GHS ", "").trim());
//         const upper = parseFloat(parts[1].replace("GHS ", "").trim());
//         if (premiumAmount >= lower && premiumAmount <= upper) {
//           return fee.feePercentage;
//         }
//       }
//     } else {
//       // Format: "GHS X" - means 0 to X (inclusive)
//       const upperBound = parseFloat(range.replace("GHS ", "").trim());
//       if (premiumAmount <= upperBound) {
//         return fee.feePercentage;
//       }
//     }
//   }

//   // Default to 2% if no match found
//   return "2%";
// }

export const calculateCharges = (actualProcessingFee: number, initialDeposit: number) => {
  const quoteAmount = actualProcessingFee + initialDeposit;
  return quoteAmount + Math.min(quoteAmount * 0.015, 40);
};
