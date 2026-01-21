import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL, COOKIE_KEYS, COOKIE_OPTIONS } from "./constants";
import { logout, refreshAuthToken } from "./services/auth";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000,
  // withCredentials: true,
});

export const refreshToken = async () => {
  try {
    const data = await refreshAuthToken();
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

// Single-flight refresh: if multiple requests fail at once, only refresh once.
let refreshInFlight: Promise<Awaited<ReturnType<typeof refreshToken>>> | null = null;

async function refreshTokenSingleFlight() {
  if (!refreshInFlight) {
    refreshInFlight = refreshToken().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

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
        if (!Cookies.get(COOKIE_KEYS.refreshToken)) {
          logout();
          return Promise.reject(error);
        }

        const refreshData = await refreshTokenSingleFlight();
        if (refreshData?.accessToken && refreshData?.refreshToken) {
          storeTokens(refreshData.accessToken, refreshData.refreshToken);
          originalRequest.headers["Authorization"] = `Bearer ${refreshData.accessToken}`;
          return api(originalRequest);
        }

        logout();
        return Promise.reject(error);
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
