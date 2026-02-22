import { PROVIDER_TYPE, ProviderType } from '@/lib/interfaces'
import { getBankCodes } from '@/lib/services/misc'
import { useQuery } from '@tanstack/react-query'

/**
 * Hook for fetching bank codes (e.g. for bank transfer dropdown).
 * @param type - API type: "ANM" | "PayStack"
 * @returns Query with banks list, isLoading, error
 */
export function useBanks(type: ProviderType = PROVIDER_TYPE.PAYSTACK) {
  const query = useQuery({
    queryKey: ['bank-codes', type],
    queryFn: () => getBankCodes(type),
    enabled: !!type,
  })

  return {
    banks: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
