"use client";

import { Button } from "@/components/ui/button";
import { usePremiumFinancingById } from "@/hooks/use-premium-financing";
import { PaymentVerificationState } from "@/lib/store/payment-verification";
import { formatCurrencyToGHS } from "@/lib/utils";

const PreviewPremiumFinancingDetails = ({
  id,
  onNext,
  onCancel,
}: {
  id: string;
  onCancel: () => void;
  onNext?: (loanData?: PaymentVerificationState["loanData"]) => void;
}) => {
  const { getPremiumFinancingById } = usePremiumFinancingById(id);

  const premiumFinancing = getPremiumFinancingById.data;

  if (getPremiumFinancingById.isLoading) {
    return <div>Loading...</div>;
  }

  if (getPremiumFinancingById.error) {
    return <div>Error: {getPremiumFinancingById.error.message}</div>;
  }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Preview Details</h1>

      {premiumFinancing && (
        <div className="grid grid-cols-1 gap-6">
          {/* Financing Details */}
          <div className="bg-white p-4 rounded-lg border">
            <h2 className="text-lg font-medium mb-3 text-gray-800">Financing Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Premium Amount:</span>
                <span className="font-medium">
                  {formatCurrencyToGHS(premiumFinancing.premiumAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Initial Deposit:</span>
                <span className="font-medium">
                  {formatCurrencyToGHS(premiumFinancing.initialDeposit)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Loan Amount:</span>
                <span className="font-medium">
                  {formatCurrencyToGHS(premiumFinancing.loanAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Schedule */}
          <div className="bg-white p-4 rounded-lg border">
            <h2 className="text-lg font-medium mb-3 text-gray-800">Payment Schedule</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Regular Installment:</span>
                <span className="font-medium">
                  {formatCurrencyToGHS(premiumFinancing.regularInstallment)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Frequency:</span>
                <span className="font-medium">{premiumFinancing.paymentFrequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Number of Installments:</span>
                <span className="font-medium">{premiumFinancing.noofInstallments}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Repayment:</span>
                <span className="font-medium">
                  {formatCurrencyToGHS(premiumFinancing.totalRepayment)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (premiumFinancing && onNext) {
                  // Extract loan data from premium financing (loan calculation done on agent side)
                  const initialDeposit = parseFloat(
                    premiumFinancing.initialDeposit || "0"
                  );
                  const duration =
                    premiumFinancing.duration || premiumFinancing.noofInstallments || 0;
                  const paymentFrequency = premiumFinancing.paymentFrequency || "";

                  // Call onNext with loan data if we have valid data
                  if (duration > 0 && paymentFrequency) {
                    onNext({
                      initialDeposit,
                      duration,
                      paymentFrequency,
                    });
                  } else {
                    onNext();
                  }
                }
              }}
              className="min-w-[140px]"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {!premiumFinancing && (
        <div className="text-center text-gray-500">
          No premium financing details available
        </div>
      )}
    </div>
  );
};

export default PreviewPremiumFinancingDetails;
