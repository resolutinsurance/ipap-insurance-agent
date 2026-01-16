"use client";

import { parsePremiumAmount } from "@/lib/utils/payments";
import React from "react";
import { usePolicyInfo } from "./use-agent";

export type ProductTypeForPremium =
  | "comprehensive"
  | "thirdparty"
  | "fire"
  | "buy-money-insurance"
  | "fire-insurance"
  | "asset-all-risk"
  | "goods-in-transit";

interface UseQuotePremiumAmountParams {
  productType: ProductTypeForPremium;
  quoteId: string;
  policyId: number | string;
}

export const useQuotePremiumAmount = ({
  productType,
  quoteId,
  policyId,
}: UseQuotePremiumAmountParams) => {
  // Check if it's a non-motor loyalty quote type
  const isNonMotorLoyalty = React.useMemo(
    () =>
      [
        "buy-money-insurance",
        "fire-insurance",
        "asset-all-risk",
        "goods-in-transit",
      ].includes(productType),
    [productType]
  );

  const { fetchPolicyInfoQuery } = usePolicyInfo(policyId);

  const policyDetails = fetchPolicyInfoQuery.data?.message;

  // Calculate premium amount (same logic used in pay-direct and remote agent flows)
  const premiumAmount = React.useMemo(() => {
    if (!quoteId) return 0;

    return parsePremiumAmount((policyDetails?.model?.net_premium as number) ?? 0);
  }, [quoteId, policyDetails?.model?.net_premium]);

  const isLoading = fetchPolicyInfoQuery.isLoading;

  return {
    premiumAmount,
    isLoading,
    // Return the raw quote data for pages that need it
    isNonMotorLoyalty,
    policyDetails,
  };
};
