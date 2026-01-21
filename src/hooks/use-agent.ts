import { COOKIE_KEYS, COOKIE_OPTIONS, USER_TYPES } from "@/lib/constants";
import { AgentFormValues } from "@/lib/schemas";
import {
  createCustomer,
  deleteAgent,
  deleteCustomer,
  getAgentCustomers,
  getCurrentAgent,
  getSingleAgent,
  updateAgent,
  updateAgentCustomer,
} from "@/lib/services/agent";
import {
  getClaimsByCustomerId,
  getQuotePaymentsByCustomerId,
  getSingleCustomer,
} from "@/lib/services/customers";
import { fetchPolicyInfoService } from "@/lib/services/policy-info";
import { getFromCookies } from "@/lib/storage";
import { useMutation, useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { Agent, User } from "../lib/interfaces";
import { useAuth } from "./use-auth";

export const useAgentOperations = () => {
  const isFileLike = (value: unknown): value is File | Blob => {
    if (typeof File !== "undefined" && value instanceof File) return true;
    if (value instanceof Blob) return true;
    return false;
  };

  const sanitizeUpdateData = (
    data: Partial<AgentFormValues>
  ): Partial<AgentFormValues> => {
    const fileKeys: (keyof AgentFormValues)[] = [
      "pasportpicGuarantor",
      "passportpicAgent",
      "guarantoridCard",
      "agentidCard",
      "educationQualification",
    ];
    const cleaned: Partial<AgentFormValues> = { ...data };
    fileKeys.forEach((key) => {
      const value = cleaned[key];
      if (value && !isFileLike(value)) {
        delete cleaned[key];
      }
    });
    return cleaned;
  };

  const updateAgentMutation = useMutation({
    mutationFn: ({
      agentId,
      userID,
      data,
    }: {
      agentId: string;
      userID: string;
      data: Partial<AgentFormValues>;
    }) => updateAgent(agentId, userID, sanitizeUpdateData(data)),
    onSuccess: () => {
      console.log("Agent updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update agent", error);
    },
  });

  const deleteAgentMutation = useMutation({
    mutationFn: deleteAgent,
    onSuccess: () => {
      console.log("Agent deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete agent", error);
    },
  });

  return {
    updateAgent: updateAgentMutation,
    deleteAgent: deleteAgentMutation,
    isUpdating: updateAgentMutation.isPending,
    isDeleting: deleteAgentMutation.isPending,
    error: updateAgentMutation.error || deleteAgentMutation.error,
  };
};

export const useSingleAgent = (agentId: string) => {
  const [page, setPage] = useState(1);
  const [name, setName] = useState<string>("");
  const singleAgentQuery = useQuery({
    queryKey: ["agent", agentId],
    queryFn: () => getSingleAgent(agentId),
    enabled: !!agentId,
  });

  const agentCustomersQuery = useQuery({
    queryKey: ["agentCustomers", agentId],
    queryFn: () => getAgentCustomers(agentId as string),
    enabled: !!agentId,
  });

  return {
    getSingleAgent: singleAgentQuery,
    getAgentCustomers: agentCustomersQuery,
    pagination: {
      page,
      setPage,
      name,
      setName,
      totalPages: agentCustomersQuery.data?.metadata?.totalPages || 0,
      totalItems: agentCustomersQuery.data?.metadata?.totalItems || 0,
    },
  };
};

export const useAgentCustomers = (agentId: string | null) => {
  const [page, setPage] = useState(1);
  const [name, setName] = useState<string>("");
  const agentCustomersQuery = useQuery({
    queryKey: ["agentCustomers", agentId],
    queryFn: () => getAgentCustomers(agentId as string),
    enabled: !!agentId,
  });

  return {
    agentCustomersQuery,
    pagination: {
      page,
      setPage,
      name,
      setName,
      totalPages: agentCustomersQuery.data?.metadata?.totalPages || 0,
      totalItems: agentCustomersQuery.data?.metadata?.totalItems || 0,
    },
  };
};

export const useCurrentAgent = (userType: string, agentId: string | null) => {
  return useQuery({
    queryKey: ["agent", agentId],
    queryFn: () => getCurrentAgent(agentId as string),
    enabled: !!agentId && userType === USER_TYPES.AGENT,
  });
};

export const useCreateCustomer = () => {
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      console.log("Customer created successfully");
    },
    onError: (error) => {
      console.error("Failed to create customer", error);
    },
  });
};

export const useDeleteCustomer = () => {
  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      console.log("Customer deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete customer", error);
    },
  });
};

export const useUpdateAgentCustomer = () => {
  return useMutation({
    mutationFn: ({ userId, userData }: { userId: string; userData: Partial<User> }) =>
      updateAgentCustomer(userId, userData),
    onSuccess: () => {
      console.log("Customer updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update customer", error);
    },
  });
};

export const useAgent = () => {
  const { userType } = useAuth();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [agentId, setAgentId] = useState<string | null>(null);
  const deleteCustomer = useDeleteCustomer();
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateAgentCustomer();

  // Get the agent ID from the user if available
  // Since the User interface doesn't have an agent_id property,
  // we'll need to get the agent ID from the agent object itself
  // This will be populated when we fetch the agent data
  // Use the new useCurrentAgent hook to fetch the current agent
  const { data: currentAgent, isLoading: isLoadingCurrentAgent } = useCurrentAgent(
    userType as string,
    agentId
  );
  useEffect(() => {
    const storedAgent = getFromCookies(COOKIE_KEYS.agent);
    setAgentId(storedAgent ? storedAgent.id : null);
    if (storedAgent) {
      setAgent(storedAgent);
    }
  }, []);

  useEffect(() => {
    if (currentAgent) {
      setAgent(currentAgent);
      Cookies.set(COOKIE_KEYS.agent, JSON.stringify(currentAgent), COOKIE_OPTIONS);
    }
  }, [currentAgent]);

  const clearAgent = useCallback(() => {
    setAgent(null);
    Cookies.remove(COOKIE_KEYS.agent);
  }, []);

  return {
    agent,
    isLoading: isLoadingCurrentAgent,
    isCompanyCreatedAgent: currentAgent?.companyID !== null,
    clearAgent,
    deleteCustomer,
    createCustomer,
    updateCustomer,
  };
};

export const useSingleCustomer = (customerId: string) => {
  const [page, setPage] = useState(1);
  const [quotePage, setQuotePage] = useState(1);
  const [claimPage, setClaimPage] = useState(1);
  const [name, setName] = useState<string>("");

  const singleCustomerQuery = useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => getSingleCustomer(customerId as string),
    enabled: !!customerId,
  });

  const customerQuotePaymentsQuery = useQuery({
    queryKey: ["customerQuotePayments", customerId, quotePage],
    queryFn: () => getQuotePaymentsByCustomerId(customerId as string, quotePage),
    enabled: !!customerId,
  });

  const customerClaimsQuery = useQuery({
    queryKey: ["customerClaims", customerId, claimPage],
    queryFn: () => getClaimsByCustomerId(customerId as string, claimPage),
    enabled: !!customerId,
  });

  // const customerQuotePaymentsQuery = useQuery({
  //   queryKey: ["agentCustomers", agentId],
  //   queryFn: () => getAgentCustomers(agentId as string),
  //   enabled: !!agentId,
  // });

  // const customerThirdPartyQuoteRequestsQuery = useQuery({
  //   queryKey: ["agentCustomers", agentId],
  //   queryFn: () => getAgentCustomers(agentId as string),
  //   enabled: !!agentId,
  // });

  // const customerComprehensiveQuoteRequestsQuery = useQuery({
  //   queryKey: ["agentCustomers", agentId],
  //   queryFn: () => getAgentCustomers(agentId as string),
  //   enabled: !!agentId,
  // });

  return {
    getSingleCustomer: singleCustomerQuery,
    getCustomerQuotePayments: customerQuotePaymentsQuery,
    getCustomerClaims: customerClaimsQuery,
    pagination: {
      page,
      setPage,
      name,
      setName,
      // totalPages: singleCustomerQuery.data?.metadata?.totalPages || 0,
      // totalItems: singleCustomerQuery.data?.metadata?.totalItems || 0,
    },
    quotePaymentsPagination: {
      page: quotePage,
      setPage: setQuotePage,
      totalPages: customerQuotePaymentsQuery.data?.metadata?.totalPages || 0,
      totalItems: customerQuotePaymentsQuery.data?.metadata?.totalItems || 0,
    },
    customerClaimsPagination: {
      page: claimPage,
      setPage: setClaimPage,
      totalPages: customerClaimsQuery.data?.metadata?.totalPages || 0,
      totalItems: customerClaimsQuery.data?.metadata?.totalItems || 0,
    },
  };
};

export const usePolicyInfo = (policyId: number | string, enabled: boolean = true) => {
  const { agent } = useAgent();

  // Detect if it's a debit note or policy ID
  const value = String(policyId).trim();
  const isDebitNote = /^DN-[A-Z0-9-]+$/i.test(value);
  const isNumericPolicyId = /^\d+$/.test(value);

  const fetchPolicyInfoQuery = useQuery({
    queryKey: ["fetch-policy-info", policyId, agent?.id],
    queryFn: () => {
      const payload: {
        policy_id?: number;
        debit_note_no?: string;
        userAgentID: string;
      } = {
        userAgentID: agent?.id ?? "",
      };

      if (isDebitNote) {
        payload.debit_note_no = value;
      } else if (isNumericPolicyId) {
        payload.policy_id = Number(value);
      }

      return fetchPolicyInfoService(payload);
    },
    enabled: enabled && !!policyId && !!agent?.id && (isDebitNote || isNumericPolicyId),
  });

  return {
    fetchPolicyInfoQuery,
  };
};

export const usePolicyInfoMutation = () => {
  const { agent } = useAgent();
  const fetchPolicyInfoMutation = useMutation({
    mutationFn: (payload: {
      policy_id?: number;
      debit_note_no?: string;
      userAgentID: string;
    }) => fetchPolicyInfoService(payload),
  });

  return {
    fetchPolicyInfoMutation,
    data: fetchPolicyInfoMutation.data,
    error: fetchPolicyInfoMutation.error,
    isPending: fetchPolicyInfoMutation.isPending,
    isLoading: fetchPolicyInfoMutation.isPending,
    mutate: (payload: { policy_id?: number; debit_note_no?: string }) => {
      if (!agent?.id) {
        return;
      }
      return fetchPolicyInfoMutation.mutate({
        ...payload,
        userAgentID: agent.id,
      });
    },
    mutateAsync: async (payload: { policy_id?: number; debit_note_no?: string }) => {
      if (!agent?.id) {
        throw new Error("Agent ID is required");
      }
      return fetchPolicyInfoMutation.mutateAsync({
        ...payload,
        userAgentID: agent.id,
      });
    },
  };
};
