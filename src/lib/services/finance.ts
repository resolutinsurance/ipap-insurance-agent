import api from "../api";
import { DEFAULT_PAGE_SIZE } from "../constants";
import {
  FinancialAccountingEntriesResponse,
  SingleFinancialAccountingEntryResponse,
  SingleTransactionJournalEntryResponse,
  TransactionJournalEntriesResponse,
} from "../interfaces/response";

export const getAllFinancialAccountingEntriesByEntityId = async (
  entityId: string,
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<FinancialAccountingEntriesResponse> => {
  try {
    const response = await api.get(
      `/financial_accounting_entries/?entity_id=${entityId}&page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch financial accounting entries by entity id:", error);
    throw error;
  }
};

export const getAllFinancialAccountingEntriesByTransactionId = async (
  transactionId: string,
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<FinancialAccountingEntriesResponse> => {
  try {
    const response = await api.get(
      `/financial_accounting_entries/?transaction_number=${transactionId}&page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch financial accounting entries by transaction id:",
      error
    );
    throw error;
  }
};

export const getSingleFinancialAccountingEntry = async (
  id: string
): Promise<SingleFinancialAccountingEntryResponse> => {
  try {
    const response = await api.get(`/financial_accounting_entries/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch single financial accounting entry:", error);
    throw error;
  }
};

export const getAllTransactionJournalEntriesByEntityId = async (
  entityId: string,
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<TransactionJournalEntriesResponse> => {
  try {
    const response = await api.get(
      `/transaction_journal/?entity_id=${entityId}&page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch transaction journal entries by entity id:", error);
    throw error;
  }
};

export const getSingleTransactionJournalEntry = async (
  id: string
): Promise<SingleTransactionJournalEntryResponse> => {
  try {
    const response = await api.get(`/transaction_journal/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch single transaction journal entry:", error);
    throw error;
  }
};

export const getAllTransactionJournalEntriesByTransactionId = async (
  transactionId: string,
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<TransactionJournalEntriesResponse> => {
  try {
    const response = await api.get(
      `/transaction_journal/?transaction_number=${transactionId}&page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch transaction journal entries by transaction id:",
      error
    );
    throw error;
  }
};
