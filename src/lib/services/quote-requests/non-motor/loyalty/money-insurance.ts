import {
  BuyMoneyInsuranceResponse,
  SingleBuyMoneyInsuranceResponse,
} from "@/lib/interfaces/response";
import api from "../../../../api";
import { DEFAULT_PAGE_SIZE } from "../../../../constants";

export const getAllBuyMoneyInsurance = async (
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<BuyMoneyInsuranceResponse> => {
  try {
    const response = await api.get(
      `/BuyMoneyInsurance?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch money insurance:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};

export const getBuyMoneyInsuranceById = async (
  id: string
): Promise<SingleBuyMoneyInsuranceResponse> => {
  try {
    const response = await api.get(`/BuyMoneyInsurance/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch money insurance by ID:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};
