import {
  GoodsInTransitResponse,
  SingleGoodsInTransitResponse,
} from "@/lib/interfaces/response";
import api from "../../../../api";
import { DEFAULT_PAGE_SIZE } from "../../../../constants";

export const getAllGoodsInTransit = async (
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<GoodsInTransitResponse> => {
  try {
    const response = await api.get(`/GoodsInTransit?page=${page}&pageSize=${pageSize}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch goods in transit:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};

export const getGoodsInTransitById = async (
  id: string
): Promise<SingleGoodsInTransitResponse> => {
  try {
    const response = await api.get(`/GoodsInTransit/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch goods in transit by ID:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};
