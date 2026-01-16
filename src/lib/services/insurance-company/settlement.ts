import {
  SettlementAccountResponse,
  SingleSettlementAccountResponse,
} from "@/lib/interfaces/response";
import api from "../../api";

export const getAllSettlementAccounts = async (
  companyID: string
): Promise<SettlementAccountResponse> => {
  try {
    const response = await api.get(`/SettlementAccount?key=companyID&data=${companyID}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch settlement accounts:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};

export const getSettlementAccountById = async (
  id: string
): Promise<SingleSettlementAccountResponse> => {
  try {
    const response = await api.get(`/SettlementAccount/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch settlement account by ID:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};
