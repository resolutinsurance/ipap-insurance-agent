import { USER_TYPES } from "@/lib/constants";
import {
  getAllFinancialAccountingEntriesByEntityId,
  getAllFinancialAccountingEntriesByTransactionId,
  getAllTransactionJournalEntriesByEntityId,
  getAllTransactionJournalEntriesByTransactionId,
  getSingleFinancialAccountingEntry,
  getSingleTransactionJournalEntry,
} from "@/lib/services/finance";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAgent } from "./use-agent";
import { useAuth } from "./use-auth";

export const useFinancialAccountingEntriesByEntityId = () => {
  const [page, setPage] = useState(1);

  const { user, userType } = useAuth();
  const { agent } = useAgent();

  const idToUse = userType === USER_TYPES.AGENT ? agent?.id : user?.id;

  const financialAccountingEntriesByEntityQuery = useQuery({
    queryKey: ["get-financial-accounting-entries-by-entity", idToUse, page],
    queryFn: async () => {
      const response = await getAllFinancialAccountingEntriesByEntityId(idToUse!, page);
      if (!response) {
        throw new Error(
          "No data received from getAllFinancialAccountingEntriesByEntityId"
        );
      }
      return response;
    },
    enabled: !!idToUse,
  });

  return {
    getAllFinancialAccountingEntriesByEntityId: financialAccountingEntriesByEntityQuery,
    pagination: {
      page,
      setPage,
      totalPages: financialAccountingEntriesByEntityQuery.data?.metadata?.totalPages || 0,
      totalItems: financialAccountingEntriesByEntityQuery.data?.metadata?.totalItems || 0,
    },
  };
};

export const useFinancialAccountingEntriesByTransactionId = (transactionId: string) => {
  const [page, setPage] = useState(1);

  const financialAccountingEntriesByTransactionQuery = useQuery({
    queryKey: ["get-financial-accounting-entries-by-transaction", transactionId, page],
    queryFn: async () => {
      const response = await getAllFinancialAccountingEntriesByTransactionId(
        transactionId,
        page
      );
      if (!response) {
        throw new Error(
          "No data received from getAllFinancialAccountingEntriesByTransactionId"
        );
      }
      return response;
    },
    enabled: !!transactionId,
  });

  return {
    getAllFinancialAccountingEntriesByTransactionId:
      financialAccountingEntriesByTransactionQuery,
    pagination: {
      page,
      setPage,
      totalPages:
        financialAccountingEntriesByTransactionQuery.data?.metadata?.totalPages || 0,
      totalItems:
        financialAccountingEntriesByTransactionQuery.data?.metadata?.totalItems || 0,
    },
  };
};

export const useSingleFinancialAccountingEntry = (entryId: string) => {
  const singleFinancialAccountingEntryQuery = useQuery({
    queryKey: ["financial-accounting-entry", entryId],
    queryFn: () => getSingleFinancialAccountingEntry(entryId),
    enabled: !!entryId,
  });

  return {
    getSingleFinancialAccountingEntry: singleFinancialAccountingEntryQuery,
  };
};

export const useTransactionJournalEntriesByEntityId = () => {
  const [page, setPage] = useState(1);

  const { user, userType } = useAuth();
  const { agent } = useAgent();

  const idToUse = userType === USER_TYPES.AGENT ? agent?.id : user?.id;

  const transactionJournalEntriesByEntityQuery = useQuery({
    queryKey: ["get-transaction-journal-entries-by-entity", idToUse, page],
    queryFn: async () => {
      const response = await getAllTransactionJournalEntriesByEntityId(idToUse!, page);
      if (!response) {
        throw new Error(
          "No data received from getAllTransactionJournalEntriesByEntityId"
        );
      }
      return response;
    },
    enabled: !!idToUse,
  });

  return {
    getAllTransactionJournalEntriesByEntityId: transactionJournalEntriesByEntityQuery,
    pagination: {
      page,
      setPage,
      totalPages: transactionJournalEntriesByEntityQuery.data?.metadata?.totalPages || 0,
      totalItems: transactionJournalEntriesByEntityQuery.data?.metadata?.totalItems || 0,
    },
  };
};

export const useTransactionJournalEntriesByTransactionId = (transactionId: string) => {
  const [page, setPage] = useState(1);

  const transactionJournalEntriesByTransactionQuery = useQuery({
    queryKey: ["get-transaction-journal-entries-by-transaction", transactionId, page],
    queryFn: async () => {
      const response = await getAllTransactionJournalEntriesByTransactionId(
        transactionId,
        page
      );
      if (!response) {
        throw new Error(
          "No data received from getAllTransactionJournalEntriesByTransactionId"
        );
      }
      return response;
    },
    enabled: !!transactionId,
  });

  return {
    getAllTransactionJournalEntriesByTransactionId:
      transactionJournalEntriesByTransactionQuery,
    pagination: {
      page,
      setPage,
      totalPages:
        transactionJournalEntriesByTransactionQuery.data?.metadata?.totalPages || 0,
      totalItems:
        transactionJournalEntriesByTransactionQuery.data?.metadata?.totalItems || 0,
    },
  };
};

export const useSingleTransactionJournalEntry = (entryId: string) => {
  const singleTransactionJournalEntryQuery = useQuery({
    queryKey: ["transaction-journal-entry", entryId],
    queryFn: () => getSingleTransactionJournalEntry(entryId),
    enabled: !!entryId,
  });

  return {
    getSingleTransactionJournalEntry: singleTransactionJournalEntryQuery,
  };
};
