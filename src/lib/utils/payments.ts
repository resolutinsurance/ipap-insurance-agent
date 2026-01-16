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
