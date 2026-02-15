'use client'

import { RenderDataTable } from '@/components/table'
import useGeneratePDF from '@/hooks/use-generate-pdf'
import { useDirectPremiumFinancingSchedule } from '@/hooks/use-premium-financing'
import { PAYMENT_SCHEDULE_ITEM_COLUMNS } from '@/lib/columns'
import { PremiumFinancingScheduleRequest } from '@/lib/interfaces'
import { formatCurrencyToGHS } from '@/lib/utils'
import { Button } from '@resolutinsurance/ipap-shared/components'

interface RepaymentSchedulePreviewStepProps {
  paymentData: PremiumFinancingScheduleRequest
  onNext: () => void
  onCancel: () => void
}

export const RepaymentSchedulePreviewStep = ({
  paymentData,
  onNext,
  onCancel,
}: RepaymentSchedulePreviewStepProps) => {
  const { getPremiumFinancingSchedule } =
    useDirectPremiumFinancingSchedule(paymentData)
  const { generating: isGeneratingPdf, generateAndDownload } = useGeneratePDF()

  const scheduleData = getPremiumFinancingSchedule.data?.message
  const scheduleItems = scheduleData?.schedule || []
  const isLoading = getPremiumFinancingSchedule.isLoading
  const error = getPremiumFinancingSchedule.error

  const handleDownloadPdf = async () => {
    try {
      if (typeof window === 'undefined') return
      await generateAndDownload(
        `${window.location.origin}/repayment-schedule`,
        'repayment-schedule.pdf',
        paymentData,
      )
    } catch (e) {
      console.error('Failed to download repayment schedule PDF', e)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="mb-2 text-2xl font-semibold">
            Repayment Schedule Preview
          </h2>
          <p className="text-muted-foreground text-sm">
            Review your repayment schedule before proceeding with payment
          </p>
        </div>
        {scheduleData && (
          <Button
            variant="outline"
            type="button"
            size="sm"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
          >
            {isGeneratingPdf ? 'Downloading...' : 'Download PDF'}
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">
            {error instanceof Error
              ? error.message
              : 'Failed to load repayment schedule'}
          </p>
        </div>
      )}

      {scheduleData && (
        <div className="space-y-4">
          {/* Summary Information */}
          <div className="bg-muted/50 grid grid-cols-1 gap-4 rounded-lg p-4 md:grid-cols-2">
            <div>
              <p className="text-muted-foreground text-sm">Initial Deposit</p>
              <p className="font-semibold">
                {formatCurrencyToGHS(scheduleData.initialDeposit)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Loan Amount</p>
              <p className="font-semibold">
                {formatCurrencyToGHS(scheduleData.loanAmount)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total Repayment</p>
              <p className="font-semibold">
                {formatCurrencyToGHS(scheduleData.totalRepayment)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Payment Frequency</p>
              <p className="font-semibold">{scheduleData.paymentFrequency}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">
                Regular Installment
              </p>
              <p className="font-semibold">
                {formatCurrencyToGHS(scheduleData.regularInstallment)}
              </p>
            </div>
          </div>

          <div className="rounded-lg border">
            <RenderDataTable
              data={scheduleItems}
              columns={PAYMENT_SCHEDULE_ITEM_COLUMNS}
              title="Payment Schedule"
              isLoading={isLoading}
              showPagination={false}
              hideTitle={true}
              showExportAction={false}
              showColumnsFilter={false}
            />
          </div>
        </div>
      )}

      {!scheduleData && !isLoading && !error && (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">
            No repayment schedule available
          </p>
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
  )
}
