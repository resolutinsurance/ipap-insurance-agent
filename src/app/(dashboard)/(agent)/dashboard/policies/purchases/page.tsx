'use client'

import { RenderDataTable } from '@/components/table'
import { Card, CardContent } from '@resolutinsurance/ipap-shared/components'
import { useQuotePayments } from '@/hooks/use-quote-payments'
import {
  createViewDetailsActionColumn,
  QUOTE_PAYMENT_COLUMNS,
} from '@/lib/columns'
import { PaymentRecord } from '@/lib/interfaces'
import { transformQuoteTypeToProductType } from '@/lib/utils'
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter()

  const { allQuotePaymentsQuery, pagination: companyPagination } =
    useQuotePayments()

  const handleViewDetails = (payment: PaymentRecord) => {
    const productType = transformQuoteTypeToProductType(payment.quoteType)
    router.push(`/dashboard/policies/purchases/${productType}/${payment.id}`)
  }

  const columns = [
    ...QUOTE_PAYMENT_COLUMNS,
    createViewDetailsActionColumn<PaymentRecord>(handleViewDetails),
  ]
  return (
    <Card>
      <CardContent>
        <RenderDataTable
          data={allQuotePaymentsQuery.data?.message || []}
          columns={columns}
          title="Purchased Policies"
          showSearchField
          searchPlaceHolder="Search policies..."
          showPagination
          isLoading={allQuotePaymentsQuery.isLoading}
          pagination={companyPagination}
          onPaginate={companyPagination.setPage}
          onRowClicked={handleViewDetails}
        />
      </CardContent>
    </Card>
  )
}

export default Page
