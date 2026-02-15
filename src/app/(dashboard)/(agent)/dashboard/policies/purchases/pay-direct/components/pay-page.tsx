'use client'
import { DeclarationForm } from '@/components/dashboard/declaration/declaration-form'
import ApprovalScreen from '@/components/dashboard/payment/approval-screen'
import { GhanaCardVerificationStep } from '@/components/dashboard/payment/ghana-card-verification-step'
import { LoanCalculationStep } from '@/components/dashboard/payment/loan-calculation-step'
import { PaymentDetailsStep } from '@/components/dashboard/payment/payment-details-step'
import { RepaymentSchedulePreviewStep } from '@/components/dashboard/payment/repayment-schedule-preview-step'
import { Card, CardContent } from '@resolutinsurance/ipap-shared/components'
import { Stepper, type Step } from '@resolutinsurance/ipap-shared/components'
import { WidthConstraint } from '@resolutinsurance/ipap-shared/components'
import { usePaymentVerification } from '@/hooks/use-payment-verification'
import {
  useQuotePremiumAmount,
  type ProductTypeForPremium,
} from '@/hooks/use-quote-premium-amount'
import { useSubmitQuotePayment } from '@/hooks/use-submit-quote-payment'
import { getStandardPaymentSteps, UPLOADS_BASE_URL } from '@/lib/constants'
import {
  directPaymentVerificationAtom,
  getDefaultPaymentVerificationState,
} from '@/lib/store'
import type { PaymentVerificationState } from '@/lib/store/payment-verification'
import { transformProductTypeToQuoteType } from '@/lib/utils'
import { goToStepInUrl } from '@/lib/utils/step-navigation'
import { useAtom } from 'jotai'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

const PaymentDirect = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [directVerification, setDirectVerification] = useAtom(
    directPaymentVerificationAtom,
  )

  const productType = (searchParams.get('productType') ||
    'thirdparty') as ProductTypeForPremium
  const companyId = searchParams.get('companyId') || ''
  const quoteId = searchParams.get('requestId') || ''
  const paymentType = (searchParams.get('type') || 'one-time') as
    | 'premium-financing'
    | 'one-time'
  const customerId = searchParams.get('cId') || ''
  const policyId = searchParams.get('policyId') || ''
  const currentStep = Number(searchParams.get('step') || '1') || 1
  const [justVerified, setJustVerified] = React.useState(false)

  // Get verification state directly from Jotai atom (no session key needed since sessionStorage is session-specific)
  const quoteVerificationState = directVerification || {
    ghanaVerified: false,
    loanCalculated: false,
    declarationAccepted: false,
    loanData: undefined,
    signatureFilename: undefined,
  }

  const isLoanCalculated = quoteVerificationState.loanCalculated
  const isDeclarationAccepted = quoteVerificationState.declarationAccepted
  const signatureFilename = quoteVerificationState.signatureFilename
  const declarations = quoteVerificationState.declarations
  const loanData = quoteVerificationState.loanData

  const isPremiumFinancing = paymentType === 'premium-financing'
  const isInstallment = searchParams.get('isInstallment') === 'true'

  // Use shared hook to fetch quote data and calculate premium amount
  const { premiumAmount } = useQuotePremiumAmount({
    productType,
    quoteId,
    policyId,
  })

  const quoteType = transformProductTypeToQuoteType(productType)

  // Payment submission hook
  const { submitPayment, isSubmitting: isPaymentSubmitting } =
    useSubmitQuotePayment({
      premiumAmount,
      customerId,
      selectedCompanyId: companyId,
      selectedQuoteId: quoteId,
      type: paymentType,
      quoteType,
      isInstallment,
    })

  // Dynamic steps based on payment type
  const steps: Step[] = React.useMemo(
    () => getStandardPaymentSteps(isPremiumFinancing, isInstallment),
    [isPremiumFinancing, isInstallment],
  )

  // Update verification state helper
  const updateVerificationState = React.useCallback(
    async (updates: Partial<PaymentVerificationState>) => {
      setDirectVerification((prev) => {
        return {
          ...prev,
          type: 'direct', // Ensure type is set
          ...updates,
          // Preserve loanData if it exists and not being updated
          loanData: updates.loanData || prev.loanData,
          // Preserve other fields that aren't being updated
          ghanaVerified: updates.ghanaVerified ?? prev.ghanaVerified,
          loanCalculated: updates.loanCalculated ?? prev.loanCalculated,
          declarationAccepted:
            updates.declarationAccepted ?? prev.declarationAccepted,
          declarations: updates.declarations ?? prev.declarations,
          paymentData: updates.paymentData ?? prev.paymentData,
          signatureFilename:
            updates.signatureFilename ?? prev.signatureFilename,
        }
      })
    },
    [setDirectVerification],
  )

  // Get user data for verification (but always require verification, don't check status)
  const { user: verificationUser, isLoading: isVerificationLoading } =
    usePaymentVerification({ customerId })

  // Determine if verification is complete
  // Verification is complete when both verification ID and Ghana card number have been collected successfully
  const isVerificationComplete = React.useMemo(() => {
    // Check if verification ID exists (from public verification)
    const hasVerificationId =
      !!quoteVerificationState.ghanaCardId &&
      quoteVerificationState.ghanaCardId.trim() !== ''
    // Check if Ghana card number was collected
    const hasGhanaCardNumber =
      !!quoteVerificationState.ghanaCardNumber &&
      quoteVerificationState.ghanaCardNumber.trim() !== ''
    // Check if verification was marked as complete
    const isVerified = quoteVerificationState.ghanaVerified

    // All three must be present: verification ID, Ghana card number, and verification status
    return hasVerificationId && hasGhanaCardNumber && isVerified
  }, [
    quoteVerificationState.ghanaCardId,
    quoteVerificationState.ghanaCardNumber,
    quoteVerificationState.ghanaVerified,
  ])

  // Enforce verification requirement
  React.useEffect(() => {
    if (
      currentStep > 1 &&
      !isVerificationLoading &&
      !isVerificationComplete &&
      !justVerified
    ) {
      goToStepInUrl({
        router,
        pathname,
        searchParams,
        step: 1,
        maxStep: steps.length,
      })
    }
  }, [
    currentStep,
    isVerificationLoading,
    isVerificationComplete,
    justVerified,
    pathname,
    router,
    searchParams,
    steps.length,
  ])

  // Determine which step index corresponds to which action
  const getStepIndex = (stepName: string): number => {
    if (stepName === 'verification') return 1
    if (isPremiumFinancing && !isInstallment) {
      if (stepName === 'loan-calculation') return 2
      if (stepName === 'declaration') return 3
      if (stepName === 'repayment-schedule') return 4
      if (stepName === 'payment-details') return 5
      if (stepName === 'verify') return 6
    } else {
      if (stepName === 'declaration') return 2
      if (stepName === 'payment-details') return 3
      if (stepName === 'verify') return 4
    }
    return 1
  }

  const [approvalDetails, setApprovalDetails] = React.useState<{
    paymentId: string
    network: string
    refId: string
    accountNumber: string
    pfId?: string
  } | null>(null)

  const goToStep = (step: number) => {
    if (step > 1 && !isVerificationComplete && !justVerified) {
      goToStepInUrl({
        router,
        pathname,
        searchParams,
        step: 1,
        maxStep: steps.length,
      })
      return
    }

    goToStepInUrl({
      router,
      pathname,
      searchParams,
      step,
      maxStep: steps.length,
    })
  }

  return (
    <div className="">
      <Card>
        <CardContent>
          <WidthConstraint className="space-y-4 p-5 sm:space-y-5">
            <div className="flex flex-col gap-6 sm:gap-10 lg:flex-row">
              <Stepper
                steps={steps}
                currentStep={currentStep}
                className="w-full lg:max-h-[440px] lg:w-[320px]"
              />

              <div className="max-w-2xl flex-1">
                {currentStep === 1 &&
                  (isVerificationLoading ? (
                    <div className="py-6 text-center sm:py-8">
                      <p className="text-muted-foreground text-sm sm:text-base">
                        Loading user information...
                      </p>
                    </div>
                  ) : verificationUser ? (
                    <GhanaCardVerificationStep
                      userEmail={verificationUser.email}
                      userPhone={verificationUser.phone}
                      ghanaCardNumber={
                        quoteVerificationState.ghanaCardNumber ||
                        verificationUser.GhcardNo
                      }
                      verificationId={quoteVerificationState.ghanaCardId}
                      ghanaCardResponse={
                        quoteVerificationState.ghanaCardResponse
                      }
                      onSuccess={(
                        ghanaCardResponse,
                        verificationId,
                        ghanaCardNumber,
                      ) => {
                        setJustVerified(true)
                        setDirectVerification((prev) => ({
                          ...prev,
                          ghanaVerified: true,
                          ghanaCardId: verificationId,
                          ghanaCardNumber: ghanaCardNumber,
                          ghanaCardResponse: ghanaCardResponse,
                          declarationAccepted:
                            prev.declarationAccepted || false,
                        }))
                        goToStep(2)
                      }}
                      onCancel={() => router.back()}
                    />
                  ) : (
                    <div className="py-6 text-center sm:py-8">
                      <p className="text-muted-foreground text-sm sm:text-base">
                        Unable to load user information. Please try again.
                      </p>
                    </div>
                  ))}

                {/* Loan Calculation Step (Premium Financing only, not installments) */}
                {currentStep === getStepIndex('loan-calculation') &&
                  isPremiumFinancing &&
                  !isInstallment &&
                  (isVerificationComplete ? (
                    <LoanCalculationStep
                      premiumAmount={premiumAmount}
                      quoteType={quoteType}
                      verificationAtom={directPaymentVerificationAtom}
                      onNext={async () => {
                        // LoanCalculationStep already persists the full loanData (including summary fields)
                        // Just mark the step as complete here to avoid overwriting with a stale snapshot.
                        await updateVerificationState({
                          loanCalculated: true,
                        })
                        goToStep(getStepIndex('declaration'))
                      }}
                      onCancel={() => goToStep(currentStep - 1)}
                    />
                  ) : (
                    <div className="py-6 text-center sm:py-8">
                      <p className="text-muted-foreground text-sm sm:text-base">
                        Please complete Ghana card verification first
                      </p>
                    </div>
                  ))}

                {/* Declaration Step */}
                {currentStep === getStepIndex('declaration') &&
                  (isVerificationComplete &&
                  (!isPremiumFinancing || isInstallment || isLoanCalculated) ? (
                    <DeclarationForm
                      updateVerificationState={updateVerificationState}
                      initialDeclarations={declarations}
                      initialSignature={
                        signatureFilename
                          ? `${UPLOADS_BASE_URL}${signatureFilename}`
                          : undefined
                      }
                      skipQuoteUpdate={true}
                      onSuccess={async (sigFilename) => {
                        await updateVerificationState({
                          declarationAccepted: true,
                          signatureFilename: sigFilename,
                        })
                        // For premium financing, go to repayment schedule preview, otherwise go to payment details
                        if (isPremiumFinancing && !isInstallment) {
                          goToStep(getStepIndex('repayment-schedule'))
                        } else {
                          goToStep(getStepIndex('payment-details'))
                        }
                      }}
                      onCancel={() => goToStep(currentStep - 1)}
                    />
                  ) : (
                    <div className="py-6 text-center sm:py-8">
                      <p className="text-muted-foreground text-sm sm:text-base">
                        {!isVerificationComplete
                          ? 'Please complete Ghana card verification first'
                          : 'Please complete the previous steps first'}
                      </p>
                    </div>
                  ))}

                {/* Repayment Schedule Preview Step (Premium Financing only) */}
                {currentStep === getStepIndex('repayment-schedule') &&
                  isPremiumFinancing &&
                  !isInstallment &&
                  (isVerificationComplete && isDeclarationAccepted ? (
                    loanData?.noofInstallments &&
                    loanData?.loanAmount != null &&
                    loanData?.totalRepayment != null &&
                    loanData?.totalPaid != null ? (
                      <RepaymentSchedulePreviewStep
                        paymentData={{
                          initialDeposit: String(loanData.initialDeposit ?? 0),
                          totalRepayment: String(loanData.totalRepayment ?? 0),
                          totalPaid: String(loanData.totalPaid ?? 0),
                          loanAmount: String(loanData.loanAmount ?? 0),
                          noofInstallments: loanData.noofInstallments ?? 0,
                          paymentFrequency:
                            loanData.paymentFrequency || 'monthly',
                        }}
                        onNext={() => goToStep(getStepIndex('payment-details'))}
                        onCancel={() => goToStep(getStepIndex('declaration'))}
                      />
                    ) : (
                      <div className="py-6 text-center sm:py-8">
                        <p className="text-muted-foreground text-sm sm:text-base">
                          Please complete loan calculation to view repayment
                          schedule
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="py-6 text-center sm:py-8">
                      <p className="text-muted-foreground text-sm sm:text-base">
                        {!isVerificationComplete
                          ? 'Please complete Ghana card verification first'
                          : 'Please complete the previous steps first'}
                      </p>
                    </div>
                  ))}

                {/* Payment Details Step */}
                {currentStep === getStepIndex('payment-details') &&
                  (isVerificationComplete && isDeclarationAccepted ? (
                    <PaymentDetailsStep
                      premiumAmount={premiumAmount}
                      selectedCompanyId={companyId}
                      quoteType={quoteType}
                      type={paymentType}
                      onNext={async () => {
                        // Submit payment using hook
                        const details = await submitPayment()
                        if (details) {
                          setApprovalDetails(details)
                          goToStep(getStepIndex('verify'))
                          // Reset verification state after successful payment completion
                          setDirectVerification(
                            getDefaultPaymentVerificationState('direct'),
                          )
                        }
                      }}
                      onCancel={() => goToStep(currentStep - 1)}
                      isLoading={isPaymentSubmitting}
                    />
                  ) : (
                    <div className="py-6 text-center sm:py-8">
                      <p className="text-muted-foreground text-sm sm:text-base">
                        {!isVerificationComplete
                          ? 'Please complete Ghana card verification first'
                          : 'Please complete the previous steps first'}
                      </p>
                    </div>
                  ))}

                {/* Verify Payment Step */}
                {currentStep === getStepIndex('verify') && approvalDetails && (
                  <ApprovalScreen
                    type={paymentType}
                    paymentId={approvalDetails.paymentId}
                    network={approvalDetails.network}
                    refId={approvalDetails.refId}
                    accountNumber={approvalDetails.accountNumber}
                    pfId={approvalDetails.pfId}
                  />
                )}
              </div>
            </div>
          </WidthConstraint>
        </CardContent>
      </Card>
    </div>
  )
}

export default PaymentDirect
