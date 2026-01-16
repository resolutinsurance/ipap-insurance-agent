import { PremiumFinancingCalculateDataResponse } from "@/lib/interfaces";

interface PremiumFinancingSummaryProps {
  data?: PremiumFinancingCalculateDataResponse;
  isLoading?: boolean;
  error?: Error | null;
  enabled?: boolean;
}

/**
 * Determines the processing fee percentage based on premium amount
 * Handles formats:
 * - "GHS X" - means 0 to X
 * - "Above GHS X" - means greater than X
 * - "GHS X - GHS Y" - means X to Y (legacy format)
 *
 * Default is 2% if no matching range found
 */
function getProcessingFeePercentage(
  premiumAmount: number,
  processingFees: { loanAmountRange: string; feePercentage: string }[]
): string {
  if (!processingFees || processingFees.length === 0) {
    return "2%";
  }

  // Check each fee range to find the matching one
  for (const fee of processingFees) {
    const range = fee.loanAmountRange;

    if (range.includes("Above")) {
      // Format: "Above GHS X" - means greater than X
      const lowerBound = parseFloat(range.replace("Above GHS ", "").trim());
      if (premiumAmount > lowerBound) {
        return fee.feePercentage;
      }
    } else if (range.includes(" - ")) {
      // Legacy format: "GHS X - GHS Y" - means X to Y
      const parts = range.split(" - ");
      if (parts.length === 2) {
        const lower = parseFloat(parts[0].replace("GHS ", "").trim());
        const upper = parseFloat(parts[1].replace("GHS ", "").trim());
        if (premiumAmount >= lower && premiumAmount <= upper) {
          return fee.feePercentage;
        }
      }
    } else {
      // Format: "GHS X" - means 0 to X (inclusive)
      const upperBound = parseFloat(range.replace("GHS ", "").trim());
      if (premiumAmount <= upperBound) {
        return fee.feePercentage;
      }
    }
  }

  // Default to 2% if no match found
  return "2%";
}

export function PremiumFinancingSummary({
  data,
  isLoading,
  error,
  enabled = true,
}: PremiumFinancingSummaryProps) {
  // Only render if enabled (for premium-financing type)
  if (!enabled) {
    return null;
  }

  if (isLoading) {
    return <div className="text-sm text-gray-500">Calculating loan details...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-500">{error.message}</div>;
  }

  if (!data) {
    return null;
  }

  // Calculate processing fee percentage based on premium amount (not loan amount)
  const processingFeePercentage = data.ProcessingFees
    ? getProcessingFeePercentage(data.premiumAmount, data.ProcessingFees)
    : "0%";

  // Calculate processing fee amount based on premium amount
  const processingFeeAmount =
    processingFeePercentage !== "0%" && processingFeePercentage !== "N/A"
      ? (data.premiumAmount * parseFloat(processingFeePercentage.replace("%", ""))) / 100
      : 0;

  return (
    <div className="p-4 bg-gray-50 rounded-lg space-y-2">
      <h4 className="font-semibold text-sm">Loan Calculation Summary</h4>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-600">Initial Deposit:</span>
          <span className="font-medium ml-2">GHS {data.initialDeposit.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-gray-600">Loan Amount:</span>
          <span className="font-medium ml-2">GHS {data.loanAmount.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-gray-600">Processing Fee:</span>
          <span className="font-medium ml-2">
            {processingFeePercentage} (GHS {processingFeeAmount.toFixed(2)})
          </span>
        </div>
        <div>
          <span className="text-gray-600">Interest Rate:</span>
          <span className="font-medium ml-2">{data.interestRatePercent}</span>
        </div>
        <div>
          <span className="text-gray-600">Regular Installment:</span>
          <span className="font-medium ml-2">
            GHS {data.regularInstallment.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-gray-600">Total Interest:</span>
          <span className="font-medium ml-2">
            GHS {data.totalInterestValue.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-gray-600">Total Repayment:</span>
          <span className="font-medium ml-2">GHS {data.totalRepayment.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-gray-600">No. of Installments:</span>
          <span className="font-medium ml-2">{data.noofInstallments}</span>
        </div>
      </div>
    </div>
  );
}
