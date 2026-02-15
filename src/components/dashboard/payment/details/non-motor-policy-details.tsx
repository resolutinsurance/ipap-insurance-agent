import { prepareObjectFields } from '@/lib/data-renderer'
import { NonMotorPolicy, PolicyResponse } from '@/lib/interfaces'
import { cn } from '@/lib/utils'
import { Separator } from '@resolutinsurance/ipap-shared/components'
import InfoRow from './info-row'

const NonMotorPolicyDetails = ({ policy }: { policy: PolicyResponse }) => {
  const nonMotorPolicy = policy.requestquote as NonMotorPolicy

  return (
    <section className="space-y-6">
      <div className="">
        <h3 className="mb-4 text-lg font-semibold">Quote Response</h3>
        <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
          {prepareObjectFields(
            {
              premiumAmount: policy?.premiumAmount,
              paymentFrequency: policy?.quote_response?.paymentFrequency,
              insuranceCompany: policy?.quote_response?.insuranceCompany?.name,
            } as Record<string, unknown>,
            [],
          ).map(({ key, label, value }) => (
            <InfoRow key={key} label={label} value={value} />
          ))}
        </div>
      </div>

      <Separator />

      <div className="">
        <h3 className="mb-4 text-lg font-semibold">Transaction Details</h3>
        <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
          {prepareObjectFields(
            {
              transaction_no: policy?.transaction_no,
              createdAt: policy?.createdAt,
              updatedAt: policy?.updatedAt,
              currency: policy?.currency,
              status: policy.status?.toUpperCase() || 'N/A',
            } as Record<string, unknown>,
            [],
          ).map(({ key, label, value }) => (
            <InfoRow
              key={key}
              label={label}
              value={value}
              valueClassName={
                key === 'status'
                  ? cn(
                      policy.status === 'pending' && 'text-yellow-600',
                      policy.status === 'approved' && 'text-green-600',
                      policy.status === 'rejected' && 'text-red-600',
                    )
                  : undefined
              }
            />
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-4 text-lg font-semibold">Policy Details</h3>
        <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
          {prepareObjectFields(
            {
              risk_type_id: nonMotorPolicy?.risk_type_id,
              risk_class_id: nonMotorPolicy?.risk_class_id,
              insuredItems: nonMotorPolicy?.insuredItems,
              sum_insured: nonMotorPolicy?.sum_insured,
              inception_date: nonMotorPolicy?.inception_date,
              expiry_date: nonMotorPolicy?.expiry_date,
              noofdays: nonMotorPolicy?.noofdays,
              specify_days: nonMotorPolicy?.specify_days,
              userID: nonMotorPolicy?.userID,
              reqQuoteID: nonMotorPolicy?.reqQuoteID,
            } as Record<string, unknown>,
            [],
          ).map(({ key, label, value }) => (
            <InfoRow key={key} label={label} value={value} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default NonMotorPolicyDetails
