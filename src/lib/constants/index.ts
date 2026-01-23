import Cookies from "js-cookie";
import {
  Building2,
  Car,
  ClipboardList,
  FileText,
  HelpCircle,
  Home,
  User,
  type LucideIcon,
} from "lucide-react";

export const ROUTES = {
  LOGIN: "/sign-in",
  VERIFY_EMAIL: "/verify-email",
  VERIFY_ID: "/verify-id",
  FORGOT_PASSWORD: "/forgot-password",
  AGENT: {
    HOME: "/dashboard/home",
    CUSTOMERS: "/dashboard/customers",
    FIND_POLICY: "/dashboard/find-policy",
    POLICY: {
      INDEX: "/dashboard/policies",
      PURCHASED: "/dashboard/policies/purchases",
    },
    FINANCIAL_LOGS: "/dashboard/finances",
    PROFILE: {
      USER: "/dashboard/profile",
      SUPPORT: "/support",
      TERMS: "https://www.ipapglobal.com/terms",
      PRIVACY: "https://www.ipapglobal.com/privacy",
    },
  },

  // Public routes that should be accessible to everyone
  PUBLIC: {
    HOME: "/",
    PRIVACY_POLICY: "/privacy-policy",
    TERMS: "/terms",
    SUPPORT: "/support",
    BLOG: "/blog",
    CONTACT: "/contact",
    DECLARATION_PREVIEW: "/declaration-preview",
    PREMIUM_FINANCING: "/premium-financing",
    QUOTE_PAYMENT: "/quote-payment",
    CUSTOMER_SELF_VERIFICATION: "/customer/self-verification",
    VERIFY_USER: "/verify-user",
    REQUEST_QUOTE: "/request",
    REPAYMENT_SCHEDULE: "/repayment-schedule",
  },
};

export const COOKIE_KEYS = {
  user: "__ipap_ia_user__",
  agent: "__ipap_ia_agent__",
  sidebar: "__ipap_ia_sidebar_state__",
  userType: "__ipap_ia_user_type__",
  rememberMe: "__ipap_remember_me__",
  accessToken: "__ipap_ia_access_token__",
  refreshToken: "__ipap_ia_refresh_token__",
  setupCompleted: "__ipap_ia_setup_completed__",
  emailRef: "__ipap_ia_email_ref__",
  ghanaVerified: "__ipap_ia_ghana_verified__",
  userSession: "__ipap_ia_user_session__",
  userLocation: "__ipap_ia_user_location__",
};

export const USER_TYPES = {
  CUSTOMER: "customer",
  INSURANCE_COMPANY: "insuranceCompany",
  AGENT: "Sysagent",
  SYSTEM_ADMIN: "systemAdmin",
} as const;

export const LOCAL_STORAGE_KEYS = {
  purchases: "__ipap_ia_purchases__",
  quotes: "__ipap_ia_quotes__",
  tempEmail: "__ipap_ia_temp_email__",
  setupStep: "__ipap_ia_setup_step__",
  selectedRiskTypes: "__ipap_ia_selected_risk_types__",
  quoteRequestData: "__ipap_ia_quote_request_data__",
  cart: "__ipap_cart__",
  paymentVerification: "__ipap_ia_payment_verification__",
};

export type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];

export const API_RAW_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const API_BASE_URL = API_RAW_URL;
export const UPLOADS_BASE_URL = `${API_BASE_URL}/uploads/`;

export const accessToken = Cookies.get(COOKIE_KEYS.accessToken);

export const COOKIE_OPTIONS = {
  expires: 7,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
} as const;

export const QUERY_URLS = {
  MOTOR: "MotorPolicyQuotationResponse",
  NON_MOTOR: "NonMotorPolicyQuotationResponse",
};

export const BANK_CODES = [
  { assigned_code: "ECO", bank_name: "ECOBANK GHANA" },
  { assigned_code: "MTN", bank_name: "MTN MOBILE MONEY" },
  { assigned_code: "CBG", bank_name: "CBG" },
  { assigned_code: "BOA", bank_name: "BOA" },
  { assigned_code: "PRB", bank_name: "PBL" },
  { assigned_code: "VOD", bank_name: "VODAFONE CASH" },
  { assigned_code: "SCB", bank_name: "STANDARD CHARTERED" },
  { assigned_code: "CAL", bank_name: "CAL BANK" },
  { assigned_code: "GHL", bank_name: "GHL BANK" },
  { assigned_code: "UBA", bank_name: "UBA" },
  { assigned_code: "ZEE", bank_name: "ZEEPAY GHANA" },
  { assigned_code: "GTB", bank_name: "GT BANK" },
  { assigned_code: "AIR", bank_name: "AIRTELTIGO MONEY" },
  { assigned_code: "ACB", bank_name: "ACCESS BANK" },
  { assigned_code: "SIS", bank_name: "SERVICES INTEGRITY SAVINGS & LOANS" },
  { assigned_code: "FAB", bank_name: "FAB" },
  { assigned_code: "OMN", bank_name: "OMNI BANK" },
  { assigned_code: "FNB", bank_name: "FNB" },
  { assigned_code: "ABS", bank_name: "ABSA BANK" },
  { assigned_code: "GMO", bank_name: "G-MONEY" },
  { assigned_code: "ADB", bank_name: "ADB" },
  { assigned_code: "FBN", bank_name: "FBN BANK" },
  { assigned_code: "ZEB", bank_name: "ZENITH BANK" },
  { assigned_code: "FIB", bank_name: "FIDELITY BANK" },
  { assigned_code: "SGB", bank_name: "SG" },
  { assigned_code: "BOG", bank_name: "BANK OF GHANA" },
  { assigned_code: "UMB", bank_name: "UMB" },
  { assigned_code: "STB", bank_name: "STANBIC BANK" },
  { assigned_code: "NIB", bank_name: "NIB" },
  { assigned_code: "GCB", bank_name: "GCB BANK" },
  { assigned_code: "RPB", bank_name: "REPUBLIC BANK" },
  { assigned_code: "ARB", bank_name: "APEX BANK" },
] as const;

export const MOBILE_MONEY_METHODS = [
  { methodName: "MTN MOBILE MONEY", methodCode: "MTN" },
  { methodName: "TELECEL/VODAFONE CASH", methodCode: "VOD" },
  { methodName: "AIRTELTIGO MONEY", methodCode: "AIR" },
];

export const PAYMENT_METHODS = {
  MOBILE_MONEY: "MOBILE MONEY",
  BANK_TRANSFER: "BANK TRANSFER",
  CARD: "CARD",
};

export const VEHICLE_TYPES_CONST = [
  "PRIVATE",
  "TAXI",
  "UBER OR HIRING",
  "OWN GOODS",
  "GENERAL CARTAGE",
  "MOTOR CYLE",
  "DV",
  "ARTICULATOR / TANKER",
  "AMBULANCE",
  "SPECIAL TYPE ON ROAD",
  "SPECIAL TYPE ON SITE",
];

export const VEHICLE_TYPES_COMPREHENSIVE = [
  "PRIVATE",
  "PRIVATECOR",
  "TAXI",
  "UBER",
  "OWN GOODS",
  "GENERAL CARTAGE",
  "MOTOR CYCLE",
  "ARTICULATOR",
  "AMBULANCE",
  "SPECIAL TYPE ON ROAD",
  "SPECIAL TYPE ON SITE",
];

export const COMPREHENSIVE_COVER_TYPE = {
  id: "029e9f16-7c38-4dd1-b74e-8b75e08fd067",
  name: "Comprehensive",
};

export const THIRD_PARTY_COVER_TYPE = {
  id: "b0529d29-4474-4b82-931d-e0e802e1a562",
  name: "Third Party",
};

export const VALID_COMPREHENSIVE_COVER_KEYS = [
  "PrivateIndividual",
  "PrivateCoorperate",
  "uberorhiringortaxiCover",
  "owngoodsCover",
  "generalcartageCover",
  "motorcycleCover",
  "articulatorortankerCover",
  "ambulanceCover",
  "specialtypeonroadCover",
  "specialtypeonsiteCover",
];

export const DEFAULT_PAGE_SIZE = 20;

export const BUSINESS_TYPES = [
  "Commercial Property",
  "Industrial  Property",
  "Manufacturing",
  "Filling Station",
  "Gas Station",
  "Timber Industry",
  "Cotton Industry",
  "Foam Industry",
  "null",
];

export type MainProductQuoteType =
  | "Comprehensive"
  | "Third Party"
  | "Fire and Theft"
  | "FIREINSURANCE"
  | "AssetAllRisks"
  | "GoodsInTransit"
  | "BuyFireCommercial"
  | "BuyMoneyInsurance";

export const MAIN_PRODUCT_QUOTE_TYPES = {
  COMPREHENSIVE: "Comprehensive",
  THIRDPARTY: "Third Party",
  FIRE: "FIREINSURANCE",
  ASSETALLRISKS: "AssetAllRisks",
  GOODSINTRANSIT: "GoodsInTransit",
  BUYFIRECOMMERCIAL: "BuyFireCommercial",
  BUYMONEYINSURANCE: "BuyMoneyInsurance",
};

// Hashmaps for utility functions
export const USER_TYPE_TO_SIDEBAR_TITLE_MAP: Record<UserType, string> = {
  [USER_TYPES.CUSTOMER]: "IPAP Customer",
  [USER_TYPES.INSURANCE_COMPANY]: "IPAP Insurance Company",
  [USER_TYPES.SYSTEM_ADMIN]: "IPAP Admin",
  [USER_TYPES.AGENT]: "IPAP Agent",
};

export const ROUTE_SEGMENT_TO_ICON_MAP: Record<string, LucideIcon> = {
  dashboard: Home,
  quotes: ClipboardList,
  motor: Car,
  "non-motor": FileText,
  policies: FileText,
  companies: Building2,
  profile: User,
  support: HelpCircle,
};

export const MONTHS_TO_DURATION_MAP: Record<
  number,
  "1month" | "3months" | "6months" | "1year"
> = {
  0: "1month",
  1: "1month",
  2: "3months",
  3: "3months",
  4: "6months",
  5: "6months",
  6: "6months",
};

export const DURATION_TO_PREMIUM_MAP_KEYS = {
  "1month": "monthly",
  "3months": "threeMonths",
  "6months": "sixMonths",
  "1year": "annual",
} as const;

export const PRODUCT_TYPE_TO_QUOTE_TYPE_MAP: Record<string, MainProductQuoteType> = {
  comprehensive: "Comprehensive",
  thirdparty: "Third Party",
  fire: "FIREINSURANCE",
  "buy-money-insurance": "BuyMoneyInsurance",
  "fire-insurance": "BuyFireCommercial",
  "asset-all-risk": "AssetAllRisks",
  "goods-in-transit": "GoodsInTransit",
};

export const COMPANIES = {
  LOYALTY: "c8172917-377e-4219-84d5-a16ed925487c",
  SUTTON_COX: "26626e23-c609-4c4b-8cef-df3d628b68b7",
  HAROLD: "b69e5698-25fe-44a6-a54a-7ee3fbcf0f2f",
  VALENTINE_HERNANDEZ: "caab5756-5b71-402a-aa63-6b30750bf665",
};

// Export payment steps constants
export {
  AGENT_REMOTE_PREMIUM_FINANCING_STEPS,
  CUSTOMER_SELF_VERIFICATION_STEPS,
  getQuotePaymentSteps,
  getStandardPaymentSteps,
  PAYMENT_STEPS,
} from "./payment-steps";
