import {
  AssetAllRiskResponse,
  SingleAssetAllRiskResponse,
} from "@/lib/interfaces/response";
import api from "../../../../api";
import { DEFAULT_PAGE_SIZE } from "../../../../constants";

export const getAllAssetAllRisk = async (
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<AssetAllRiskResponse> => {
  try {
    const response = await api.get(`/AssetAllRisks?page=${page}&pageSize=${pageSize}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch asset all risk:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};

export const getAssetAllRiskById = async (
  id: string
): Promise<SingleAssetAllRiskResponse> => {
  try {
    const response = await api.get(`/AssetAllRisks/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch asset all risk by ID:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};
