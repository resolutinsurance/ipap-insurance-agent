"use client";

import AgentPaymentFlowDecider from "@/components/dashboard/agent/payment-flow-decider";
import InfoRow from "@/components/dashboard/payment/details/info-row";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAgent, usePolicyInfoMutation } from "@/hooks/use-agent";
import { useAuth } from "@/hooks/use-auth";
import { prepareObjectFields } from "@/lib/data-renderer";
import {
  transformPolicyTypeToQuoteType,
  transformQuoteTypeToProductType,
} from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const LoyaltyFetchPolicyDetails = () => {
  const router = useRouter();
  const [policyId, setPolicyId] = useState("");
  const [showFlowDecider, setShowFlowDecider] = useState(false);
  const [standardFlowUrl, setStandardFlowUrl] = useState<string | null>(null);
  const { user } = useAuth();
  const { agent } = useAgent();

  const {
    data: policyInfoData,
    error: policyInfoError,
    isPending: isLoadingPolicyInfo,
    mutateAsync: fetchPolicyInfo,
  } = usePolicyInfoMutation();

  const policyData = policyInfoData?.message?.model || {};
  const loyaltyPolicyData = policyInfoData?.message?.loyaltyPolicy;

  const handleFetchPolicy = async () => {
    if (!policyId || !agent?.id || policyId?.length < 5) {
      return;
    }

    await fetchPolicyInfo(policyId);
  };

  const renderPaymentActions = () => {
    if (!policyInfoData) return null;

    const record = policyData;

    const userIdForPayment = policyData.userID ?? (user?.id || null);

    if (!userIdForPayment) {
      return null;
    }

    // Bundle payments: route to bundle payment flow

    // Non-bundle payments: general pay-direct flow
    const policyType = loyaltyPolicyData?.policyType;
    const quoteType =
      loyaltyPolicyData?.quoteType || transformPolicyTypeToQuoteType(policyType);
    const companyId =
      (record.companyID as string | undefined) ||
      (record.companyId as string | undefined) ||
      "";
    const requestId =
      (record.entityid as string | undefined) ||
      (record.entityId as string | undefined) ||
      (record.id as string | undefined) ||
      "";

    // Try to show payment actions even if some fields are missing - use policyId as fallback
    const finalRequestId = requestId || policyId;
    const finalCompanyId = companyId || "";

    if (!quoteType && !finalRequestId) {
      return null;
    }

    // If we have at least requestId, try to proceed
    if (finalRequestId && policyId) {
      const productType = transformQuoteTypeToProductType(quoteType);

      const baseUrl = `/dashboard/policies/purchases/pay-direct?productType=${productType}&companyId=${finalCompanyId}&requestId=${finalRequestId}&cId=${userIdForPayment}&policyId=${policyId}`;

      return (
        <>
          <div className="flex gap-2 border-y items-center py-4 justify-between">
            <p className="font-medium"> Policy Details: </p>
            <Button
              onClick={() => {
                setStandardFlowUrl(baseUrl);
                setShowFlowDecider(true);
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
                const url = `${standardFlowUrl}&type=premium-financing`;
                router.push(url);
              }
              setShowFlowDecider(false);
            }}
            onSelectRemote={() => {
              if (standardFlowUrl) {
                // Remote flow goes to the agent remote premium financing route
                router.push(
                  standardFlowUrl.replace(
                    "/dashboard/policies/purchases/pay-direct",
                    "/dashboard/remote-premium-financing"
                  )
                );
              }
              setShowFlowDecider(false);
            }}
          />
        </>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">Enter Policy ID</p>
          <Input
            type="number"
            value={policyId}
            onChange={(e) => setPolicyId(e.target.value)}
            placeholder="e.g. 163633"
          />
        </div>
        <Button onClick={handleFetchPolicy} disabled={isLoadingPolicyInfo}>
          {isLoadingPolicyInfo ? "Fetching..." : "Fetch Policy"}
        </Button>
      </div>

      {policyInfoError && (
        <p className="text-sm text-red-500">
          {(policyInfoError as Error)?.message || "Failed to fetch policy information"}
        </p>
      )}

      {policyInfoData && (
        <>
          {renderPaymentActions()}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {prepareObjectFields(policyData).map(({ key, value }) => (
              <InfoRow key={key} label={key} value={value as unknown} />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {prepareObjectFields(loyaltyPolicyData ?? {}).map(({ key, value }) => (
              <InfoRow key={key} label={key} value={value as unknown} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
