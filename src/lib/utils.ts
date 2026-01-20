import { clsx, type ClassValue } from "clsx";
import { HomeIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import {
  MainProductQuoteType,
  MONTHS_TO_DURATION_MAP,
  PRODUCT_TYPE_TO_QUOTE_TYPE_MAP,
  ROUTE_SEGMENT_TO_ICON_MAP,
  USER_TYPE_TO_SIDEBAR_TITLE_MAP,
  type UserType,
} from "./constants";
import { LOYALTY_NON_MOTOR_PRODUCTS } from "./constants/non-motor";
import { SIDEBAR_ROUTE_TITLES, USER_TYPE_TO_NAVIGATION_MAP } from "./constants/sidebar";
import { NavSection } from "./interfaces";
import { NonMotorQuoteType } from "./interfaces/non-motor/loyalty";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSidebarTitle(userType: UserType): string {
  return USER_TYPE_TO_SIDEBAR_TITLE_MAP[userType] || "IPAP";
}

/**
 * Gets the page title based on the current path
 */
export function getPageTitle(path: string): string {
  const normalizedPath = path.endsWith("/") ? path.slice(0, -1) : path;

  // Check if we have a direct match
  if (SIDEBAR_ROUTE_TITLES[normalizedPath]) {
    return SIDEBAR_ROUTE_TITLES[normalizedPath];
  }

  // Handle nested routes
  for (const [route, title] of Object.entries(SIDEBAR_ROUTE_TITLES)) {
    if (normalizedPath.startsWith(route) && route !== "/") {
      return title;
    }
  }

  // Default title for unknown routes
  return "IPAP Insurance";
}

// Get the icon based on the current route
export const getRouteIcon = (currentSegment: string) => {
  return ROUTE_SEGMENT_TO_ICON_MAP[currentSegment] || HomeIcon;
};
/**
 * Format currency with Ghana Cedi symbol
 */
export const formatCurrency = (amount: string | number, currency = "GH₵") => {
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return `${currency}${numericAmount?.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Format date to a readable format
 */
export const formatDate = (dateString: string, withTime = true) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(withTime && {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });
};

// Format time
export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get date range based on filter

export const formatTransactionType = (type: string) => {
  return type.replaceAll("_", " ");
};

// Convert masked labels (e.g., "policy_number" or "policy-number") into readable text
export const unmaskLabel = (label: string) => {
  if (!label) return "";
  const cleaned = label.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  return cleaned
    .split(" ")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : ""))
    .join(" ");
};

export function getNavigation(userType: UserType): NavSection[] {
  const navigation = USER_TYPE_TO_NAVIGATION_MAP[userType] || [];
  return navigation;
}

// Helper to format date string to YYYY-MM-DD
export function formatDateForInput(dateString?: string) {
  if (!dateString) return "";
  // Handles both 'YYYY-MM-DD' and ISO strings
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
}

/**
 * Calculate duration from commencement and expiry dates
 * @param commencementDate - The commencement date string
 * @param expiryDate - The expiry date string
 * @returns The calculated duration ("1month", "3months", "6months", "1year")
 */
export function calculateDurationFromDates(
  commencementDate: string,
  expiryDate: string
): "1month" | "3months" | "6months" | "1year" {
  if (!commencementDate || !expiryDate) {
    return "1year"; // Default to 1 year if dates are missing
  }

  const commencement = new Date(commencementDate);
  const expiry = new Date(expiryDate);

  // Calculate the difference in months
  const monthsDiff =
    (expiry.getFullYear() - commencement.getFullYear()) * 12 +
    (expiry.getMonth() - commencement.getMonth());

  // Find the appropriate duration based on months difference
  for (const [maxMonths, duration] of Object.entries(MONTHS_TO_DURATION_MAP).reverse()) {
    if (monthsDiff <= parseInt(maxMonths)) {
      return duration;
    }
  }

  return "1year";
}

export function transformProductTypeToQuoteType(
  productType: string
): MainProductQuoteType {
  return PRODUCT_TYPE_TO_QUOTE_TYPE_MAP[productType] || "FIREINSURANCE";
}

/**
 * Maps quoteType (from PaymentSchedule) to productType (for URL params)
 * This is the reverse of transformProductTypeToQuoteType
 */
export function transformQuoteTypeToProductType(
  quoteType: string | null | undefined
): string {
  if (!quoteType) return "comprehensive";

  // Handle bundle
  if (quoteType === "Bundle") return "bundle";

  // Create reverse mapping from PRODUCT_TYPE_TO_QUOTE_TYPE_MAP
  const quoteTypeToProductTypeMap: Record<string, string> = {
    "Third Party": "thirdparty",
    Comprehensive: "comprehensive",
    FIREINSURANCE: "fire",
    "Fire and Theft": "comprehensive", // Default to comprehensive
    AssetAllRisks: "asset-all-risk",
    GoodsInTransit: "goods-in-transit",
    BuyFireCommercial: "fire-insurance",
    BuyMoneyInsurance: "buy-money-insurance",
  };

  return quoteTypeToProductTypeMap[quoteType] || "comprehensive";
}

export const getLoyaltyNonMotorTitle = (quoteType: NonMotorQuoteType) => {
  return (
    LOYALTY_NON_MOTOR_PRODUCTS.find((item) => item.id === quoteType)?.name ??
    "Loyalty Non Motor Insurance Quotes"
  );
};

const POLICY_TYPE_TO_QUOTE_TYPE_MAP: Record<string, string> = {
  "money insurance": "BuyMoneyInsurance",
  "assets all risks": "AssetAllRisks",
  "goods in transit": "GoodsInTransit",
  "commercial/ industrial fire": "BuyFireCommercial",
};

export function transformPolicyTypeToQuoteType(
  policyType: string | null | undefined
): string | undefined {
  if (!policyType) return undefined;
  const normalized = policyType.trim().toLowerCase();
  return POLICY_TYPE_TO_QUOTE_TYPE_MAP[normalized];
}

export const formatCurrencyToGHS = (amount?: string | number) => {
  if (!amount) return "N/A";
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount).toFixed(2) : amount.toFixed(2);
  return `GHS ${numericAmount.toLocaleString()}`;
};

// Shared Ghana card verification helpers
export const base64ToFile = (base64String: string, filename: string): File => {
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const getDeviceOS = (): "WINDOWS" | "ANDROID" | "IOS" => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes("windows")) return "WINDOWS";
  if (
    userAgent.includes("iphone") ||
    userAgent.includes("ipad") ||
    userAgent.includes("ipod")
  ) {
    return "IOS";
  }
  return "ANDROID";
};

export const normalizeGhanaCardNumber = (raw: string): string => {
  const rawTrimmed = raw.trim();
  if (!rawTrimmed.toUpperCase().startsWith("GHA")) {
    throw new Error('Please enter a Ghana Card number that starts with "GHA".');
  }
  return rawTrimmed.toUpperCase().startsWith("GHA-")
    ? rawTrimmed.toUpperCase()
    : `GHA-${rawTrimmed.toUpperCase().replace(/^GHA-?/i, "")}`;
};

// Format date from ISO string to YYYY-MM-DD format
/**
 * Get status badge color class based on status value
 * Color scheme:
 * - Red: cancelled, rejected, overdue, defaulted
 * - Yellow: pending
 * - Blue: in progress, in-progress
 * - Green: success-related (paid, approved, completed, active, verified, success)
 */
export const getStatusColor = (status: string | null | undefined): string => {
  if (!status) return "bg-gray-100 text-gray-800";

  const normalizedStatus = status.toLowerCase().trim();

  // Red statuses: cancelled, rejected, overdue, defaulted
  if (
    normalizedStatus === "cancelled" ||
    normalizedStatus === "canceled" ||
    normalizedStatus === "rejected" ||
    normalizedStatus === "overdue" ||
    normalizedStatus === "defaulted"
  ) {
    return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
  }

  // Yellow statuses: pending
  if (normalizedStatus === "pending") {
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
  }

  // Blue statuses: in progress, in-progress, payment in progress
  if (
    normalizedStatus === "in progress" ||
    normalizedStatus === "in-progress" ||
    normalizedStatus === "inprogress" ||
    normalizedStatus === "payment in progress" ||
    normalizedStatus === "payment-in-progress" ||
    normalizedStatus === "paymentinprogress" ||
    normalizedStatus.includes("in progress")
  ) {
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
  }

  // Green statuses: success-related (paid, approved, completed, active, verified, success)
  if (
    normalizedStatus === "paid" ||
    normalizedStatus === "approved" ||
    normalizedStatus === "completed" ||
    normalizedStatus === "active" ||
    normalizedStatus === "verified" ||
    normalizedStatus === "success" ||
    normalizedStatus === "successful"
  ) {
    return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
  }

  // Default gray for unknown statuses
  return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
};
