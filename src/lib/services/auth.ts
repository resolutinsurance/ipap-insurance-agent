import {
  AuthResponse,
  DecryptUserResponse,
  LoginCredentials,
  User,
} from "@/lib/interfaces";
import axios from "axios";
import Cookies from "js-cookie";
import api from "../api";
import {
  API_BASE_URL,
  COOKIE_KEYS,
  COOKIE_OPTIONS,
  LOCAL_STORAGE_KEYS,
  ROUTES,
} from "../constants";
import { removeFromLocalStorage } from "../storage";

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  if (!credentials.email || !credentials.password) {
    throw new Error("Email and password are required");
  }
  if (credentials.rememberMe) {
    Cookies.set(COOKIE_KEYS.rememberMe, "true", COOKIE_OPTIONS);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(credentials.email)) {
    throw new Error("Please enter a valid email address");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/User/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `Login failed with status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};

export const decryptUser = async ({
  ref,
  companyID,
}: {
  ref: string;
  companyID: string;
}): Promise<DecryptUserResponse> => {
  try {
    const response = await api.get(
      `/User/getUser/decryptUser?ref=${ref}&companyID=${companyID}`
    );
    return response.data.message;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};

export const resendOTP = async (email: string): Promise<AuthResponse> => {
  try {
    const response = await api.post("/user/refetch-OTP/", { email });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};

export const refreshAuthToken = async (): Promise<AuthResponse> => {
  try {
    const refreshToken = Cookies.get(COOKIE_KEYS.refreshToken) || null;
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
    const response = await axios.post(`${API_BASE_URL}/refreshToken`, {
      refreshToken,
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};

export const updateUser = async (
  userId: string,
  userData: Partial<User>
): Promise<AuthResponse> => {
  try {
    const response = await api.put(`/User/${userId}`, userData);
    return response.data.message;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};

export const getUser = async (userId: string): Promise<User> => {
  try {
    const response = await api.get(`/User/${userId}`);
    return response.data.message;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};

export const changePassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ message: string }> => {
  try {
    const response = await api.put("/User/forgotten_password/passwordChange", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};

export const requestPasswordReset = async (
  email: string
): Promise<{ message: string }> => {
  try {
    const response = await api.post("/User/forgotten_password/send_email", { email });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};

export const verifyPasswordResetCode = async ({
  email,
  otp,
}: {
  email: string;
  otp: string;
}): Promise<{ status: boolean; message: string }> => {
  try {
    const response = await api.post("/User/forgotten_password/verifyuser", {
      email,
      otp,
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
};

export const logout = (callback?: () => void) => {
  Cookies.remove(COOKIE_KEYS.user);
  Cookies.remove(COOKIE_KEYS.accessToken);
  Cookies.remove(COOKIE_KEYS.userType);
  Cookies.remove(COOKIE_KEYS.rememberMe);
  Cookies.remove(COOKIE_KEYS.agent);
  removeFromLocalStorage(LOCAL_STORAGE_KEYS.purchases);
  removeFromLocalStorage(LOCAL_STORAGE_KEYS.quotes);
  removeFromLocalStorage(LOCAL_STORAGE_KEYS.tempEmail);
  callback?.();

  // Only redirect if not already on the login page
  if (typeof window !== "undefined" && window.location.pathname !== ROUTES.LOGIN) {
    window.location.href = ROUTES.LOGIN;
  }
};
