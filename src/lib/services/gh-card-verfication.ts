/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/api";
import {
  APIResponse,
  MainUserGhanaCardVerificationResponse,
  PublicGhanaCardVerificationResponse,
} from "../interfaces/response";
import { getErrorMessage } from "../utils/api-error";

// Ghana Card verification interface
export interface GhanaCardVerificationData {
  userEmail: string;
  phone: string;
  pinNumber: string; // Ghana Card number starting with GHA-007A...
  center: string;
  deviceOs: "WINDOWS" | "ANDROID" | "IOS";
  image: File | null;
}

export const verifyGhanaCard = async (
  data: GhanaCardVerificationData
): Promise<APIResponse<MainUserGhanaCardVerificationResponse>> => {
  const formData = new FormData();

  // Append all required fields
  formData.append("userEmail", data.userEmail);
  formData.append("phone", data.phone);
  formData.append("pinNumber", data.pinNumber);
  formData.append("center", data.center);
  formData.append("deviceOs", data.deviceOs);

  // Append image if provided
  if (data.image) {
    formData.append("image", data.image);
  }

  try {
    const response = await api.post("/GhcardIdentification", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Ghana Card verification error:", error);

    const errorMessage = getErrorMessage(
      error,
      "Ghana Card verification failed. Please try again."
    );

    // Create a new error with the extracted message
    const apiError = new Error(errorMessage);
    // Preserve the original error for debugging
    (apiError as any).originalError = error;
    throw apiError;
  }
};

export const getSingleGhCardDetails = async (
  id: string
): Promise<MainUserGhanaCardVerificationResponse> => {
  try {
    const response = await api.get(`/GhcardIdentification/${id}`);
    return response.data.message;
  } catch (error) {
    console.error("Failed to fetch current agent:", error);
    throw error;
  }
};

export const verifyGhanaCardPublic = async (
  data: GhanaCardVerificationData
): Promise<APIResponse<PublicGhanaCardVerificationResponse>> => {
  const formData = new FormData();

  // Append all required fields
  formData.append("userEmail", data.userEmail);
  formData.append("phone", data.phone);
  formData.append("pinNumber", data.pinNumber);
  formData.append("center", data.center);
  formData.append("deviceOs", data.deviceOs);

  // Append image if provided
  if (data.image) {
    formData.append("image", data.image);
  }

  try {
    const response = await api.post("/VerifyGhanaCard/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Ghana Card verification error:", error);

    const errorMessage = getErrorMessage(
      error,
      "Ghana Card verification failed. Please try again."
    );

    // Create a new error with the extracted message
    const apiError = new Error(errorMessage);
    // Preserve the original error for debugging
    (apiError as any).originalError = error;
    throw apiError;
  }
};
