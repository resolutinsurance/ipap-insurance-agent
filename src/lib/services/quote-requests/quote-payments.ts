import api from "@/lib/api";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { PaymentRecord, QuotePaymentRequest } from "@/lib/interfaces";
import {
  ActiveBundleProductsResponse,
  ActiveProductsResponse,
  QuotePaymentsResponse,
} from "@/lib/interfaces/response";

export const makeQuotePayment = async (data: QuotePaymentRequest) => {
  try {
    // Send as JSON (signature is now a filename string, not a File)
    const response = await api.post("/QuotePayment", data);
    return response.data.message;
  } catch (error) {
    console.error("MAKE PAYMENT ERROR:", error);
    throw new Error(`Failed to make payment: ${error}`);
  }
};

export const getAllQuotePaymentsById = async (
  id: string,
  page?: number,
  name?: string,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<QuotePaymentsResponse> => {
  try {
    const url =
      "/QuotePayment/" +
      id +
      "?page=" +
      page +
      "&pageSize=" +
      pageSize +
      (name && "&name=" + name);
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("GET MOTOR POLICY PURCHASES ERROR:", error);
    throw new Error(`Failed to get motor policy purchases: ${error}`);
  }
};

export const getSingleQuotePaymentsById = async (id: string): Promise<PaymentRecord> => {
  try {
    const url = "/QuotePayment/singleQuote/" + id;
    const response = await api.get(url);
    return response.data.message;
  } catch (error) {
    console.error("GET MOTOR POLICY PURCHASES ERROR:", error);
    throw new Error(`Failed to get motor policy purchases: ${error}`);
  }
};

export const verifyQuotePayment = async (
  id: string
): Promise<{
  status: boolean;
  message: string;
  payload: {
    success: boolean;
    amount: string;
    status: string;
    transaction_fee: number;
    message: string | null;
    transaction_id: string;
    korba_trans_id: string;
  };
}> => {
  try {
    const url = "/QuotePayment/verifyAllPayments/" + id;
    const response = await api.get(url);
    return response.data.message;
  } catch (error) {
    console.error("VERIFY QUOTE PAYMENT ERROR:", error);
    throw new Error(`Failed to verify quote payment: ${error}`);
  }
};

export const verifyAPNMPayment = async (
  type: "premium-financing" | "one-time",
  id: string
): Promise<{
  success: true;
  data: {
    trans_status: string;
    trans_ref: string;
    trans_id: string;
    nw: string;
    message: string;
    customer_number: string;
  };
}> => {
  const paymentType = type === "premium-financing" ? "PremiumFinancing" : "QuotePayment";
  try {
    const url = "/PremiumFinancing/verifyPaymentTransaction";
    const response = await api.post(url, {
      id,
      type: paymentType,
    });
    return response.data;
  } catch (error) {
    console.error("VERIFY APNM PAYMENT ERROR:", error);
    throw new Error(`Failed to verify apnm payment: ${error}`);
  }
};

export const getUserProducts = async (
  userId: string,
  page?: number,
  name?: string,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<ActiveProductsResponse> => {
  try {
    const url =
      "/Myproducts/" +
      userId +
      "?page=" +
      (page || 1) +
      "&pageSize=" +
      pageSize +
      (name ? "&name=" + encodeURIComponent(name) : "");
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("GET USER PRODUCTS ERROR:", error);
    throw new Error(`Failed to get user products: ${error}`);
  }
};

export const getUserBundleProducts = async (
  userId: string,
  page?: number,
  name?: string,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<ActiveBundleProductsResponse> => {
  try {
    const url =
      "/Myproducts/bundle/" +
      userId +
      "?page=" +
      (page || 1) +
      "&pageSize=" +
      pageSize +
      (name ? "&name=" + encodeURIComponent(name) : "");
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("GET USER BUNDLE PRODUCTS ERROR:", error);
    throw new Error(`Failed to get user bundle products: ${error}`);
  }
};

export const getProductPaymentsByEntityId = async (
  entityid: string,
  page?: number,
  name?: string,
  pageSize: number = DEFAULT_PAGE_SIZE,
  assignedBundleName?: string
): Promise<QuotePaymentsResponse> => {
  try {
    const url =
      "/QuotePayment/product/" +
      entityid +
      "?page=" +
      (page || 1) +
      "&pageSize=" +
      pageSize +
      (name ? "&name=" + encodeURIComponent(name) : "") +
      (assignedBundleName
        ? "&assignedBundleName=" + encodeURIComponent(assignedBundleName)
        : "");
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("GET PRODUCT PAYMENTS BY ENTITY ID ERROR:", error);
    throw new Error(`Failed to get product payments: ${error}`);
  }
};

export const updateQuotePayment = async (
  id: string,
  data: FormData
): Promise<PaymentRecord> => {
  try {
    const response = await api.put(`/QuotePayment/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.message;
  } catch (error) {
    console.error("UPDATE QUOTE PAYMENT ERROR:", error);
    throw new Error(`Failed to update quote payment: ${error}`);
  }
};
