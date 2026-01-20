"use client";

import { RenderDataTable } from "@/components/table";
import { Button } from "@/components/ui/button";
import { useDirectPremiumFinancingSchedule } from "@/hooks/use-premium-financing";
import { PAYMENT_SCHEDULE_ITEM_COLUMNS } from "@/lib/columns";
import { PremiumFinancingScheduleRequest } from "@/lib/interfaces";
import { formatCurrencyToGHS } from "@/lib/utils";

interface RepaymentSchedulePreviewStepProps {
  paymentData: PremiumFinancingScheduleRequest;
  onNext: () => void;
  onCancel: () => void;
}

export const RepaymentSchedulePreviewStep = ({
  paymentData,
  onNext,
  onCancel,
}: RepaymentSchedulePreviewStepProps) => {
  const { getPremiumFinancingSchedule } = useDirectPremiumFinancingSchedule(paymentData);

  const scheduleData = getPremiumFinancingSchedule.data?.message;
  const scheduleItems = scheduleData?.schedule || [];
  const isLoading = getPremiumFinancingSchedule.isLoading;
  const error = getPremiumFinancingSchedule.error;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Repayment Schedule Preview</h2>
        <p className="text-sm text-muted-foreground">
          Review your repayment schedule before proceeding with payment
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">
            {error instanceof Error ? error.message : "Failed to load repayment schedule"}
          </p>
        </div>
      )}

      {scheduleData && (
        <div className="space-y-4">
          {/* Summary Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Initial Deposit</p>
              <p className="text-lg font-semibold">
                {formatCurrencyToGHS(scheduleData.initialDeposit)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Loan Amount</p>
              <p className="text-lg font-semibold">
                {formatCurrencyToGHS(scheduleData.loanAmount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Repayment</p>
              <p className="text-lg font-semibold">{scheduleData.totalRepayment}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Frequency</p>
              <p className="text-lg font-semibold">{scheduleData.paymentFrequency}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Regular Installment</p>
              <p className="text-lg font-semibold">
                {formatCurrencyToGHS(scheduleData.regularInstallment)}
              </p>
            </div>
          </div>

          <div className="border rounded-lg">
            <RenderDataTable
              data={scheduleItems}
              columns={PAYMENT_SCHEDULE_ITEM_COLUMNS}
              title="Payment Schedule"
              isLoading={isLoading}
              showExportAction={false}
              showPagination={false}
              hideTitle={true}
              showColumnsFilter={false}
            />
          </div>
        </div>
      )}

      {!scheduleData && !isLoading && !error && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No repayment schedule available</p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onCancel}>
          Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={isLoading || !!error || scheduleItems.length === 0}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
