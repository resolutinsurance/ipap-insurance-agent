import {
  ApiError,
  BundlePaymentRequestWithPremiumFinancing,
  ConfirmAutoDebitOTPRequest,
  DecryptPremiumFinancingRequest,
  DecryptPremiumFinancingResponse,
  PaymentSchedule,
  PremiumFinancingCalculateDataRequest,
  PremiumFinancingCalculateDataResponse,
  QuotePaymentRequestWithPremiumFinancing,
  ResendOTPRequest,
  SetupPremiumFinancingRequest,
} from "@/lib/interfaces";
import api from "../api";
import { DEFAULT_PAGE_SIZE } from "../constants";
import { APIResponse, BundleResponse } from "../interfaces/response";

export const getAllPremiumFinancing = async (
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<BundleResponse> => {
  try {
    const response = await api.get(`/PremiumFinancing?page=${page}&pageSize=${pageSize}`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};

export const getPremiumFinancingById = async (id: string): Promise<PaymentSchedule> => {
  try {
    const response = await api.get(`/PremiumFinancing/${id}`);
    return response.data.message;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};

export const getPremiumFinancingByEntityId = async (
  entityId: string
): Promise<PaymentSchedule> => {
  try {
    const response = await api.get(`/PremiumFinancing/entity/${entityId}`);
    return response.data.message;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};

export const getPremiumFinancingByBundleId = async (
  bundleId: string,
  userID: string
): Promise<PaymentSchedule> => {
  try {
    const response = await api.get(
      `/PremiumFinancing/bundleId/${bundleId}?userID=${userID}`
    );
    return response.data.message;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};

export const purchaseWithPremiumFinancing = async (
  data: QuotePaymentRequestWithPremiumFinancing
) => {
  try {
    // Send as JSON (signature is now a filename string, not a File)
    const response = await api.post("/PremiumFinancing", data);
    return response.data.message;
  } catch (error) {
    console.error("MAKE PAYMENT ERROR:", error);
    throw new Error(`Failed to make payment: ${error}`);
  }
};

export const purchaseBundleWithPremiumFinancing = async (
  data: BundlePaymentRequestWithPremiumFinancing
) => {
  try {
    // Send as JSON (signature is now a filename string, not a File)
    // Note: If this endpoint requires FormData for arrays, we may need to adjust
    const response = await api.post("/PremiumFinancing/Bundle", data);
    return response.data.message;
  } catch (error) {
    console.error("PURCHASE BUNDLE WITH PREMIUM FINANCING ERROR:", error);
    if (error instanceof Error) {
      throw new Error(
        (error as ApiError).response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  }
};

export const calculatePremiumFinancingData = async (
  data: PremiumFinancingCalculateDataRequest
): Promise<PremiumFinancingCalculateDataResponse> => {
  try {
    const response = await api.post<APIResponse<PremiumFinancingCalculateDataResponse>>(
      "/PremiumFinancing/CalculateData",
      data
    );
    return response.data.message;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        (error as ApiError).response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};

export type PolicyDetailsResponse = APIResponse<Record<string, unknown>>;

export const getPolicyDetails = async (
  idOrBundleName: string,
  quoteType: string
): Promise<PolicyDetailsResponse> => {
  try {
    const response = await api.get(
      `/PremiumFinancing/policy/${idOrBundleName}?quoteType=${encodeURIComponent(
        quoteType
      )}`
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};

export const updatePremiumFinancing = async (
  id: string,
  data: FormData
): Promise<PaymentSchedule> => {
  try {
    const response = await api.put(`/PremiumFinancing/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.message;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};

/**
 * Confirm OTP for Premium Financing Auto Debit
 */
export const confirmAutoDebitOTP = async (
  data: ConfirmAutoDebitOTPRequest
): Promise<APIResponse<unknown>> => {
  try {
    const response = await api.post<APIResponse<unknown>>(
      "/PremiumFinancing/fetchOTPFinancing",
      data
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        (error as ApiError).response?.data?.message ||
          "Failed to confirm OTP. Please try again."
      );
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};

/**
 * Resend OTP for Premium Financing Auto Debit
 */
export const resendAutoDebitOTP = async (
  data: ResendOTPRequest
): Promise<APIResponse<unknown>> => {
  try {
    const response = await api.post<APIResponse<unknown>>(
      "/PremiumFinancing/resendOTP",
      data
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        (error as ApiError).response?.data?.message ||
          "Failed to resend OTP. Please try again."
      );
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};

/**
 * Decrypt Premium Financing ID from token
 */
export const decryptPremiumFinancingId = async (
  data: DecryptPremiumFinancingRequest
): Promise<DecryptPremiumFinancingResponse> => {
  try {
    const response = await api.post<APIResponse<DecryptPremiumFinancingResponse>>(
      "/PremiumFinancing/decrypt",
      data
    );
    return response.data.message;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        (error as ApiError).response?.data?.message ||
          "Failed to decrypt premium financing ID. Please try again."
      );
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};

/**
 * Setup Premium Financing by agent
 */
export const setupPremiumFinancing = async (
  data: SetupPremiumFinancingRequest
): Promise<PaymentSchedule> => {
  try {
    const response = await api.post<APIResponse<PaymentSchedule>>(
      "/PremiumFinancing/setup",
      data
    );
    return response.data.message;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        (error as ApiError).response?.data?.message ||
          "Failed to setup premium financing. Please try again."
      );
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};
