'use client'

import AgentPaymentFlowDecider from '@/components/dashboard/agent/payment-flow-decider'
import InfoRow from '@/components/dashboard/payment/details/info-row'
import { useAgent, usePolicyInfoMutation } from '@/hooks/use-agent'
import { useAuth } from '@/hooks/use-auth'
import { prepareObjectFields } from '@/lib/data-renderer'
import {
  directPaymentVerificationAtom,
  getDefaultPaymentVerificationState,
} from '@/lib/store'
import { clearPaymentSession } from '@/lib/store/payment-storage'
import {
  transformPolicyTypeToQuoteType,
  transformQuoteTypeToProductType,
} from '@/lib/utils'
import { Button, Input } from '@resolutinsurance/ipap-shared/components'
import { useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const LoyaltyFetchPolicyDetails = () => {
  const router = useRouter()
  const [policyId, setPolicyId] = useState('')
  const [inputError, setInputError] = useState<string | null>(null)
  const [showFlowDecider, setShowFlowDecider] = useState(false)
  const [standardFlowUrl, setStandardFlowUrl] = useState<string | null>(null)
  const { user } = useAuth()
  const { agent } = useAgent()
  const setDirectVerification = useSetAtom(directPaymentVerificationAtom)

  const {
    data: policyInfoData,
    error: policyInfoError,
    isPending: isLoadingPolicyInfo,
    mutateAsync: fetchPolicyInfo,
  } = usePolicyInfoMutation()

  const policyData = policyInfoData?.message?.model || {}
  const loyaltyPolicyData = policyInfoData?.message?.loyaltyPolicy

  const handleFetchPolicy = async () => {
    if (!policyId || !agent?.id) {
      return
    }
    const value = policyId.trim()
    setInputError(null)

    // Debit note format: e.g. DN-0HQ-202601006
    const isDebitNote = /^DN-[A-Z0-9-]+$/i.test(value)
    const isNumericPolicyId = /^\d+$/.test(value)

    if (isDebitNote) {
      await fetchPolicyInfo({ debit_note_no: value })
      return
    }

    if (isNumericPolicyId) {
      await fetchPolicyInfo({ policy_id: Number(value) })
      return
    }

    setInputError(
      'Enter a numeric Policy ID (e.g. 163719) or a Debit Note (e.g. DN-0HQ-202601006).',
    )
  }

  const renderPaymentActions = () => {
    if (!policyInfoData) return null

    const record = policyData

    const userIdForPayment = policyData.userID ?? (user?.id || null)

    if (!userIdForPayment) {
      return null
    }

    // Bundle payments: route to bundle payment flow

    // Non-bundle payments: general pay-direct flow
    const policyType = loyaltyPolicyData?.policyType
    const quoteType =
      loyaltyPolicyData?.quoteType || transformPolicyTypeToQuoteType(policyType)
    const companyId =
      (record.companyID as string | undefined) ||
      (record.companyId as string | undefined) ||
      ''
    const requestId =
      (record.entityid as string | undefined) ||
      (record.entityId as string | undefined) ||
      (record.id as string | undefined) ||
      ''

    // Try to show payment actions even if some fields are missing - use policyId as fallback
    const finalRequestId = requestId || policyId
    const finalCompanyId = companyId || ''

    if (!quoteType && !finalRequestId) {
      return null
    }

    // If we have at least requestId, try to proceed
    if (finalRequestId && policyId) {
      const productType = transformQuoteTypeToProductType(quoteType)

      const baseUrl = `/dashboard/policies/purchases/pay-direct?productType=${productType}&companyId=${finalCompanyId}&requestId=${finalRequestId}&cId=${userIdForPayment}&policyId=${policyId}`

      return (
        <>
          <div className="flex items-center justify-between gap-2 border-y py-4">
            <p className="font-medium"> Policy Details: </p>
            <Button
              onClick={() => {
                // Start a fresh payment session whenever user initiates a new Pay Small Small flow
                clearPaymentSession()
                setDirectVerification(
                  getDefaultPaymentVerificationState('direct'),
                )

                setStandardFlowUrl(baseUrl)
                setShowFlowDecider(true)
              }}
            >
              Pay Small Small
            </Button>
          </div>

          <AgentPaymentFlowDecider
            open={showFlowDecider}
            onOpenChange={setShowFlowDecider}
            onSelectStandard={() => {
              if (standardFlowUrl) {
                // Standard flow goes to the existing pay-direct premium financing route
                const url = `${standardFlowUrl}&type=premium-financing`
                router.push(url)
              }
              setShowFlowDecider(false)
            }}
            onSelectRemote={() => {
              if (standardFlowUrl) {
                // Remote flow goes to the agent remote premium financing route
                router.push(
                  standardFlowUrl.replace(
                    '/dashboard/policies/purchases/pay-direct',
                    '/dashboard/remote-premium-financing',
                  ),
                )
              }
              setShowFlowDecider(false)
            }}
          />
        </>
      )
    }

    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <p className="text-muted-foreground mb-1 text-sm">
            Enter Debit Note or Policy ID
          </p>
          <Input
            value={policyId}
            onChange={(e) => setPolicyId(e.target.value)}
            placeholder="e.g. 163633"
          />
        </div>
        <Button onClick={handleFetchPolicy} disabled={isLoadingPolicyInfo}>
          {isLoadingPolicyInfo ? 'Fetching...' : 'Fetch Policy'}
        </Button>
      </div>

      {policyInfoError && (
        <p className="text-sm text-red-500">
          {(policyInfoError as Error)?.message ||
            'Failed to fetch policy information'}
        </p>
      )}

      {inputError && <p className="text-sm text-red-500">{inputError}</p>}

      {policyInfoData && (
        <>
          {renderPaymentActions()}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {prepareObjectFields(policyData).map(({ key, value }) => (
              <InfoRow key={key} label={key} value={value as unknown} />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {prepareObjectFields(loyaltyPolicyData ?? {}).map(
              ({ key, value }) => (
                <InfoRow key={key} label={key} value={value as unknown} />
              ),
            )}
          </div>
        </>
      )}
    </div>
  )
}
