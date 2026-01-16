import { DEFAULT_PAGE_SIZE, USER_TYPES } from "@/lib/constants";
import { QuotePaymentRequest } from "@/lib/interfaces";
import {
  getAllQuotePaymentsById,
  getProductPaymentsByEntityId,
  getSingleQuotePaymentsById,
  makeQuotePayment,
  verifyAPNMPayment,
  verifyQuotePayment,
} from "@/lib/services/quote-requests/quote-payments";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAgent } from "./use-agent";
import { useAuth } from "./use-auth";

export const useMakeQuotePayment = () => {
  return useMutation({
    mutationFn: (data: QuotePaymentRequest) => makeQuotePayment(data),
    onSuccess: (data) => {
      console.log("Payment made successfully:", data);
    },
    onError: (error) => {
      console.error("Payment error:", error);
    },
  });
};

export const useAllQuotePayments = (
  userId: string,
  page: number,
  name: string,
  pageSize?: number
) => {
  return useQuery({
    queryKey: ["allQuotePayments", userId, page, name, pageSize],
    queryFn: () => getAllQuotePaymentsById(userId, page, name, pageSize),
    enabled: !!userId,
  });
};

export const useProductPaymentsByEntityId = (
  entityid: string,
  page: number,
  name: string,
  pageSize?: number,
  assignedBundleName?: string
) => {
  return useQuery({
    queryKey: [
      "productPaymentsByEntityId",
      entityid,
      page,
      name,
      pageSize,
      assignedBundleName,
    ],
    queryFn: () =>
      getProductPaymentsByEntityId(entityid, page, name, pageSize, assignedBundleName),
    enabled: !!entityid,
  });
};

export const useSingleQuotePayment = (quoteId: string) => {
  return useQuery({
    queryKey: ["singleQuotePayments", quoteId],
    queryFn: () => getSingleQuotePaymentsById(quoteId),
  });
};

export const useQuotePayments = (initialPageSize?: number) => {
  const { userType } = useAuth();
  const [page, setPage] = useState(1);
  const [name, setName] = useState<string>("");
  const [pageSize, setPageSize] = useState(initialPageSize ?? DEFAULT_PAGE_SIZE);

  const makeQuotePaymentMutation = useMakeQuotePayment();

  const verifyQuotePaymentMutation = useMutation({
    mutationFn: (id: string) => verifyQuotePayment(id),
    onSuccess: (data) => {
      console.log("Payment verified successfully:", data);
    },
    onError: (error) => {
      console.error("Payment verification error:", error);
    },
  });

  const verifyAPNMPaymentMutation = useMutation({
    mutationFn: ({ type, id }: { type: "premium-financing" | "one-time"; id: string }) =>
      verifyAPNMPayment(type, id),
    onSuccess: (data) => {
      console.log("Payment verified successfully:", data);
    },
    onError: (error) => {
      console.error("Payment verification error:", error);
    },
  });
  const { agent, isCompanyCreatedAgent } = useAgent();
  const isAgent = userType === USER_TYPES.AGENT;

  const insuranceCompanyId = isAgent && isCompanyCreatedAgent ? agent?.id : null;

  // For insurance companies and company-created agents
  const allQuotePaymentsQuery = useAllQuotePayments(
    insuranceCompanyId || "",
    page,
    name,
    pageSize
  );

  const metadata = allQuotePaymentsQuery.data?.metadata;

  return {
    allQuotePaymentsQuery,
    makeQuotePayment: makeQuotePaymentMutation,
    verifyPayment: verifyQuotePaymentMutation,
    verifyAPNMPayment: verifyAPNMPaymentMutation,
    pagination: {
      page: metadata?.page ?? page,
      totalPages: metadata?.totalPages ?? 0,
      totalItems: metadata?.totalItems ?? 0,
      pageSize: metadata?.pageSize ?? pageSize,
      setPage,
      setName,
      setPageSize,
      name,
    },
  };
};
