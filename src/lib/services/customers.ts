import api from "../api";
import { DEFAULT_PAGE_SIZE } from "../constants";
import { User } from "../interfaces";
import {
  ClaimsResponse,
  CustomersResponse,
  QuotePaymentsResponse,
} from "../interfaces/response";

export const getAllCustomers = async (
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<CustomersResponse> => {
  try {
    const response = await api.get(`/User?page=${page}&pageSize=${pageSize}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSingleCustomer = async (id: string): Promise<User> => {
  try {
    const response = await api.get(`/User/${id}`);
    return response.data.message;
  } catch (error) {
    throw error;
  }
};

export const getQuotePaymentsByCustomerId = async (
  customerId: string,
  page: number,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<QuotePaymentsResponse> => {
  try {
    const response = await api.get(
      `/QuotePayment/Admin/${customerId}/?type=customer?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch comprehensive cover excess rates:", error);
    throw error;
  }
};

export const getClaimsByCustomerId = async (
  customerId: string,
  page: number,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<ClaimsResponse> => {
  try {
    const response = await api.get(
      `/Claims/Admin/${customerId}/?type=customer?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch comprehensive cover excess rates:", error);
    throw error;
  }
};
