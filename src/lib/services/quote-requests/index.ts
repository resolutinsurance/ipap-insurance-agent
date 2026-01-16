import api from "@/lib/api";
import {
  ComprehensiveQuoteRequestData,
  MotorPolicyQuoteRequests,
  ThirdPartyQuoteRequestData,
} from "@/lib/interfaces";

export const getAllMotorPolicyQuoteRequests =
  async (): Promise<MotorPolicyQuoteRequests> => {
    try {
      const url = "/covertypeData";
      const response = await api.get(url);
      return response.data.message;
    } catch (error) {
      console.error("GET COMPREHENSIVE MOTOR QUOTES ERROR:", error);
      throw new Error(`Failed to get comprehensive motor policy quotes: ${error}`);
    }
  };

export const getSingleMotorPolicyQuoteRequest = async (
  quoteId: string
): Promise<ComprehensiveQuoteRequestData | ThirdPartyQuoteRequestData> => {
  try {
    const url = `/covertypeData/${quoteId}`;
    const response = await api.get(url);
    return response.data.message;
  } catch (error) {
    console.error("GET COMPREHENSIVE MOTOR QUOTES ERROR:", error);
    throw new Error(`Failed to get comprehensive motor policy quotes: ${error}`);
  }
};
