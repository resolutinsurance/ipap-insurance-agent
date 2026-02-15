'use client'

import { DeclarationForm } from '@/components/dashboard/declaration/declaration-form'
import ApprovalScreen from '@/components/dashboard/payment/approval-screen'
import { GhanaCardVerificationStep } from '@/components/dashboard/payment/ghana-card-verification-step'
import { PaymentDetailsStep } from '@/components/dashboard/payment/payment-details-step'
import { RepaymentSchedulePreviewStep } from '@/components/dashboard/payment/repayment-schedule-preview-step'
import { Card, CardContent } from '@resolutinsurance/ipap-shared/components'
import { Stepper, type Step } from '@resolutinsurance/ipap-shared/components'
import { WidthConstraint } from '@resolutinsurance/ipap-shared/components'
import {
  useDecryptPremiumFinancing,
  usePremiumFinancingById,
} from '@/hooks/use-premium-financing'
import { useSubmitCustomerQuotePayment } from '@/hooks/use-submit-customer-quote-payment'
import {
  CUSTOMER_SELF_VERIFICATION_STEPS,
  MainProductQuoteType,
  UPLOADS_BASE_URL,
} from '@/lib/constants'
import { customerSelfVerificationAtom } from '@/lib/store'
import type { PaymentVerificationState } from '@/lib/store/payment-verification'
import { goToStepInUrl } from '@/lib/utils/step-navigation'
import { useAtom } from 'jotai'
import { Loader2 } from 'lucide-react'
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import React from 'react'

const CustomerPremiumFinancingVerificationPage = () => {
  const params = useParams()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  // Decode the token from URL to handle URL-encoded characters (e.g., %3A -> :)
  const rawToken = params?.id as string
  const token = rawToken ? decodeURIComponent(rawToken) : ''

  const { decryptPremiumFinancing } = useDecryptPremiumFinancing()
  const [customerVerification, setCustomerVerification] = useAtom(
    customerSelfVerificationAtom,
  )

  const currentStep = Number(searchParams.get('step') || '1') || 1
  const [approvalDetails, setApprovalDetails] = React.useState<{
    paymentId: string
    network: string
    refId: string
    accountNumber: string
    pfId?: string
  } | null>(null)
  const hasDecrypted = React.useRef(false)

  React.useEffect(() => {
    // Call decrypt only once on first load when token is available
    if (!token || hasDecrypted.current) return

    hasDecrypted.current = true
    decryptPremiumFinancing.mutateAsync({ token }).catch((error) => {
      console.error('Failed to decrypt premium financing token', error)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const financingId = decryptPremiumFinancing.data?.id

  const entityIdFromQuery = searchParams.get('entityId')
  const entityId = financingId || entityIdFromQuery || ''

  const { getPremiumFinancingById } = usePremiumFinancingById(financingId || '')
  const premiumFinancing = getPremiumFinancingById.data
  // Product type must come from the params on the link – do not default it here
  const productTypeParam =
    premiumFinancing?.quoteType as MainProductQuoteType | null

  // Extract premium amount from financing data
  const premiumAmount = premiumFinancing
    ? parseFloat(premiumFinancing.premiumAmount)
    : 0

  // Get verification state from atom
  const isGhanaVerified = customerVerification.ghanaVerified
  const isDeclarationAccepted = customerVerification.declarationAccepted
  const signatureFilename = customerVerification.signatureFilename
  const declarations = customerVerification.declarations
  const savedGhanaCardNumber = customerVerification.ghanaCardNumber ?? null

  const goToStep = (step: number) => {
    goToStepInUrl({
      router,
      pathname,
      searchParams,
      step,
      maxStep: 6,
    })
  }

  // Ensure sessionStorage state is scoped per financingId so opening a new customer link
  // doesn't reuse stale data from a previous customer verification session.
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    if (!financingId) return
    const contextKey = 'customer-self-verification-context'
    const existing = sessionStorage.getItem(contextKey)
    if (existing && existing !== financingId) {
      // Reset state when switching to a different financing link within the same browser session
      setCustomerVerification({
        ghanaCardResponse: null,
        ghanaVerified: false,
        declarationAccepted: false,
      })
    }
    sessionStorage.setItem(contextKey, financingId)
  }, [financingId, setCustomerVerification])

  // Update verification state helper
  const updateVerificationState = React.useCallback(
    async (updates: Partial<PaymentVerificationState>) => {
      setCustomerVerification((prev) => {
        return {
          ...prev,
          ...updates,
          // Preserve fields that aren't being updated
          ghanaVerified: updates.ghanaVerified ?? prev.ghanaVerified,
          declarationAccepted:
            updates.declarationAccepted ?? prev.declarationAccepted,
          declarations: updates.declarations ?? prev.declarations,
          paymentData: updates.paymentData ?? prev.paymentData,
          signatureFilename:
            updates.signatureFilename ?? prev.signatureFilename,
          ghanaCardId: updates.ghanaCardId ?? prev.ghanaCardId,
          ghanaCardNumber: updates.ghanaCardNumber ?? prev.ghanaCardNumber,
          loanCalculated: updates.loanCalculated ?? prev.loanCalculated,
          loanData: updates.loanData ?? prev.loanData,
          ghanaCardResponse:
            updates.ghanaCardResponse ?? prev.ghanaCardResponse,
        }
      })
    },
    [setCustomerVerification],
  )

  // Payment submission hook
  const { submitPayment, isSubmitting: isPaymentSubmitting } =
    useSubmitCustomerQuotePayment({
      pfId: premiumFinancing?.id || '',
      premiumAmount,
      customerId: premiumFinancing?.userID || '',
      selectedCompanyId: premiumFinancing?.companyID || '',
      selectedQuoteId: premiumFinancing?.entityid || '',
      type: 'premium-financing',
      quoteType: productTypeParam!,
      isInstallment: false,
      verificationType: 'remote-verification',
    })
  if (decryptPremiumFinancing.isPending && !decryptPremiumFinancing.data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <p className="text-muted-foreground text-sm">
          Preparing your verification link...
        </p>
      </div>
    )
  }

  if (!entityId || !financingId) {
    return null
  }

  // Drop the redundant "Preview details" step for customers (repayment step already has the data).
  const steps: Step[] = CUSTOMER_SELF_VERIFICATION_STEPS.slice(1)

  return (
    <section className="flex-col gap-6 py-6">
      <WidthConstraint>
        <Card>
          <CardContent className="flex flex-col gap-6 md:flex-row">
            <div className="flex w-full flex-col gap-6 p-5 md:flex-row">
              <div className="w-full md:w-64 lg:max-h-[500px]">
                <Stepper
                  steps={steps}
                  currentStep={currentStep}
                  className="h-auto"
                />
              </div>

              <div className="mx-auto max-w-2xl flex-1 space-y-4">
                {/* Repayment Schedule Preview Step - Step 1 */}
                {currentStep === 1 &&
                  (financingId ? (
                    <RepaymentSchedulePreviewStep
                      paymentData={{
                        initialDeposit: String(
                          premiumFinancing?.initialDeposit ?? '0',
                        ),
                        totalRepayment: String(
                          premiumFinancing?.totalRepayment ?? '0',
                        ),
                        totalPaid: String(premiumFinancing?.totalPaid ?? '0'),
                        loanAmount: String(premiumFinancing?.loanAmount ?? '0'),
                        noofInstallments: Number(
                          premiumFinancing?.noofInstallments ?? 0,
                        ),
                        paymentFrequency:
                          premiumFinancing?.paymentFrequency || 'monthly',
                        premiumFinancingId: financingId,
                      }}
                      onNext={() => {
                        if (premiumFinancing) {
                          setCustomerVerification((prev) => ({
                            ...prev,
                            loanCalculated: true,
                            loanData: {
                              initialDeposit: Number(
                                premiumFinancing?.initialDeposit ?? '0',
                              ),
                              loanAmount: Number(
                                premiumFinancing?.loanAmount ?? '0',
                              ),
                              totalRepayment: Number(
                                premiumFinancing?.totalRepayment ?? '0',
                              ),
                              totalPaid: Number(
                                premiumFinancing?.totalPaid ?? '0',
                              ),
                              noofInstallments: Number(
                                premiumFinancing?.noofInstallments ?? 0,
                              ),
                              duration: Number(premiumFinancing?.duration ?? 0),
                              paymentFrequency:
                                premiumFinancing?.paymentFrequency || 'monthly',
                            },
                          }))
                        }
                        goToStep(2)
                      }}
                      onCancel={() => goToStep(1)}
                    />
                  ) : (
                    <div className="py-6 text-center sm:py-8">
                      <p className="text-muted-foreground text-sm sm:text-base">
                        Premium finance ID is required to view repayment
                        schedule
                      </p>
                    </div>
                  ))}

                {currentStep === 2 && (
                  <GhanaCardVerificationStep
                    userEmail={premiumFinancing?.user?.email || ''}
                    userPhone={premiumFinancing?.user?.phone || ''}
                    ghanaCardNumber={savedGhanaCardNumber}
                    verificationId={customerVerification.ghanaCardId}
                    ghanaCardResponse={customerVerification.ghanaCardResponse}
                    onSuccess={async (
                      ghanaCardResponse,
                      verificationId,
                      ghanaCardNumber,
                    ) => {
                      await updateVerificationState({
                        ghanaVerified: true,
                        ghanaCardId: verificationId,
                        ghanaCardNumber: ghanaCardNumber,
                        ghanaCardResponse: ghanaCardResponse,
                      })
                      goToStep(3)
                    }}
                    onCancel={() => goToStep(1)}
                  />
                )}

                {currentStep === 3 && (
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
                      goToStep(4)
                    }}
                    onCancel={() => goToStep(2)}
                  />
                )}

                {currentStep === 4 &&
                  (productTypeParam ? (
                    isGhanaVerified && isDeclarationAccepted ? (
                      <PaymentDetailsStep
                        loanCalculationData={{
                          initialDeposit: Number(
                            premiumFinancing?.initialDeposit ?? '0',
                          ),
                          duration: premiumFinancing?.duration ?? 0,
                          paymentFrequency:
                            premiumFinancing?.paymentFrequency ?? 'monthly',
                          loanAmount: Number(
                            premiumFinancing?.loanAmount ?? '0',
                          ),
                          actualProcessingFee: Number(
                            premiumFinancing?.ProcessingFeeValue ?? '0',
                          ),
                        }}
                        premiumAmount={premiumAmount}
                        selectedCompanyId={premiumFinancing?.companyID || ''}
                        quoteType={productTypeParam}
                        type="premium-financing"
                        verificationAtom={customerSelfVerificationAtom}
                        onNext={async () => {
                          // Submit payment using hook (validation happens inside hook)
                          const details = await submitPayment()
                          if (details) {
                            setApprovalDetails(details)
                            goToStep(5)
                          }
                        }}
                        onCancel={() => goToStep(3)}
                        isLoading={isPaymentSubmitting}
                      />
                    ) : (
                      <div className="py-6 text-center sm:py-8">
                        <p className="text-muted-foreground text-sm sm:text-base">
                          {!isGhanaVerified
                            ? 'Please complete Ghana card verification first'
                            : 'Please complete the previous steps first'}
                        </p>
                      </div>
                    )
                  ) : (
                    <p className="text-sm text-red-500">
                      Missing product type for this verification link. Please
                      contact your insurance agent to resend the correct link.
                    </p>
                  ))}

                {/* Verify Payment Step */}
                {currentStep === 5 && approvalDetails && (
                  <ApprovalScreen
                    type="premium-financing"
                    paymentId={approvalDetails.paymentId}
                    network={approvalDetails.network}
                    refId={approvalDetails.refId}
                    accountNumber={approvalDetails.accountNumber}
                    pfId={approvalDetails.pfId}
                    onNext={() => goToStep(6)}
                  />
                )}
                {currentStep === 6 && (
                  <div className="py-6 text-center sm:py-8">
                    <p className="text-muted-foreground text-sm sm:text-base">
                      Payment successful. You can now close this page.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </WidthConstraint>
    </section>
  )
}

export default CustomerPremiumFinancingVerificationPage
