'use client'

import ContractHeader from '@/components/preview/contract-header'
import { Card, CardContent } from '@resolutinsurance/ipap-shared/components'
import { PremiumShieldTerms } from '@resolutinsurance/ipap-shared/components'
import { useAuth } from '@/hooks/use-auth'
import { API_BASE_URL, COOKIE_KEYS, UPLOADS_BASE_URL } from '@/lib/constants'
import { PaymentSchedule } from '@/lib/interfaces'
import { formatCurrencyToGHS, formatDate } from '@/lib/utils'
import Cookies from 'js-cookie'
import { CheckSquare, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const PremiumFinancingContractPage = () => {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const verificationType = searchParams.get('type') || ''
  const { user } = useAuth()
  const financingId = id?.toString() || ''

  const [paymentSchedule, setPaymentSchedule] =
    useState<PaymentSchedule | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const isRemoteVerification = verificationType === 'remote-verification'

  useEffect(() => {
    const fetchPremiumFinancing = async () => {
      if (!financingId) {
        setError(new Error('Missing financing ID'))
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

        // Remote verification links are public: use the dedicated public endpoint.
        const endpoint = isRemoteVerification
          ? `${API_BASE_URL}/PremiumFinancing/remote-verification/${financingId}`
          : `${API_BASE_URL}/PremiumFinancing/${financingId}`

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken &&
              !isRemoteVerification && {
                Authorization: `Bearer ${accessToken}`,
              }),
          },
        })

        if (!response.ok) {
          throw new Error(
            `Failed to fetch premium financing: ${response.statusText}`,
          )
        }

        const data = await response.json()
        // The response may be wrapped in a message property or directly be PaymentSchedule
        // Handle both response.data and response.data.message structures
        const scheduleData = data.message
        setPaymentSchedule(scheduleData)
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to load premium financing'),
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchPremiumFinancing()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [financingId])

  // Get customer name
  const customerName =
    paymentSchedule?.user?.fullname || user?.fullname || 'N/A'

  // Get signature URL if available
  const signatureUrl =
    paymentSchedule?.signature && typeof paymentSchedule.signature === 'string'
      ? `${UPLOADS_BASE_URL}${paymentSchedule.signature}`
      : null

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">
            Loading premium financing details...
          </p>
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
                Error loading premium financing details. Please try again.
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

  if (!paymentSchedule) {
    return (
      <div
        className="flex min-h-[400px] items-center justify-center"
        data-pdf-ready="true"
      >
        <div className="text-center">
          <p className="text-muted-foreground">
            No premium financing details found. Please check the financing ID.
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
        productCode={paymentSchedule.refId || paymentSchedule.id}
      />

      <div className="space-y-8">
        {/* Section 1: Product Details */}
        <div>
          <h3 className="mb-6 border-b-2 border-gray-800 pb-2 text-lg font-bold">
            1. Product Details
          </h3>

          {/* Loan Type Selection */}

          {/* Product Details Grid */}
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div className="flex gap-2">
              <span className="font-semibold">Loan Type:</span>
              <span className="flex items-center gap-2">
                <CheckSquare className="text-primary h-4 w-4" />
                {paymentSchedule.quoteType}
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
              <span>
                {formatCurrencyToGHS(paymentSchedule.minimumInitialDeposit)}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Maximum Loan Amount:</span>
              <span>{formatCurrencyToGHS(paymentSchedule.loanAmount)}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Tenor (term):</span>
              <span>
                {paymentSchedule.duration
                  ? `${paymentSchedule.duration} months (${paymentSchedule.noofInstallments} installments)`
                  : `${paymentSchedule.noofInstallments} installments`}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Interest Rate:</span>
              <span>
                {paymentSchedule.interestRate
                  ? `${parseFloat(paymentSchedule.interestRate).toFixed(2)}% per annum`
                  : 'N/A'}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Repayment Frequency:</span>
              <span className="capitalize">
                {paymentSchedule.paymentFrequency || 'N/A'}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Premium Amount:</span>
              <span>{formatCurrencyToGHS(paymentSchedule.premiumAmount)}</span>
            </div>
          </div>

          {/* Purpose of Loan */}
          <div className="mt-4 text-sm">
            <p>
              <span className="font-semibold">Purpose of Loan:</span> To pay
              insurance premium(s) (
              {paymentSchedule.quoteType || 'motor / property'}, per selected
              Loan Type)
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
              <span>No penalty for early settlement</span>
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
              {paymentSchedule.declarationDoc ? 'Provided' : 'N/A'}
            </p>
            <p>
              <span className="font-semibold">Signature:</span>{' '}
              {paymentSchedule.signature ? 'Provided' : 'N/A'}
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
                {paymentSchedule.user?.email || 'N/A'}
              </p>
              <p className="text-muted-foreground text-sm">
                {paymentSchedule.user?.phone || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-semibold">
                Lender
              </p>
              <p className="text-base font-semibold">
                Globafin Microfinance Limited
              </p>
            </div>
          </div>
        </div>

        {/* Section 5: Payment Schedule */}
        <div>
          <h3 className="mb-6 border-b-2 border-gray-800 pb-2 text-lg font-bold">
            5. Payment Schedule
          </h3>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div className="flex gap-2">
              <span className="font-semibold">Regular Installment:</span>
              <span>
                {formatCurrencyToGHS(paymentSchedule.regularInstallment)}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Interest Per Installment:</span>
              <span>
                {formatCurrencyToGHS(paymentSchedule.interestPerInstallment)}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Initial Deposit:</span>
              <span>{formatCurrencyToGHS(paymentSchedule.initialDeposit)}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Current Deposit:</span>
              <span>{formatCurrencyToGHS(paymentSchedule.currentDeposit)}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Outstanding Balance:</span>
              <span>{formatCurrencyToGHS(paymentSchedule.balance)}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Total Interest:</span>
              <span>
                {formatCurrencyToGHS(paymentSchedule.totalInterestvalue)}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Total Repayment:</span>
              <span>{formatCurrencyToGHS(paymentSchedule.totalRepayment)}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Total Paid:</span>
              <span>{formatCurrencyToGHS(paymentSchedule.totalPaid)}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Loan Status:</span>
              <span className="capitalize">
                {paymentSchedule.loanStatus || 'N/A'}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Agreement Date:</span>
              <span>{formatDate(paymentSchedule.createdAt)}</span>
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
              <span className="font-semibold">Payment Method:</span>
              <span>{paymentSchedule.methodName || 'N/A'}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Account Number:</span>
              <span>{paymentSchedule.accountNumber || 'N/A'}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Account Name:</span>
              <span>{paymentSchedule.accountName || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Section 7: Terms and Conditions */}
        <div>
          <h3 className="mb-6 border-b-2 border-gray-800 pb-2 text-lg font-bold">
            7. Terms and Conditions
          </h3>
          <PremiumShieldTerms
            noofInstallments={paymentSchedule.noofInstallments}
            regularInstallment={
              paymentSchedule.regularInstallment
                ? formatCurrencyToGHS(paymentSchedule.regularInstallment)
                : undefined
            }
            paymentFrequency={paymentSchedule.paymentFrequency}
            interestRate={paymentSchedule.interestRate}
            initialDeposit={formatCurrencyToGHS(paymentSchedule.initialDeposit)}
            variant="full"
          />
        </div>

        {/* Section 8: Signatures */}
        <div>
          <h3 className="mb-6 border-b-2 border-gray-800 pb-2 text-lg font-bold">
            8. Signatures
          </h3>
          <div className="grid grid-cols-1 gap-8">
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
                  className="h-full max-h-[150px] w-full object-contain"
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

export default PremiumFinancingContractPage
