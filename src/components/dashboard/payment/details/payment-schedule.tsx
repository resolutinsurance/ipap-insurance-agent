import { prepareObjectFields } from '@/lib/data-renderer'
import {
  Agent,
  ComprehensiveQuoteRequestData,
  InsuranceCompany,
  PaymentRecord,
  PaymentSchedule,
  ThirdPartyQuoteRequestData,
  User,
} from '@/lib/interfaces'
import { transformQuoteTypeToProductType } from '@/lib/utils'
import { Button, Separator } from '@resolutinsurance/ipap-shared/components'
import { useRouter } from 'next/navigation'
import InfoRow from './info-row'

interface PaymentScheduleDetailsProps {
  record: PaymentSchedule
  purchaseData?: PaymentRecord
}

const PaymentScheduleDetails = ({
  record,
  purchaseData,
}: PaymentScheduleDetailsProps) => {
  const router = useRouter()

  // Exclude nested objects (they're shown separately)
  const exclude: (keyof PaymentSchedule)[] = [
    'user',
    'user_agent',
    'insuranceCompany',
  ]
  const userExclude: (keyof User)[] = []
  const agentExclude: (keyof Agent)[] = []
  const insuranceCompanyExclude: (keyof InsuranceCompany)[] = []

  const handlePayNextInstallment = () => {
    // Check if this is a bundle payment
    const isBundle =
      record.quoteType === 'Bundle' || !!record.assignedBundleName

    // For bundles or installments, redirect to bundles payment page
    if (isBundle) {
      const bundleId = record.assignedBundleName || ''
      const paymentUrl = `/dashboard/policies/purchases/bundles?bundleId=${bundleId}&cId=${record.userID}&type=premium-financing&isInstallment=true`
      router.push(paymentUrl)
      return
    }

    // For non-bundle payments, use the general payment form
    // Use utility function to map quoteType to productType
    const productType = transformQuoteTypeToProductType(record.quoteType)
    const requestId = record.entityid || ''
    const companyId = record.companyID || ''

    const paymentUrl = `/dashboard/policies/purchases/pay-direct?productType=${productType}&companyId=${companyId}&requestId=${requestId}&type=premium-financing&cId=${record.userID}&isInstallment=true`
    router.push(paymentUrl)
  }

  return (
    <section className="space-y-6">
      <div className="space-y-6">
        <div className="space-y-10">
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Payment Schedule Details
                </h3>
                <div className="flex gap-2">
                  {(() => {
                    // Check for PART PAYMENT status in entityObj (for motor/fire policies)
                    const entityObj = purchaseData?.entityObj as
                      | ComprehensiveQuoteRequestData
                      | ThirdPartyQuoteRequestData
                      | undefined
                    const hasPartPayment =
                      entityObj &&
                      'paymentStatus' in entityObj &&
                      entityObj.paymentStatus?.includes('PART PAYMENT')

                    // For bundles, check loanStatus from the payment schedule record
                    const isBundlePayment = record.quoteType === 'Bundle'
                    const hasActiveLoan =
                      isBundlePayment &&
                      record.loanStatus &&
                      record.loanStatus.toLowerCase().includes('payment')

                    return hasPartPayment || hasActiveLoan ? (
                      <Button
                        onClick={handlePayNextInstallment}
                        variant="default"
                      >
                        Pay Next Installment
                      </Button>
                    ) : null
                  })()}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
              {prepareObjectFields(
                record as unknown as Record<string, unknown>,
                exclude as string[],
              ).map(({ key, label, value }) => (
                <InfoRow key={key} label={label} value={value} />
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-5">
            <h3 className="text-lg font-semibold">User</h3>
            <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
              {prepareObjectFields(
                record.user as unknown as Record<string, unknown>,
                userExclude as string[],
              ).map(({ key, label, value }) => (
                <InfoRow key={key} label={label} value={value} />
              ))}
            </div>
          </div>
          {record.user_agent && (
            <>
              <Separator />
              <div className="flex flex-col gap-5">
                <h3 className="text-lg font-semibold">User Agent</h3>
                <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
                  {prepareObjectFields(
                    record.user_agent as unknown as Record<string, unknown>,
                    agentExclude as string[],
                  ).map(({ key, label, value }) => (
                    <InfoRow key={key} label={label} value={value} />
                  ))}
                </div>
              </div>
            </>
          )}

          {record.insuranceCompany && (
            <>
              <Separator />
              <div className="flex flex-col gap-5">
                <h3 className="text-lg font-semibold">Insurance Company</h3>
                <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
                  {prepareObjectFields(
                    record.insuranceCompany as unknown as Record<
                      string,
                      unknown
                    >,
                    insuranceCompanyExclude as string[],
                  ).map(({ key, label, value }) => (
                    <InfoRow key={key} label={label} value={value} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default PaymentScheduleDetails
