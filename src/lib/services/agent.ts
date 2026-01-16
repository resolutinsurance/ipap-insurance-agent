import { Agent, AuthResponse, CreateCustomerCredentials, User } from "@/lib/interfaces";
import Cookies from "js-cookie";
import api from "../api";
import { COOKIE_KEYS, DEFAULT_PAGE_SIZE } from "../constants";
import { AgentsResponse, CustomersResponse } from "../interfaces/response";
import { AgentFormValues } from "../schemas";

export const createCustomer = async (
  credentials: CreateCustomerCredentials
): Promise<AuthResponse> => {
  try {
    const response = await api.post("/userAgent/customer", credentials);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};

export const deleteCustomer = async (userId: string): Promise<void> => {
  try {
    await api.delete(`/User/${userId}`);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};

export const updateAgentCustomer = async (
  userId: string,
  userData: Partial<User>
): Promise<AuthResponse> => {
  try {
    const response = await api.put(`/User/${userId}`, userData);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};

export const getAgentCustomers = async (agentId: string): Promise<CustomersResponse> => {
  try {
    const response = await api.get(`/userAgent/signedUsers/${agentId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch agent customers:", error);
    throw error;
  }
};

export const submitAgentData = async (
  data: Omit<AgentFormValues, "userID">
): Promise<Agent> => {
  const user = Cookies.get(COOKIE_KEYS.user);
  const parsedUser = JSON.parse(user || "{}");
  if (!parsedUser.id) {
    throw new Error("User not authenticated");
  }
  try {
    const jsonData = {
      userID: parsedUser.id,
      yearsofExperience: parseInt(data.yearsofExperience),
    };

    const response = await api.post("/userAgent", jsonData);
    return response.data.message;
  } catch (error) {
    console.error("Agent submission error:", error);
    throw error;
  }
};

export const updateAgentData = async (
  agentId: string,
  data: Partial<AgentFormValues>
): Promise<Agent> => {
  const formData = new FormData();

  if (data.pasportpicGuarantor) {
    formData.append("pasportpicGuarantor", data.pasportpicGuarantor);
  }
  if (data.passportpicAgent) {
    formData.append("passportpicAgent", data.passportpicAgent);
  }
  if (data.guarantoridCard) {
    formData.append("guarantoridCard", data.guarantoridCard);
  }
  if (data.agentidCard) {
    formData.append("agentidCard", data.agentidCard);
  }
  if (data.educationQualification) {
    formData.append("educationQualification", data.educationQualification);
  }
  if (data.yearsofExperience) {
    formData.append("yearsofExperience", String(data.yearsofExperience));
  }

  try {
    const response = await api.put(`/userAgent/${agentId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.message;
  } catch (error) {
    console.error("Agent update error:", error);
    throw error;
  }
};

export const deleteAgentData = async (agentId: string): Promise<void> => {
  try {
    await api.delete(`/userAgent/${agentId}`);
  } catch (error) {
    console.error("Agent deletion error:", error);
    throw error;
  }
};

export const getAllAgents = async (
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<AgentsResponse> => {
  try {
    const response = await api.get(`/userAgent?page=${page}&pageSize=${pageSize}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch agents:", error);
    throw error;
  }
};

export const getCurrentAgent = async (agentId: string): Promise<Agent> => {
  try {
    const response = await api.get(`/userAgent/${agentId}`);
    return response.data.message;
  } catch (error) {
    console.error("Failed to fetch current agent:", error);
    throw error;
  }
};

export const deleteAgent = async (agentId: string): Promise<void> => {
  try {
    await api.delete(`/userAgent/${agentId}`);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};

type AgentProfilePayload = Partial<
  AgentFormValues &
    Pick<User, "email" | "phone" | "fullname" | "dob" | "address"> & {
      companyID?: string;
    }
>;

export const updateAgent = async (
  agentId: string,
  userID: string,
  data: AgentProfilePayload
): Promise<Agent> => {
  const formData = new FormData();

  if (data.pasportpicGuarantor) {
    formData.append("pasportpicGuarantor", data.pasportpicGuarantor);
  }
  if (data.passportpicAgent) {
    formData.append("passportpicAgent", data.passportpicAgent);
  }
  if (data.guarantoridCard) {
    formData.append("guarantoridCard", data.guarantoridCard);
  }
  if (data.agentidCard) {
    formData.append("agentidCard", data.agentidCard);
  }
  if (data.educationQualification) {
    formData.append("educationQualification", data.educationQualification);
  }
  if (data.yearsofExperience) {
    formData.append("yearsofExperience", String(data.yearsofExperience));
  }
  if (data.email || data.phone || data.fullname || data.dob || data.address) {
    formData.append(
      "user",
      JSON.stringify({
        id: userID,
        ...(data.fullname && { fullname: data.fullname }),
        ...(data.address && { address: data.address }),
        ...(data.email && { email: data.email }),
        ...(data.phone && { phone: data.phone }),
        ...(data.dob && { dob: data.dob }),
      })
    );
  }

  try {
    const response = await api.put(`/userAgent/${agentId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.message;
  } catch (error) {
    console.error("Agent update error:", error);
    throw error;
  }
};

export const createAgent = async (data: AgentProfilePayload): Promise<Agent> => {
  const formData = new FormData();
  if (data.pasportpicGuarantor) {
    formData.append("pasportpicGuarantor", data.pasportpicGuarantor);
  }
  if (data.passportpicAgent) {
    formData.append("passportpicAgent", data.passportpicAgent);
  }
  if (data.guarantoridCard) {
    formData.append("guarantoridCard", data.guarantoridCard);
  }
  if (data.agentidCard) {
    formData.append("agentidCard", data.agentidCard);
  }
  if (data.educationQualification) {
    formData.append("educationQualification", data.educationQualification);
  }
  if (data.yearsofExperience) {
    formData.append("yearsofExperience", String(data.yearsofExperience));
  }
  if (data.email) {
    formData.append("email", data.email);
  }
  if (data.phone) {
    formData.append("phone", data.phone);
  }
  if (data.fullname) {
    formData.append("fullname", data.fullname);
  }
  if (data.dob) {
    formData.append("dob", data.dob);
  }
  if (data.companyID) {
    formData.append("companyID", data.companyID);
  }

  try {
    const response = await api.post(`/userAgent`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.message;
  } catch (error) {
    console.error("Agent update error:", error);
    throw error;
  }
};

export const getSingleAgent = async (agentId: string): Promise<Agent> => {
  try {
    const response = await api.get(`/userAgent/${agentId}`);
    return response.data.message;
  } catch (error) {
    console.error("Failed to fetch current agent:", error);
    throw error;
  }
};
