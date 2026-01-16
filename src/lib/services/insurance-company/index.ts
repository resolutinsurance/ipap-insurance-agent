import api from "@/lib/api";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { InsuranceCompany } from "@/lib/interfaces";
import {
  InsuranceCompaniesResponse,
  InsuranceCompanyCustomerTransactionsResponse,
} from "@/lib/interfaces/response";

export const getAllInsuranceCompanies = async (
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<InsuranceCompaniesResponse> => {
  try {
    const response = await api.get(`/insuranceCompany?page=${page}&pageSize=${pageSize}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch insurance companies:", error);
    throw error;
  }
};

export const getInsuranceCompanyTransactions = async (
  insuranceCompanyId: string,
  page: number,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<InsuranceCompanyCustomerTransactionsResponse> => {
  try {
    const response = await api.get(
      `/QuotePayment/showCustomers/${insuranceCompanyId}?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch insurance companies:", error);
    throw error;
  }
};
export const getInsuranceCompanyCustomers = getInsuranceCompanyTransactions;

export const getSingleInsuranceCompany = async (
  insuranceCompanyId: string
): Promise<InsuranceCompany> => {
  try {
    const response = await api.get(`/insuranceCompany/${insuranceCompanyId}`);
    return response.data.message;
  } catch (error) {
    console.error("Failed to fetch insurance companies:", error);
    throw error;
  }
};
