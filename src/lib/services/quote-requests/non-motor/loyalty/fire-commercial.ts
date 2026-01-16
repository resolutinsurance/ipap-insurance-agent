import {
  BuyFireCommercialResponse,
  SingleBuyFireCommercialResponse,
} from "@/lib/interfaces/response";
import api from "../../../../api";
import { DEFAULT_PAGE_SIZE } from "../../../../constants";

export const getAllBuyFireCommercial = async (
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<BuyFireCommercialResponse> => {
  try {
    const response = await api.get(
      `/BuyFireCommercial?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch fire commercial:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};

export const getBuyFireCommercialById = async (
  id: string
): Promise<SingleBuyFireCommercialResponse> => {
  try {
    const response = await api.get(`/BuyFireCommercial/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch fire commercial by ID:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};
