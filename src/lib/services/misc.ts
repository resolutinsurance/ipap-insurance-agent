import api from "../api";

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

export interface FileUploadResponse {
  message: UploadedFile[];
}

export interface ValidateAccountRequest {
  customerNumber: string;
  bankCode: string;
}

export interface ValidateAccountResponse {
  resp_desc: string;
  resp_code: string;
  name: string;
}

/**
 * Upload a single file
 * @param file - The file to upload
 * @returns Promise with uploaded file information
 */
export const uploadSingleFile = async (file: File): Promise<FileUploadResponse> => {
  if (!file) {
    throw new Error("File is required");
  }

  const formData = new FormData();
  formData.append("uploadFile", file);

  const response = await api.post<FileUploadResponse>("/Files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/**
 * Upload multiple files (max 6 files)
 * @param files - Array of files to upload (max 6)
 * @returns Promise with uploaded files information
 */
export const uploadMultipleFiles = async (files: File[]): Promise<FileUploadResponse> => {
  if (!files || files.length === 0) {
    throw new Error("At least one file is required");
  }

  if (files.length > 6) {
    throw new Error("Maximum 6 files allowed");
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append("uploadFile", file);
  });

  const response = await api.post<FileUploadResponse>("/Files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/**
 * Validate account/mobile number and perform name lookup
 * @param data - The validation request containing customerNumber and bankCode
 * @returns Promise with account validation response including account name
 */
export const validateAccount = async (
  data: ValidateAccountRequest
): Promise<ValidateAccountResponse> => {
  if (!data.customerNumber) {
    throw new Error("Customer number is required");
  }

  if (!data.bankCode) {
    throw new Error("Bank code is required");
  }

  try {
    const response = await api.post<ValidateAccountResponse>(
      "/PremiumFinancing/validateAccount",
      data
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};
