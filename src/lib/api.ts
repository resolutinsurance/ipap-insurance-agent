import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL, COOKIE_KEYS, COOKIE_OPTIONS } from "./constants";
import { logout } from "./services/auth";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000,
  // withCredentials: true,
});

export const refreshToken = async () => {
  const refreshToken = Cookies.get(COOKIE_KEYS.refreshToken) || null;
  try {
    const { data } = await api.post("/refreshToken", { refreshToken });
    return data;
  } catch (error) {
    console.error("Token refresh failed:", error);
    logout();
    return null;
  }
};

const storeTokens = (accessToken: string, refreshToken: string) => {
  Cookies.set(COOKIE_KEYS.accessToken, accessToken, COOKIE_OPTIONS);
  Cookies.set(COOKIE_KEYS.refreshToken, refreshToken, COOKIE_OPTIONS);
};

let tokenRefreshInterval: NodeJS.Timeout | null = null;

export const startTokenRefreshInterval = () => {
  if (tokenRefreshInterval) {
    clearInterval(tokenRefreshInterval);
  }

  tokenRefreshInterval = setInterval(async () => {
    try {
      const refreshData = await refreshToken();
      if (refreshData?.accessToken && refreshData?.refreshToken) {
        storeTokens(refreshData.accessToken, refreshData.refreshToken);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Failed to refresh token in interval", error);
      logout();
    }
  }, 10 * 60 * 1000); // 10 minutes in milliseconds
};

export const stopTokenRefreshInterval = () => {
  if (tokenRefreshInterval) {
    clearInterval(tokenRefreshInterval);
    tokenRefreshInterval = null;
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get(COOKIE_KEYS.accessToken);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isTokenExpiredError =
      error.response?.status >= 400 &&
      (error.response?.data?.message?.includes("Token") ||
        !Cookies.get(COOKIE_KEYS.accessToken));

    if (isTokenExpiredError && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (
          Cookies.get(COOKIE_KEYS.accessToken) &&
          Cookies.get(COOKIE_KEYS.refreshToken)
        ) {
          const refreshData = await refreshToken();
          if (refreshData?.accessToken && refreshData?.refreshToken) {
            storeTokens(refreshData.accessToken, refreshData.refreshToken);

            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${refreshData.accessToken}`;
            return api(originalRequest);
          } else {
            logout();
            return Promise.reject(error);
          }
        } else {
          logout();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
