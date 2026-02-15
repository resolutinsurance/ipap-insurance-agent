'use client'

import ConfirmCustomerAutoDebitOTP from '@/components/modals/confirm-customer-auto-debit-otp'
import { useQuotePayments } from '@/hooks/use-quote-payments'
import { ROUTES } from '@/lib/constants'
import { clearPaymentSession } from '@/lib/store/payment-storage'
import { Button } from '@resolutinsurance/ipap-shared/components'
import Image from 'next/image'
import React from 'react'
import { toast } from 'sonner'
import PaymentGuidelines from './guidelines'

const ApprovalScreen = ({
  type,
  network,
  refId,
  paymentId,
  pfId,
  onNext,
}: {
  type: 'premium-financing' | 'one-time'
  paymentId: string
  network: string
  refId: string
  accountNumber: string
  /** Premium Financing ID (premiumfinancingID from quote payment) - required for premium-financing type */
  pfId?: string
  onNext?: () => void
}) => {
  const { verifyPayment, verifyAPNMPayment } = useQuotePayments()
  const [loading, setLoading] = React.useState(false)
  const [showOTPModal, setShowOTPModal] = React.useState(false)

  const handleVerify = async () => {
    if (!refId && !paymentId) {
      toast.error('Reference ID is required')
      return
    }
    setLoading(true)
    try {
      await verifyAPNMPayment.mutateAsync({
        type,
        id: paymentId || refId,
      })

      toast.success('Verification successful')

      // If premium financing, show OTP modal instead of redirecting
      if (type === 'premium-financing' && pfId) {
        setShowOTPModal(true)
      } else {
        if (onNext) {
          onNext()
        } else {
          // For one-time payments, redirect to purchased page
          window.location.href = ROUTES.AGENT.POLICY.PURCHASED
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('400')) {
        toast.error('Transaction has not been completed yet.')
      } else {
        toast.error(
          error instanceof Error ? error.message : 'Failed to verify payment',
        )
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOTPSuccess = () => {
    setShowOTPModal(false)
    toast.success('Auto-debit setup completed!')
    if (onNext) {
      onNext()
    } else {
      // For one-time payments, redirect to purchased page
      window.location.href = ROUTES.AGENT.POLICY.PURCHASED
    }
  }

  const handleOTPClose = () => {
    setShowOTPModal(false)
    // Still redirect after closing modal since payment was verified
    if (onNext) {
      onNext()
    } else {
      // For one-time payments, redirect to purchased page
      window.location.href = ROUTES.AGENT.POLICY.PURCHASED
    }
  }

  return (
    <>
      <div className="mx-auto flex w-full flex-col items-center space-y-6 md:max-w-2xl md:p-10">
        <Image
          src="/assets/pending_approval.svg"
          width={300}
          height={300}
          alt="Approval Pending"
          priority
          className="mb-4"
        />

        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Approval Pending</h1>
          <p className="text-muted-foreground">
            Your payment is currently under review. Please check back later for
            updates.
          </p>
        </div>
        <PaymentGuidelines network={network} />
        <div className="flex w-full flex-col items-center justify-center gap-5 sm:flex-row">
          <Button
            className="w-[200px] bg-red-500 hover:bg-red-500/90"
            type="button"
            onClick={() => {
              clearPaymentSession()
              window.location.href = ROUTES.AGENT.POLICY.PURCHASED
            }}
          >
            Cancel
          </Button>
          <Button
            className="w-full max-w-[200px]"
            disabled={loading || verifyPayment.isPending}
            onClick={handleVerify}
          >
            {loading || verifyPayment.isPending
              ? 'Verifying...'
              : 'I have Paid'}
          </Button>
        </div>
      </div>

      {/* Auto Debit OTP Modal - Only for Premium Financing */}
      {type === 'premium-financing' && pfId && (
        <ConfirmCustomerAutoDebitOTP
          isOpen={showOTPModal}
          onClose={handleOTPClose}
          onSuccess={handleOTPSuccess}
          pfId={pfId}
          length={5}
          title="Confirm Auto-Debit Setup"
          description="Enter the OTP sent to your phone to confirm the auto-debit setup for your premium financing."
        />
      )}
    </>
  )
}

export default ApprovalScreen
