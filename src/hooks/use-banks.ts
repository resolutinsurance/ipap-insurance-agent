import { getBankCodes } from "@/lib/services/misc";
import { useQuery } from "@tanstack/react-query";

export type BankCodeType = "ANM" | "PayStack";

/**
 * Hook for fetching bank codes (e.g. for bank transfer dropdown).
 * @param type - API type: "ANM" | "PayStack"
 * @returns Query with banks list, isLoading, error
 */
export function useBanks(type: BankCodeType = "PayStack") {
  const query = useQuery({
    queryKey: ["bank-codes", type],
    queryFn: () => getBankCodes(type),
  });

  return {
    banks: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
