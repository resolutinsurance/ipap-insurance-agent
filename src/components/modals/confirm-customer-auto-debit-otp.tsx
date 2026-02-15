'use client'

import {
  useAutoDebitOTP,
  usePremiumFinancingById,
} from '@/hooks/use-premium-financing'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  OTPInput,
} from '@resolutinsurance/ipap-shared/components'
import { Loader2, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface ConfirmCustomerAutoDebitOTPProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  /** Premium Financing ID */
  pfId: string
  length?: number
  title?: string
  description?: string
}

const ConfirmCustomerAutoDebitOTP = ({
  isOpen,
  onClose,
  onSuccess,
  pfId,
  length = 4,
  title = 'Enter Verification Code',
  description = 'Please enter the OTP sent to your registered phone number to confirm the auto-debit setup.',
}: ConfirmCustomerAutoDebitOTPProps) => {
  const [otpValues, setOtpValues] = useState<string[]>(Array(length).fill(''))
  const [resendCooldown, setResendCooldown] = useState(0)

  const { confirmAutoDebitOTP, resendAutoDebitOTP } = useAutoDebitOTP()

  // Fetch premium financing data to get uniq_ref_id (refId)
  const { getPremiumFinancingById } = usePremiumFinancingById(
    pfId,
    isOpen && !!pfId, // Only fetch when modal is open and pfId is available
  )

  // Extract uniqRefId from fetched data
  const uniqRefId = getPremiumFinancingById.data?.refId || ''

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000,
      )
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  // Reset OTP values when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtpValues(Array(length).fill(''))
    }
  }, [isOpen, length])

  const handleOtpChange = (newValues: string[]) => {
    setOtpValues(newValues)
  }

  const handleConfirm = async () => {
    const otp = otpValues.join('')
    if (otp.length !== length) {
      toast.error('Please enter the complete OTP')
      return
    }

    if (!uniqRefId) {
      toast.error('Unable to get reference ID. Please try again.')
      return
    }

    try {
      await confirmAutoDebitOTP.mutateAsync({
        uniq_ref_id: uniqRefId,
        auth_code: otp,
        pfId: pfId,
      })
      toast.success('Auto-debit setup confirmed successfully!')
      onSuccess?.()
      handleClose()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to verify OTP. Please try again.',
      )
    }
  }

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return

    try {
      await resendAutoDebitOTP.mutateAsync({ pfId })
      toast.success('OTP resent successfully!')
      setResendCooldown(60) // 60 seconds cooldown
      setOtpValues(Array(length).fill('')) // Clear current OTP
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to resend OTP. Please try again.',
      )
    }
  }

  const handleClose = () => {
    setOtpValues(Array(length).fill(''))
    onClose()
  }

  const isOtpComplete =
    otpValues.every((v) => v !== '') && otpValues.length === length
  const isLoading =
    confirmAutoDebitOTP.isPending || getPremiumFinancingById.isLoading
  const isResending = resendAutoDebitOTP.isPending
  const isFetchingData = getPremiumFinancingById.isLoading

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {isFetchingData ? (
            <div className="flex items-center gap-2 py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-muted-foreground text-sm">
                Loading payment details...
              </span>
            </div>
          ) : (
            <>
              <OTPInput
                value={otpValues}
                onChange={handleOtpChange}
                length={length}
              />

              {/* Resend OTP Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResendOTP}
                disabled={isResending || resendCooldown > 0}
                className="text-muted-foreground hover:text-primary text-sm"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Resending...
                  </>
                ) : resendCooldown > 0 ? (
                  `Resend OTP in ${resendCooldown}s`
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-3 w-3" />
                    Resend OTP
                  </>
                )}
              </Button>
            </>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isOtpComplete || isLoading || !uniqRefId}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isFetchingData ? 'Loading...' : 'Verifying...'}
              </>
            ) : (
              'Confirm'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmCustomerAutoDebitOTP
