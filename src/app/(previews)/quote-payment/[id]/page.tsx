'use client'

import ContractHeader from '@/components/preview/contract-header'
import { Card, CardContent } from '@resolutinsurance/ipap-shared/components'
import { PremiumShieldTerms } from '@resolutinsurance/ipap-shared/components'
import { useAuth } from '@/hooks/use-auth'
import { API_BASE_URL, COOKIE_KEYS, UPLOADS_BASE_URL } from '@/lib/constants'
import { PaymentRecord } from '@/lib/interfaces'
import { formatDate } from '@/lib/utils'
import Cookies from 'js-cookie'
import { CheckSquare, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const QuotePaymentContractPage = () => {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const paymentId = id?.toString() || ''

  const [paymentRecord, setPaymentRecord] = useState<PaymentRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchPaymentRecord = async () => {
      if (!paymentId) {
        setError(new Error('Missing payment ID'))
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Try getting token from query params first (for PDF generation), then from cookies
        const accessToken =
          searchParams.get('authorization') ||
          Cookies.get(COOKIE_KEYS.accessToken)

        const response = await fetch(
          `${API_BASE_URL}/QuotePayment/singleQuote/${paymentId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            },
          },
        )

        if (!response.ok) {
          throw new Error(
            `Failed to fetch payment record: ${response.statusText}`,
          )
        }

        const data = await response.json()
        setPaymentRecord(data.message || null)
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to load payment record'),
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchPaymentRecord()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId])

  // Get customer name
  const customerName = paymentRecord?.user?.fullname || user?.fullname || 'N/A'

  // Get insurance company name
  const insuranceCompanyName = paymentRecord?.insuranceCompany?.name || 'N/A'

  // Get agent name
  const agentName = paymentRecord?.user_agent?.user?.fullname || 'N/A'

  // Get signature URL if available
  const signatureUrl =
    paymentRecord?.signature && typeof paymentRecord.signature === 'string'
      ? `${UPLOADS_BASE_URL}${paymentRecord.signature}`
      : null

  // Helper to format currency
  const formatCurrency = (
    value: string | number | undefined | null,
  ): string => {
    if (!value) return 'N/A'
    const num = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(num)) return 'N/A'
    return `GHS ${num.toLocaleString()}`
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading payment record...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="flex min-h-[400px] items-center justify-center"
        data-pdf-ready="true"
      >
        <Card className="max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="mb-4 text-red-600">
                Error loading payment record. Please try again.
              </p>
              <p className="text-muted-foreground text-sm">
                {error instanceof Error ? error.message : 'Unknown error'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!paymentRecord) {
    return (
      <div
        className="flex min-h-[400px] items-center justify-center"
        data-pdf-ready="true"
      >
        <div className="text-center">
          <p className="text-muted-foreground">
            No payment record found. Please check the payment ID.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8"
      data-pdf-ready="true"
    >
      {/* Header Section - PREMIUMSHIELD LOAN PRODUCT FORM */}
      <ContractHeader
        productName="PremiumShield"
        productCode={paymentRecord.refId || paymentRecord.id}
      />

      <div className="space-y-8">
        {/* Section 1: Product Details */}
        <div>
          <h3 className="mb-6 border-b-2 border-gray-800 pb-2 text-lg font-bold">
            1. Product Details
          </h3>

          {/* Product Details Grid */}
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div className="flex gap-2">
              <span className="font-semibold">Loan Type:</span>
              <span className="flex items-center gap-2">
                <CheckSquare className="text-primary h-4 w-4" />
                {paymentRecord.quoteType}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Target Borrower Profile:</span>
              <span>{customerName}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Currency:</span>
              <span>GHS (Ghana Cedis)</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Minimum Loan Amount:</span>
              <span>N/A</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Maximum Loan Amount:</span>
              <span>N/A</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Tenor (term):</span>
              <span>N/A</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Interest Rate:</span>
              <span>N/A</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Repayment Frequency:</span>
              <span>One-time payment</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Premium Amount:</span>
              <span>{formatCurrency(paymentRecord.premiumAmount)}</span>
            </div>
          </div>

          {/* Purpose of Loan */}
          <div className="mt-4 text-sm">
            <p>
              <span className="font-semibold">Purpose of Loan:</span> To pay
              insurance premium(s) (
              {paymentRecord.quoteType || 'motor / property'}, per selected Loan
              Type)
            </p>
          </div>

          {/* Fees and Early Settlement */}
          <div className="mt-4 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div className="flex gap-2">
              <span className="font-semibold">
                Fees (processing / facilitation / admin):
              </span>
              <span>N/A</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">
                Early Settlement / Prepayment Terms:
              </span>
              <span>N/A</span>
            </div>
          </div>
        </div>

        {/* Section 3: Documentation Required */}
        <div>
          <h3 className="mb-6 border-b-2 border-gray-800 pb-2 text-lg font-bold">
            3. Documentation Required
          </h3>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">Declaration Document:</span>{' '}
              {paymentRecord.declarationDoc ? 'Provided' : 'N/A'}
            </p>
            <p>
              <span className="font-semibold">Signature:</span>{' '}
              {paymentRecord.signature ? 'Provided' : 'N/A'}
            </p>
          </div>
        </div>

        {/* Section 4: Borrower Information */}
        <div>
          <h3 className="mb-6 border-b-2 border-gray-800 pb-2 text-lg font-bold">
            4. Borrower Information
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <p className="text-muted-foreground text-sm font-semibold">
                Borrower (Customer)
              </p>
              <p className="text-base font-semibold">{customerName}</p>
              <p className="text-muted-foreground text-sm">
                {paymentRecord.user?.email || 'N/A'}
              </p>
              <p className="text-muted-foreground text-sm">
                {paymentRecord.user?.phone || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-semibold">
                Lender
              </p>
              <p className="text-base font-semibold">{insuranceCompanyName}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-semibold">
                Agent
              </p>
              <p className="text-base font-semibold">{agentName}</p>
            </div>
          </div>
        </div>

        {/* Section 5: Policy Details */}
        <div>
          <h3 className="mb-6 border-b-2 border-gray-800 pb-2 text-lg font-bold">
            5. Policy Details
          </h3>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div className="flex gap-2">
              <span className="font-semibold">Quote Type:</span>
              <span>{paymentRecord.quoteType || 'N/A'}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Policy Number:</span>
              <span>{paymentRecord.PolicyNumber || 'N/A'}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Entity ID:</span>
              <span>{paymentRecord.entityid || 'N/A'}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Transaction Number:</span>
              <span>{paymentRecord.transaction_no || 'N/A'}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Payment Status:</span>
              <span className="capitalize">
                {paymentRecord.status || 'N/A'}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Payment Date:</span>
              <span>{formatDate(paymentRecord.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Section 6: Payment Method */}
        <div>
          <h3 className="mb-6 border-b-2 border-gray-800 pb-2 text-lg font-bold">
            6. Payment Method
          </h3>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div className="flex gap-2">
              <span className="font-semibold">Premium Amount:</span>
              <span>{formatCurrency(paymentRecord.premiumAmount)}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Payment Method:</span>
              <span>{paymentRecord.methodName || 'N/A'}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Account Number:</span>
              <span>{paymentRecord.accountNumber || 'N/A'}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Account Name:</span>
              <span>{paymentRecord.accountName || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Section 7: Terms and Conditions */}
        <div>
          <h3 className="mb-6 border-b-2 border-gray-800 pb-2 text-lg font-bold">
            7. Terms and Conditions
          </h3>
          <PremiumShieldTerms variant="short" />
        </div>

        {/* Section 8: Signatures */}
        <div>
          <h3 className="mb-6 border-b-2 border-gray-800 pb-2 text-lg font-bold">
            8. Signatures
          </h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <p className="text-muted-foreground mb-2 text-sm font-semibold">
                Borrower Signature
              </p>
              {signatureUrl ? (
                <Image
                  width={300}
                  height={150}
                  src={signatureUrl}
                  alt="Borrower Signature"
                  className="h-full max-h-[150px] w-full max-w-[300px] object-contain"
                />
              ) : (
                <div className="flex h-32 items-center justify-center rounded-lg border bg-gray-50 p-4">
                  <p className="text-muted-foreground text-sm">
                    No signature available
                  </p>
                </div>
              )}
              <p className="mt-2 text-sm font-semibold">{customerName}</p>
              <p className="text-muted-foreground text-xs">Borrower</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-sm font-semibold">
                Date
              </p>
              <p className="text-sm">{formatDate(new Date().toISOString())}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuotePaymentContractPage
