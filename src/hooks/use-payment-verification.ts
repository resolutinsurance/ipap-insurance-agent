import { useAgent } from "@/hooks/use-agent";
import { useAuth, useUserById } from "@/hooks/use-auth";
import { USER_TYPES } from "@/lib/constants";
import { User } from "@/lib/interfaces";
import { getSingleCustomer } from "@/lib/services/customers";
import { useQuery } from "@tanstack/react-query";

interface UsePaymentVerificationParams {
  customerId?: string | null;
}

interface UsePaymentVerificationReturn {
  user: User | null | undefined;
  isVerified: boolean;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to determine which user to check for Ghana card verification based on user type
 * - Regular users: Check the current authenticated user
 * - Agents: Check the customer specified by customerId
 * - Insurance company agents: Check the agent's user (via agent.userID)
 */
export const usePaymentVerification = ({
  customerId,
}: UsePaymentVerificationParams = {}): UsePaymentVerificationReturn => {
  const { user: currentUser, userType } = useAuth();
  const { agent } = useAgent();

  // Determine which user to check based on user type and context
  const isAgent = userType === USER_TYPES.AGENT;
  const isInsuranceCompanyAgent = isAgent && agent?.companyID;

  // Priority 1: If customerId is provided (agent checking customer), always fetch that customer
  // This takes precedence over checking the agent's own user
  const shouldFetchCustomer = !!customerId;
  const customerQuery = useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => getSingleCustomer(customerId!),
    enabled: shouldFetchCustomer,
  });

  // Priority 2: If no customerId provided AND it's an insurance company agent, check the agent's user
  // Only check agent's user if we're NOT fetching a customer
  const agentUserId = isInsuranceCompanyAgent ? agent?.userID : null;
  const shouldFetchAgentUser =
    isInsuranceCompanyAgent && !!agentUserId && !shouldFetchCustomer;
  const agentUserQuery = useUserById(agentUserId || "");
  const agentUserData = shouldFetchAgentUser ? agentUserQuery.getUserById : null;

  // Determine which user to check
  let user: User | null | undefined;
  let isLoading = false;
  let error: Error | null = null;

  if (shouldFetchCustomer) {
    // If customerId is provided (agent checking customer), use fetched customer
    // This applies to all agents, not just insurance company agents
    user = customerQuery.data;
    isLoading = customerQuery.isLoading;
    error = customerQuery.error as Error | null;
  } else if (shouldFetchAgentUser) {
    // If no customerId and it's an insurance company agent, check agent's user
    user = agentUserData?.data;
    isLoading = agentUserData?.isLoading ?? false;
    error = (agentUserData?.error as Error) || null;
  } else {
    // Regular customer or fallback - use current user
    user = currentUser;
  }

  // Check verification status
  // User is verified if they have verified === true and GhcardNo is not empty
  const isVerified =
    !!user && user.verified === true && !!user.GhcardNo && user.GhcardNo.trim() !== "";

  return {
    user,
    isVerified,
    isLoading,
    error,
  };
};
