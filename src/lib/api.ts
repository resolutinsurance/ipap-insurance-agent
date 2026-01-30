import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL, COOKIE_KEYS, COOKIE_OPTIONS } from "./constants";
import { logout, refreshAuthToken } from "./services/auth";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000,
  // withCredentials: true,
});

// API route patterns that should skip logout when they fail
// These are typically session/analytics endpoints or public endpoints
const SKIP_LOGOUT_ROUTE_PATTERNS = [
  "/Sesssions", // Session endpoints (analytics/tracking)
  "/SessionEvent", // Session event endpoints
  "/auth/login", // Login endpoint (handles its own errors)
  "/auth/register", // Registration endpoint
  "/public", // Public endpoints
  "/PremiumFinancing/remote-verification",
  "/PremiumFinancing/verifyPaymentTransaction",
  "/VerifyGhanaCard",
];

// Helper function to check if a URL should skip logout
const shouldSkipLogout = (url: string | undefined): boolean => {
  if (!url) return false;

  // Get the path from URL (handle both absolute and relative URLs)
  let path = url;
  if (API_BASE_URL && url.startsWith(API_BASE_URL)) {
    path = url.replace(API_BASE_URL, "");
  } else if (url.startsWith("http")) {
    // If it's an absolute URL, extract the pathname
    try {
      const urlObj = new URL(url);
      path = urlObj.pathname;
    } catch {
      // If URL parsing fails, use the original url
      path = url;
    }
  }

  return SKIP_LOGOUT_ROUTE_PATTERNS.some((pattern) => path.startsWith(pattern));
};

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
      // error.response?.status >= 400 &&
      error.response?.data?.message?.includes("Token") ||
      !Cookies.get(COOKIE_KEYS.accessToken);

    if (isTokenExpiredError && !originalRequest._retry) {
      originalRequest._retry = true;

      // Check if this route should skip logout
      const skipLogout = shouldSkipLogout(originalRequest.url);

      try {
        if (!Cookies.get(COOKIE_KEYS.refreshToken)) {
          if (!skipLogout) {
            console.log("running logout on first try");
            logout();
          }
          return Promise.reject(error);
        }

        const refreshData = await refreshTokenSingleFlight();
        if (refreshData?.accessToken && refreshData?.refreshToken) {
          storeTokens(refreshData.accessToken, refreshData.refreshToken);
          originalRequest.headers["Authorization"] = `Bearer ${refreshData.accessToken}`;
          return api(originalRequest);
        }

        if (!skipLogout) {
          console.log("running logout on second try");
          logout();
        }
        return Promise.reject(error);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        if (!skipLogout) {
          console.log("running logout");
          logout();
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
