import { MAIN_PRODUCT_QUOTE_TYPES, MainProductQuoteType } from "@/lib/constants";
import { prepareObjectFields } from "@/lib/data-renderer";
import { PremiumFinancingCalculateDataResponse } from "@/lib/interfaces";
import { formatCurrencyToGHS } from "@/lib/utils";

interface PremiumFinancingSummaryProps {
  data?: PremiumFinancingCalculateDataResponse;
  isLoading?: boolean;
  error?: Error | null;
  enabled?: boolean;
  quoteType: MainProductQuoteType;
}

export function PremiumFinancingSummary({
  data,
  isLoading,
  error,
  enabled = true,
  quoteType,
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

  // Get payment frequency to determine which rates to show
  const paymentFrequency = data.paymentFrequency?.toLowerCase() || "monthly";

  // Prepare data with formatted currency values for display
  const displayData = {
    ...data,
    // Format currency fields for better display
    premiumAmount: formatCurrencyToGHS(data.premiumAmount),
    stickerFee: formatCurrencyToGHS(data.stickerFee),
    firstInstallment: formatCurrencyToGHS(data.firstInstallment),
    minimumInitialDeposit: formatCurrencyToGHS(data.minimumInitialDeposit),
    initialloanAmount: formatCurrencyToGHS(data.initialloanAmount),
    actualProcessingFee: formatCurrencyToGHS(data.actualProcessingFee),
    initialDeposit: formatCurrencyToGHS(data.initialDeposit),
    loanAmount: formatCurrencyToGHS(data.loanAmount),
    interestPerInstallment: formatCurrencyToGHS(data.interestPerInstallment),
    totalInterestValue: formatCurrencyToGHS(data.totalInterestValue),
    totalRepayment: formatCurrencyToGHS(data.totalRepayment),
    currentDeposit: formatCurrencyToGHS(data.currentDeposit),
    regularInstallment: formatCurrencyToGHS(data.regularInstallment),
    totalPaid: formatCurrencyToGHS(data.totalPaid),
    balance: formatCurrencyToGHS(data.balance),
    lastInstallmentvalue: formatCurrencyToGHS(data.lastInstallmentvalue),
    processingFeeRate: `${data.processingFeeRate * 100}%`,
    // Format raw rate fields (only the matching frequency will be shown)
    monthlyInterestRate: data.monthlyRate,
    dailyInterestRate: data.dailyRate,
    weeklyInterestRate: data.weeklyRate,
  };

  // Determine which rate fields to exclude based on payment frequency
  const excludeKeys = [
    "balance",
    "lastInstallmentvalue",
    "payDifference",
    "currentDeposit",
    "appliedRatePercent",
    "appliedRate",
    "lastInstallmentno",
    "lastInstallmentdate",
    "interestRatePercent",
    "duration",
    "initialProcessingFee",
    "totalInterestValue",
    "interestRate",
    "appliedRate",
    "appliedRatePercent",
    "weeklyRate",
    "monthlyRate",
    "dailyRate",
    "initialloanAmount",
    "firstInstallment",
    "stickerFee",
  ];

  // Exclude rate fields that don't match the payment frequency
  if (paymentFrequency !== "monthly") {
    excludeKeys.push("monthlyInterestRate", "monthlyRatePercent");
  }
  if (paymentFrequency !== "daily") {
    excludeKeys.push("dailyInterestRate", "dailyRatePercent");
  }
  if (paymentFrequency !== "weekly") {
    excludeKeys.push("weeklyInterestRate", "weeklyRatePercent");
  }
  if (
    quoteType === MAIN_PRODUCT_QUOTE_TYPES.THIRDPARTY ||
    quoteType === MAIN_PRODUCT_QUOTE_TYPES.COMPREHENSIVE
  ) {
    excludeKeys.push("stickerFee");
  }

  const fields = prepareObjectFields(
    displayData,
    excludeKeys as (keyof typeof displayData)[]
  );

  return (
    <div className="p-4 bg-gray-50 rounded-lg space-y-2">
      <h4 className="font-semibold text-sm">Loan Calculation Summary</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {fields.map(({ key, label, value }) => (
          <div className="text-sm" key={key}>
            <span className="text-gray-600">{label}:</span>
            <span className="font-medium ml-2">{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
