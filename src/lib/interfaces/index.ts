/* eslint-disable @typescript-eslint/no-explicit-any */
import { LucideIcon } from "lucide-react";
import {
  MainProductQuoteType,
  MOBILE_MONEY_METHODS,
  PAYMENT_METHODS,
  QUERY_URLS,
} from "../constants";

export interface SearchBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  background?: string;
}

// Shared reward types for payment flows
export type UseRewardOption = "Yes" | "No";
export type RewardSelectorType = "Insurance Discount" | "Saved Points" | "None";

export interface RewardsData {
  useReward: UseRewardOption;
  rewardType: RewardSelectorType;
  rewardValue: number;
}

export const DEFAULT_REWARDS_DATA: RewardsData = {
  useReward: "No",
  rewardType: "None",
  rewardValue: 0,
};

export interface Pagination {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize?: number;
}

export interface FinancialAccountingEntry {
  id: string;
  entity_code: string;
  account_number: string;
  transaction_channel: string;
  inputter: string;
  authorizer: string;
  transaction_type: string;
  transaction_number: string;
  transaction_date: string; // ISO date string
  transaction_narration: string;
  transaction_amount: string; // Consider using number if applicable
  currency: string;
  local_currency: string;
  exchange_rate: string; // Consider using number if applicable
  transaction_status: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface TransactionJournalEntry {
  id: string;
  transaction_number: string;
  debit_account: string | null;
  credit_account: string | null;
  transaction_amount: string; // Consider using number if preferred
  timestamp: string; // ISO date string
  transaction_status: string;
  error_msg: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface CustomerTransaction {
  fullname: string;
  email: string;
  address: string | null;
  dob: string;
  phone: string;
  premiumAmount: string;
  quoteType: string;
  method: string;
  methodName: string;
  methodCode: string;
  accountNumber: string;
  accountName: string;
  transaction_no: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userID?: string; // User ID if available in the response
}

// Define user type
export interface User {
  id: string;
  GhcardNo?: string | null;
  fullname: string;
  email: string;
  phone: string;
  address?: string | null;
  dob?: string;
  policyId?: string | null;
  preferredInsuranceType?: string | null;
  verified?: boolean;
  is_agent?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignUpCredentials {
  email: string;
  phone: string;
  password: string;
  fullname: string;
  dob: string;
  registeredByAgentID?: string;
  referredBy?: string;
}
export interface CreateCustomerCredentials {
  email: string;
  phone: string;
  fullname: string;
  dob: string;
  address: string;
  registeredByAgentID?: string;
}

export interface SignUpResponse {
  id: string;
  verified: boolean;
  email: string;
  phone: string;
  fullname: string;
  dob: string;
  address: string | null;
  policyId: string | null;
  preferredInsuranceType: string | null;
}

export interface AuthResponse {
  message: string | SignUpResponse | User;
  refreshToken?: string;
  accessToken?: string;
  user?: User;
  InsuranceCompany?: InsuranceCompany;
  agentData?: Agent;
  role?: UserRole;
  purchases?: unknown[];
  quotes?: unknown[];
}

export interface DecryptUserResponse {
  email: string;
  companyID: string;
  ref: string;
}

export interface Identity {
  id: number;
  updatedAt: string;
  createdAt: string;
  FBUserId: string | null;
  IDNumber: string | null;
  address: string | null;
  city: string | null;
  dob: string | null;
  email: string;
  phoneNumber: string;
  employer: string | null;
  fullName: string;
  gender: string | null;
  occupation: string | null;
  othernames: string;
  passwordResetExpires: string | null;
  pinRetries: number;
  pinSet: boolean;
  profilePhotoUrl: string | null;
  stateOrRegion: string | null;
  surname: string;
  userSuspended: boolean;
  userVerified: boolean;
  version: number;
}

export interface HomeCardProps {
  title: string;
  description: string;
  ctaText: string;
  bgColor: string;
  imageSrc: string;
  imageAlt: string;
  ctaLink: string;
}

export interface QuoteResponse {
  name: string;
  company: string;
  billing: string;
  extraHours: number;
  type: "Mobile" | "Web App" | "Website" | "Marketing";
  avatar: string;
}

export interface Policy {
  id: string;
  type: string;
  date: string;
  expiryDate?: string;
  responses?: number;
  product: string;
  premium: string;
  actions: ("revoke" | "view" | "cancel" | "pay")[];
}

export interface RoleFeature {
  feature: string;
  included: boolean;
}

export interface RoleType {
  id: string;
  title: string;
  icon: string;
  features: RoleFeature[];
  buttonText: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface UserRole {
  id: string;
  role: string;
  userID: string;
  createdAt: string;
  updatedAt: string;
}

export interface InsuranceCompanyRiskType {
  id: string;
  insurancecompanyID: string;
  riskType: {
    code: string;
    inputter: string;
    name: string;
    risk_category: string;
  };
  riskTypeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface RiskType {
  id: string;
  name: string;
  code: string;
  risk_category?: string;
  claims_expense?: string;
  commission_payable?: string;
  premium_income?: string;
  reinsurance_claim_expense?: string;
  reinsurance_comm_receivable?: string;
  reinsurance_commission_payable?: string;
  reinsurance_fac_premium?: string;
  reinsurance_premium_payable?: string;
  reinsurance_revenue?: string;
  unearned_premium_provision?: string;
  inputter?: string;
  riskTypeId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InsuranceCompany {
  id: string;
  name?: string;
  api_type?: string;
  cityAddress?: string;
  companylogo?: string;
  country?: string;
  createdAt?: string;
  has_api?: boolean;
  postAddress?: string;
  registrationdoc?: string;
  registrationnumber?: string;
  request_status?: string;
  stateAddress?: string;
  streetAddress?: string;
  taxid_no?: string;
  updatedAt: string;
  userID: string;
  user?: User;
  verified: boolean;
  websiteURL: string;
  coveredRiskTypes: string[];
  addedValueForFireandTheft?: string;
  addedValueForComprehensive?: string;
  addedValueForThirdParty?: string;
}

export interface InsuranceCompanyFormData {
  registrationnumber: string;
  taxid_no: string;
  streetAddress: string;
  cityAddress: string;
  stateAddress: string;
  postAddress: string;
  country: string;
  userID: string;
  companylogo?: File | null;
  websiteURL?: string;
  registrationdoc?: File | null;
  name: string;
  addedValueForFireandTheft?: string;
  addedValueForComprehensive?: string;
  addedValueForThirdParty?: string;
}

export interface InsuranceCompanyRiskTypeRequest {
  insurancecompanyID: string;
  riskTypeId: string[];
}

export interface Agent {
  id: string;
  pasportpicGuarantor: string | null;
  passportpicAgent: string | null;
  guarantoridCard: string | null;
  agentidCard: string | null;
  educationQualification: string | null;
  yearsofExperience: number;
  userID: string;
  companyID?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    fullname: string;
    address?: string;
    email?: string;
    dob?: string;
    phone: string;
  };
}

// Interfaces for policy data
export interface MotorPolicy {
  id: string;
  make?: string;
  model?: string;
  year_of_manufacture?: number;
  engine_capacity?: string;
  chasis_number?: string;
  mileage?: string;
  body_type?: string;
  days?: number;
  noof_seats?: number;
  extra_seats?: number;
  sum_insured?: number;
  registration_no?: string;
  inception_date?: string;
  expiry_date?: string;
  currency?: string;
  color_of_car?: string;
  cover_type_id?: string;
  usage_type_id?: string;
  userID?: string;
  reqQuoteID?: string;
  requestStatus?: string;
  fuel_type?: string;
  class?: string;
  product_id?: string;
  user_category_id?: string;
  user_type?: string;
  vehicle_additional_remarks?: string;
  vehicle_capacity?: number;
  vehicle_claim_free?: number;
  vehicle_drive_type?: string;
  vehicle_no_cylinders?: number;
  vehicle_trim?: string;
  userAgentID?: string | null;
  createdAt?: string;
  updatedAt?: string;
  No_of_Responses?: number;
}

export interface NonMotorPolicy {
  id: string;
  userID: string;
  userAgentID: string | null;
  reqQuoteID: string;
  requestStatus: string;
  risk_class_id: string;
  risk_type_id: string;
  insuredItems: string;
  sum_insured: number;
  currency: string;
  noofdays: number;
  specify_days: number;
  inception_date: string;
  expiry_date: string;
  createdAt: string;
  updatedAt: string;
  No_of_Responses?: number;
}

export interface PolicyResponse {
  id: string;
  premiumAmount: string;
  paymentFrequency: string;
  inputter: string;
  requestquote?: MotorPolicy | NonMotorPolicy;
  quote_response?: QuoteResponse;
  quote_response_id?: string;
  userAgentID?: string | null;
  companyID?: string;
  transaction_no?: string;
  currency?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  insuranceCompany?: InsuranceCompany;
}

export interface CompanyUser {
  fullname: string;
  email: string;
  phone: string;
}

export interface CoverType {
  id: string;
  name: string;
  symbol?: string;
  inputter?: string;
  createdAt?: Date;
  updatedAt?: Date;
  description?: string;
  icon?: string;
}

export interface UsageType {
  id: string;
  type?: string;
  symbols?: string;
  inputter?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VehicleType {
  id: string;
  body_type?: string;
  type_name?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NonMotorRiskParam {
  id: string;
  RiskClass?: string;
  RiskCode?: string;
  RiskType?: string;
  SGrouP?: string;
  S_GroupDesc?: string;
  S_RiskCode?: string;
  S_RiskName?: string;
  ShortClass?: string;
  ShortCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PolicyResponseSubmission {
  requestquote_id: string;
  userID: string;
  premiumAmount: number;
  paymentFrequency: string;
  expiry_date: string;
  inputter: string;
}

export interface PolicyResponseResult {
  message: {
    userID: string;
    requestquote: {
      userID: string;
      user: {
        email: string;
      };
    };
    user: {
      email: string;
    };
  };
}

export interface QuoteData {
  premiumAmount: string;
  paymentFrequency: "monthly" | "annual";
  inputter?: string;
  requestquote_id: string;
  userID: string;
  companyID: string;
}

export interface QuoteResponse {
  premiumAmount: string;
  paymentFrequency: string;
  insuranceCompany: {
    name: string;
  };
}

export interface MotorPolicyPurchase {
  id: string;
  requestquote_id: string;
  userID: string;
  premiumAmount: string;
  quote_response_id: string;
  userAgentID: string | null;
  companyID: string;
  transaction_no: string;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  requestquote: MotorPolicy;
  quote_response: QuoteResponse;
}

export interface NonMotorPolicyPurchase {
  id: string;
  requestquote_id: string;
  userID: string;
  premiumAmount: string;
  quote_response_id: string;
  companyID: string;
  userAgentID: string | null;
  transaction_no: string;
  risk_type_id: string;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  requestquote: NonMotorPolicy;
  quote_response: QuoteResponse;
}

export interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "profile";
  userType: string;
  selectedCustomer?: User | null;
  onSuccess?: () => void;
}

export interface ApiError {
  response?: {
    status: number;
    data?: {
      message: string;
      id?: string;
    };
  };
}

export interface NonMotorRiskRate {
  id: string;
  risk_param_id: string;
  class: string;
  min_rate: string;
  max_rate: string;
  created_by: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRequest {
  id?: string;
  amount: number;
  quoteId: string;
  query_url: typeof QUERY_URLS.MOTOR | typeof QUERY_URLS.NON_MOTOR;
  method:
    | typeof PAYMENT_METHODS.MOBILE_MONEY
    | typeof PAYMENT_METHODS.BANK_TRANSFER
    | typeof PAYMENT_METHODS.CARD;
  accountNumber: string;
  accountName: string;
  methodCode: (typeof MOBILE_MONEY_METHODS)[number]["methodCode"];
  methodName: (typeof MOBILE_MONEY_METHODS)[number]["methodName"];
}

export interface QuotePaymentRequest {
  id?: string;
  premiumAmount: number;
  method:
    | typeof PAYMENT_METHODS.MOBILE_MONEY
    | typeof PAYMENT_METHODS.BANK_TRANSFER
    | typeof PAYMENT_METHODS.CARD;
  methodCode: (typeof MOBILE_MONEY_METHODS)[number]["methodCode"];
  methodName: (typeof MOBILE_MONEY_METHODS)[number]["methodName"];
  accountNumber: string;
  accountName: string;
  userID: string;
  companyID: string;
  quoteType: MainProductQuoteType;
  entityid: string;
  userAgentID?: string;
  useReward?: "Yes" | "No";
  rewardType?: "Insurance Discount" | "Saved Points" | "None";
  rewardValue?: number;
  signature?: UploadedFile;
}

export interface QuotePaymentRequestWithPremiumFinancing {
  id?: string;
  premiumAmount: number;
  method:
    | typeof PAYMENT_METHODS.MOBILE_MONEY
    | typeof PAYMENT_METHODS.BANK_TRANSFER
    | typeof PAYMENT_METHODS.CARD;
  methodCode: (typeof MOBILE_MONEY_METHODS)[number]["methodCode"];
  methodName: (typeof MOBILE_MONEY_METHODS)[number]["methodName"];
  accountNumber: string;
  accountName: string;
  userID: string;
  companyID: string;
  quoteType: MainProductQuoteType;
  entityid: string;
  userAgentID?: string;
  currentDeposit: number;
  paymentFrequency: string;
  duration: number;
  signature?: UploadedFile;
  GhanaCardId?: string;
}

export type CustomerPaymentRequestWithPremiumFinancing =
  QuotePaymentRequestWithPremiumFinancing & {
    fromAgent: boolean;
  };

export interface BundlePaymentRequestWithPremiumFinancing {
  id?: string;
  premiumAmount: number;
  method:
    | typeof PAYMENT_METHODS.MOBILE_MONEY
    | typeof PAYMENT_METHODS.BANK_TRANSFER
    | typeof PAYMENT_METHODS.CARD;
  methodCode: (typeof MOBILE_MONEY_METHODS)[number]["methodCode"];
  methodName: (typeof MOBILE_MONEY_METHODS)[number]["methodName"];
  accountNumber: string;
  accountName: string;
  userID: string;
  companyID: string[];
  quoteType: string[];
  entityid: string[];
  userAgentID?: string;
  currentDeposit: number;
  paymentFrequency: string;
  duration: number;
  assignedBundleName: string;
  signature?: UploadedFile;
  GhanaCardId?: string;
}

export interface PremiumFinancingCalculateDataRequest {
  premiumAmount: number;
  initialDeposit: number;
  duration: number;
  paymentFrequency: string;
  quoteType: string;
}

export interface PremiumFinancingCalculateDataResponse {
  premiumAmount: number;
  stickerFee: number;
  processingFeeRate: number;
  noofInstallments: number;
  firstInstallment: number;
  payDifference: number;
  initialProcessingFee: number;
  minimumInitialDeposit: number;
  initialloanAmount: number;
  actualProcessingFee: number;
  initialDeposit: number;
  loanAmount: number;
  interestRate: number;
  interestRatePercent: string;
  paymentFrequency: string;
  appliedRate: number;
  appliedRatePercent: string;
  interestPerInstallment: number;
  totalInterestValue: number;
  totalRepayment: number;
  duration: number;
  currentDeposit: number;
  regularInstallment: number;
  totalPaid: number;
  balance: number;
  lastInstallmentno: number;
  lastInstallmentvalue: number;
  lastInstallmentdate: string | null;
  monthlyRate: number;
  monthlyRatePercent: string;
  dailyRate: number;
  dailyRatePercent: string;
  weeklyRate: number;
  weeklyRatePercent: string;
}

export interface DecryptPremiumFinancingRequest {
  token: string;
}

export interface DecryptPremiumFinancingResponse {
  id: string;
  userID: string;
}

export interface SetupPremiumFinancingRequest {
  premiumAmount: number;
  initialDeposit: number;
  duration: number;
  quoteType: string;
  paymentFrequency: string;
  userID: string;
  companyID: string;
  userAgentID: string;
  entityid: string;
  fromAgent: boolean;
}

export interface BundleRewardItem {
  companyID: string;
  quoteType: string;
  useReward: "Yes" | "No";
  rewardType: "Insurance Discount" | "Saved Points" | "None";
  rewardValue: string;
}

export interface PurchaseBundleRequest {
  premiumAmount: number;
  method:
    | typeof PAYMENT_METHODS.MOBILE_MONEY
    | typeof PAYMENT_METHODS.BANK_TRANSFER
    | typeof PAYMENT_METHODS.CARD;
  methodCode: (typeof MOBILE_MONEY_METHODS)[number]["methodCode"];
  methodName: (typeof MOBILE_MONEY_METHODS)[number]["methodName"];
  accountNumber: string;
  accountName: string;
  userID: string;
  bundleNameID: string;
  userAgentID: string;
  commencementDate: string;
  ExpiryDate: string;
  rewardObj?: BundleRewardItem[];
  signature?: UploadedFile;
}

interface BaseCoverType {
  name: string;
  registrationNo: string;
  typeofVehicle: string;
  yearofMake: number;
  make: string;
  model: string;
}

export interface ThirdPartyBase extends BaseCoverType {
  thirdpartyCovertype: string;
}

export interface ComprehensiveBase extends BaseCoverType {
  valueofVehicle: number;
  tppdLimit: number;
  excess: number;
  comprehensiveCover: string;
}

export interface ThirdPartyWithUID extends ThirdPartyBase {
  userID: string;
}

export interface ComprehensiveWithUID extends ComprehensiveBase {
  userID: string;
}
export interface ComprehensiveWithEmail extends ComprehensiveBase {
  userEmail: string;
}
export interface ThirdPartyWithEmail extends ThirdPartyBase {
  userEmail: string;
}

export interface ComprehensiveCoverExcessRate {
  id?: string;
  companyID: string;
  PrivateIndividual: boolean;
  PrivateCoorperate: boolean;
  uberorhiringortaxiCover: boolean;
  owngoodsCover: boolean;
  generalcartageCover: boolean;
  motorcycleCover: boolean;
  articulatorortankerCover: boolean;
  ambulanceCover: boolean;
  specialtypeonroadCover: boolean;
  specialtypeonsiteCover: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MotorPolicyQuoteRequests {
  thirdpartydata: ThirdPartyQuoteRequestData[];
  comprehensivedata: ComprehensiveQuoteRequestData[];
  thirdpartyfireandtheft: ThirdPartyQuoteRequestData[];
}

export interface ThirdPartyQuoteRequestData {
  id: string;
  name: string;
  typeofVehicle: string;
  yearofMake: number;
  make: string;
  model: string;
  userEmail: string;
  thirdpartyCovertype: string;
  userID: string | null;
  address: string | null;
  phoneNumber: string | null;
  dob: string; // ISO string (can use Date if you plan to parse it)
  ghanaCard: string | null;
  occupation: string | null;
  seatingCapacity: number | null;
  chasisNumber: string | null;
  colorofVehicle: string | null;
  cubicCapacity: number | null;
  commencementDate: string | null;
  ExpiryDate: string | null;
  declaration?: boolean;
  companyID: string;
  registrationNo: string;
  userAgentID: string;
  createdAt: string;
  updatedAt: string;
  insurancecompanies: ThirdPartyInsuranceCompanyResponse[];
  paymentStatus:
    | "NOT PURCHASED"
    | "ONE-TIME PURCHASE"
    | "PART PAYMENT"
    | "PURCHASE COMPLETED"
    | null;
}

export interface ThirdPartyInsuranceCompanyResponse {
  addedValueForThirdParty: string | null;
  annual: number;
  id: string;
  monthly: number;
  name: string;
  sixMonths: number;
  threeMonths: number;
}

export interface ComprehensiveInsuranceCompanyResponse {
  Offerscoverforthisvehicle: number;
  addedValueForComprehensive: string;
  ecowasSticker: string;
  id: string;
  name: string;
  premiumAmount: string;
  thirdpartyAnnualPremimum: string;
}

export interface ComprehensiveQuoteRequestData {
  id: string;
  name: string;
  registrationNo: string;
  yearofMake: number;
  make: string;
  model: string;
  typeofVehicle: string;
  valueofVehicle: string;
  tppdLimit: string;
  excess: string;
  userEmail: string;
  comprehensiveCover: string;
  insurancecompanies?: ComprehensiveInsuranceCompanyResponse[];
  address: string | null;
  companyID: string;
  phoneNumber: string | null;
  dob: string | null;
  ghanaCard: string | null;
  occupation: string | null;
  userAgentID: string | null;
  seatingCapacity: number | null;
  chasisNumber: string | null;
  colorofVehicle: string | null;
  cubicCapacity: number | null;
  commencementDate: string | null;
  paymentStatus:
    | "NOT PURCHASED"
    | "ONE-TIME PURCHASE"
    | "PART PAYMENT"
    | "PURCHASE COMPLETED"
    | null;
  ExpiryDate: string | null;
  userID: string | null;
  createdAt: string;
  updatedAt: string;
  declaration?: boolean;
}

export interface ReferralUser {
  fullname: string;
  email: string;
  phone: string;
  is_flagged: boolean;
  is_agent: boolean;
}

export interface ReferralCode {
  id: string;
  userID: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  pointsBalance?: number;
  referralsClaimed?: number;
  totalReferrals?: number;
  user?: ReferralUser;
}

export type RewardType = "Money" | "Airtime";

export interface ClaimedReward {
  id: string;
  userID: string;
  code: string;
  rewardType: RewardType;
  status: string;
  point: number;
  transactionNumber: string | null;
  createdAt: string;
  updatedAt: string;
  user: ReferralUser;
  accountNumber: string;
  methodCode: string;
}

export interface ClaimReferralPayload {
  code: string;
  rewardType: RewardType;
  points: number;
  method: string;
  methodName: string;
  methodCode: string;
  accountNumber: string;
  accountName: string;
}

export interface ResponseForComprehensiveQuoteRequest {
  Offerscoverforthisvehicle: number;
  addedValueForComprehensive: string;
  ecowasSticker: string;
  id: string;
  name: string;
  premiumAmount: string;
  thirdpartyAnnualPremimum: string;
}

export interface ResponseForThirdPartyQuoteRequest {
  addedValueForThirdParty: string | null;
  annual: number;
  id: string;
  monthly: number;
  name: string;
  sixMonths: number;
  threeMonths: number;
}

export interface QuoteCompletion {
  address: string;
  telephoneNumber: string;
  emailAddress: string;
  dateOfBirth: string; // or Date if working with Date objects
  ghanaCard: string;
  occupation: string;
  seatingCapacity: number;
  chassisNumber: string;
  colourOfVehicle: string;
  cubicCapacity: number;
  commencementDate: string; // or Date
  expiryDate: string; // or Date
}

export interface PaymentRecord {
  id: string;
  userID: string;
  assignedBundleName?: string | null;
  bundleName?: string | null;
  companyID: string;
  userAgentID: string;
  premiumAmount: string; // or number, depending on how your backend sends it
  quoteType: "Comprehensive" | "Third Party"; // restrict if only two types
  method: string;
  methodName: string;
  methodCode: string;
  accountNumber: string;
  accountName: string;
  refId: string | null;
  status: "pending" | "success" | "failed"; // extend as needed
  createdAt: string; // ISO date string; use Date if you parse it
  updatedAt: string;
  user: User;
  premiumfinancingID: string | null;
  insuranceCompany: {
    name: string;
  };
  user_agent: {
    id: string;
    user: User;
  };
  transaction_no: string;
  entityid: string;
  PolicyNumber: string | null;
  entityObj: ThirdPartyQuoteRequestData | ComprehensiveQuoteRequestData | BundleData;
  declarationDoc?: UploadedFile;
  signature?: UploadedFile;
}

export interface ActiveProduct {
  entityid: string | null; // or assignedBundleName for bundles
  isBundle: boolean;
  latestPayment: number; // Most recent payment amount for this product
  totalPayments: number; // Count of all payments for this product
  totalPaid: number; // Sum of all successful payment amounts
  productInfo: {
    quoteType: string;
    // Can be any of the supported product types (motor, fire, bundles, loyalty products, etc.)
    // We keep this broad because different endpoints return different shapes.
    entityObj:
      | ThirdPartyQuoteRequestData
      | ComprehensiveQuoteRequestData
      | BundleData
      // Fallback for other product types (e.g. AssetAllRisks, Fire Commercial, Money Insurance, etc.)
      | Record<string, unknown>
      | null;
    insuranceCompany: { name: string };
    // Other relevant product and agent details can be nested here
    agent?: Record<string, unknown> | null;
  };
  // Raw overall status string from the backend (e.g. "NOT PURCHASED", "PART PAYMENT", "PURCHASE COMPLETED")
  // We'll normalise this on the frontend when displaying.
  paymentStatus?: string | null;
  createdAt: string; // Date of first payment
  updatedAt: string; // Date of latest payment
}

export interface ActiveBundleProduct {
  entityid: string;
  isBundle: true;
  bundleId: string;
  latestPayment: number; // Most recent payment amount for this bundle
  totalPayments: number; // Count of all payments for this bundle
  totalPaid: number; // Sum of all successful payment amounts
  productInfo: {
    quoteType: string;
    entityObj: BundleData; // Bundle products always have BundleData as entityObj
    // insuranceCompany: { name: string };
    // agent?: Agent | null;
  };
  // Raw overall status string from the backend (e.g. "NOT PURCHASED", "PART PAYMENT", "PURCHASE COMPLETED")
  // We'll normalise this on the frontend when displaying.
  paymentStatus?: string | null;
  createdAt: string; // Date of first payment
  updatedAt: string; // Date of latest payment
}

export interface Claim {
  id: string;
  userID: string;
  status: "pending" | "approved" | "rejected"; // assuming limited statuses
  rejectionReason: string | null;
  PolicyNumber: string;
  IdentificationDocument: string;
  InsuranceType: string;
  PolicyHolderName: string;
  CoverTypeEntityId: string;
  CoverType: string;
  EffectiveDate: string; // ISO date string
  ExpiryDate: string; // ISO date string
  userAgentID: string;
  companyID: string;
  DateOfIncident: string; // ISO date string
  LocationofIncident: string;
  Description: string;
  CauseofLoss: string;
  AnyoneInjured: boolean;
  AuthoritiesNotified: boolean;
  ReportNumber: string;
  PhotoorVideosofDamage: string;
  PoliceReport: string;
  MedicalReport: string;
  RepairInvoice: string;
  ProofofOwnership: string;
  IDProof: string;
  TypeofClaim: string;
  Amount: string; // consider using number if this is always a numeric value
  ThirdPartyInfo: string;
  WitnessInfo: string;
  method: string;
  methodName: string;
  methodCode: string;
  accountNumber: string;
  accountName: string;
  refId: string | null;
  transaction_no: string | null;
  ConfirmAccuracy: boolean;
  Consent: boolean;
  DeclarationofTruth: boolean;
  policyID: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  user: User;
}

export interface MakeClaimPayload {
  userID: string;
  PolicyNumber: string;
  IdentificationDocument: string | null;
  InsuranceType: string;
  PolicyHolderName: string;
  CoverTypeEntityId: string;
  CoverType: string;
  EffectiveDate: string; // format: YYYY-MM-DD
  ExpiryDate: string; // format: YYYY-MM-DD
  userAgentID?: string;
  companyID: string;
  DateOfIncident: string; // format: YYYY-MM-DD
  LocationofIncident: string;
  Description: string;
  CauseofLoss: string;
  AnyoneInjured: boolean;
  AuthoritiesNotified: boolean;
  ReportNumber: string;
  PhotoorVideosofDamage: string | null;
  PoliceReport: string | null;
  MedicalReport: string | null;
  RepairInvoice: string | null;
  ProofofOwnership: string | null;
  IDProof: string | null;
  TypeofClaim: string;
  Amount: number;
  ThirdPartyInfo: string;
  WitnessInfo: string;
  method: string;
  methodName: string;
  methodCode: string;
  accountNumber: string;
  accountName: string;
  ConfirmAccuracy: boolean;
  Consent: boolean;
  DeclarationofTruth: boolean;
}

export interface FireInsurancePeril {
  id?: string;
  impactPeril: boolean;
  AircraftPeril: boolean;
  ExplosionPeril: boolean;
  WindStormPeril: boolean;
  BurstPipePeril: boolean;
  FloodPeril: boolean;
  EarthQuakePeril: boolean;
  RiotPeril: boolean;
  BushfirePeril: boolean;
  companyID?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFireInsurancePerilPayload {
  impactPeril: boolean;
  AircraftPeril: boolean;
  ExplosionPeril: boolean;
  WindStormPeril: boolean;
  BurstPipePeril: boolean;
  FloodPeril: boolean;
  EarthQuakePeril: boolean;
  RiotPeril: boolean;
  BushfirePeril: boolean;
}
export interface FireInsuranceDiscount {
  id?: string;
  CommercialPropertyLTA: boolean;
  CommercialPropertyFEA: boolean;
  CommercialPropertyHydrant: boolean;
  FillingStationLTA: boolean;
  FillingStationFEA: boolean;
  FillingStationHydrant: boolean;
  TimberIndustryLTA: boolean;
  TimberIndustryFEA: boolean;
  TimberIndustryHydrant: boolean;
  CottenIndustryLTA: boolean;
  CottenIndustryFEA: boolean;
  CottenIndustryHydrant: boolean;
  companyID?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFireInsuranceDiscountPayload {
  CommercialPropertyLTA: boolean;
  CommercialPropertyFEA: boolean;
  CommercialPropertyHydrant: boolean;
  FillingStationLTA: boolean;
  FillingStationFEA: boolean;
  FillingStationHydrant: boolean;
  TimberIndustryLTA: boolean;
  TimberIndustryFEA: boolean;
  TimberIndustryHydrant: boolean;
  CottenIndustryLTA: boolean;
  CottenIndustryFEA: boolean;
  CottenIndustryHydrant: boolean;
}

export interface FireInsuranceDeductible {
  id?: string;
  CommercialProperty: boolean;
  FillingStation: boolean;
  TimberIndustry: boolean;
  CottenIndustry: boolean;
  companyID?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFireInsuranceDeductiblePayload {
  CommercialProperty: boolean;
  FillingStation: boolean;
  TimberIndustry: boolean;
  CottenIndustry: boolean;
}

export interface FireInsurancePerilBreakdown {
  peril: string;
  value: number;
  amount: number;
}

export interface FireInsuranceDiscount {
  type: string;
  supported: boolean;
  value: number;
  amount: number;
}

export interface FireInsuranceDeductible {
  applied: boolean;
  percentage: number;
  amount: number;
}

export interface FireInsuranceCalculation {
  basePremium: number;
  totalDiscountRate: number;
  discountAmount: number;
  businessType: string;
  insuredSum: number;
}

export interface FireInsuranceEntry {
  InsuranceCompany: string;
  insuranceCompanyRawID: string;
  id: string;
  fireOnly: number;
  totalFiresum: number;
  perilsBreakdown: FireInsurancePerilBreakdown[];
  discountsApplied: FireInsuranceDiscount[];
  preDeductibleTotal: number;
  deductible: FireInsuranceDeductible;
  calculation: FireInsuranceCalculation;
}

export interface Currency {
  code: string;
  name: string;
}

export interface FireInsurance {
  id: string;
  proposerName: string;
  postOffice: string;
  phone: string;
  userEmail: string;
  occupationorBusiness: string;
  situationofProperty: string;
  companyID: string | null;
  userAgentID?: string;
  userID: string | null;
  constructionBuiltWith?: string | null;
  constructionRoofedtWith?: string | null;
  totalSumtobeInsured: string;
  privatePremises: boolean;
  privateDwellingSumInsured?: string | null;
  privatebuildingValue?: string | null;
  outprivatebuildingValue?: string | null;
  currencyID: string;
  privatewallorFence?: string | null;
  privateotherValue?: string | null;
  houseGoodsSumInsured?: string | null;
  houseGoodsDescription?: string | null;
  houseGoodsValue?: string | null;
  businessbuildingValue?: string | null;
  outbusinessbuildingValue?: string | null;
  businesswallorFence?: string | null;
  businessotherValue?: string | null;
  businessRawMaterial?: string | null;
  businesSemifinishedgoods?: string | null;
  businesfinishedgoods?: string | null;
  businesonFixture?: string | null;
  businesotherProperty?: string | null;
  businessSumtobeInsured: string;
  usersufferedDamagebyFireorPeril?: string | null;
  RejectedProposals?: string | null;
  isproposedPropertyInsuredDetails?: string | null;
  commencementDate: string; // ISO format
  ExpiryDate: string; // ISO format
  paymentStatus: string;
  bussinessType: string;
  signatureofProposer: string | null;
  signatureofAgent: string | null;
  impactPeril: boolean;
  AircraftPeril: boolean;
  ExplosionPeril: boolean;
  WindStormPeril: boolean;
  BurstPipePeril: boolean;
  FloodPeril: boolean;
  EarthQuakePeril: boolean;
  RiotPeril: boolean;
  BushfirePeril: boolean;
  createdAt: string;
  updatedAt: string;
  user: User | null;
  insuranceCompany: InsuranceCompany | null;
  user_agent: Agent | null;
  Usercurrency: Currency;
  fireCalcs: FireInsuranceEntry[];
}

export interface FireInsurancePayload {
  proposerName: string;
  postOffice: string;
  phone: string;
  userEmail: string;
  occupationorBusiness: string;
  situationofProperty: string;
  companyID: string | null;
  userAgentID?: string;
  userID: string | null;
  constructionBuiltWith?: string | null;
  constructionRoofedtWith?: string | null;
  totalSumtobeInsured: number;
  privatePremises: boolean;
  privateDwellingSumInsured?: number | null;
  privatebuildingValue?: number | null;
  outprivatebuildingValue?: number | null;
  currencyID: string;
  privatewallorFence?: number | null;
  privateotherValue?: number | null;
  houseGoodsSumInsured?: number | null;
  houseGoodsDescription?: string | null;
  houseGoodsValue?: number | null;
  businessbuildingValue?: number | null;
  outbusinessbuildingValue?: number | null;
  businesswallorFence?: number | null;
  businessotherValue?: number | null;
  businessRawMaterial?: string | null;
  businesSemifinishedgoods?: string | null;
  businesfinishedgoods?: string | null;
  businesonFixture?: string | null;
  businesotherProperty?: string | null;
  businessSumtobeInsured: number;
  usersufferedDamagebyFireorPeril?: string | null;
  RejectedProposals?: string | null;
  isproposedPropertyInsuredDetails?: string | null;
  commencementDate: string; // ISO format
  ExpiryDate: string; // ISO format
  paymentStatus: string;
  bussinessType: string;
  signatureofProposer: string | null;
  signatureofAgent: string | null;
  impactPeril: boolean;
  AircraftPeril: boolean;
  ExplosionPeril: boolean;
  WindStormPeril: boolean;
  BurstPipePeril: boolean;
  FloodPeril: boolean;
  EarthQuakePeril: boolean;
  RiotPeril: boolean;
  BushfirePeril: boolean;
}

export type BundleData = {
  bundleName: BundleName;
  bundleProducts: BundleProduct[];
  commencementDate?: string;
  ExpiryDate?: string;
};

export interface BundleName {
  id: string;
  name: string;
  totalBundleCost: string;
  commencementDate?: string;
  ExpiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type BundleProduct = VehicleInsuranceProduct | FireInsuranceProduct;

interface BaseProduct {
  id: string;
  productType: string;
  valueofVehicle: string;
  companyID: string;
  bundleNameID: string;
  updatedAt: string;
  createdAt: string;
  typeofVehicle?: string | null;
  schedule: any;
}

interface VehicleInsuranceProduct extends BaseProduct {
  productType: "THIRD PARTY" | "COMPREHENSIVE";
  schedule: {
    [key: string]: any;
    name?: string;
    ecowasSticker?: string;
    premiumAmount?: string;
    thirdpartyAnnualPremimum?: string;
    addedValueForComprehensive?: string;
  };
}

interface FireInsuranceProduct extends BaseProduct {
  productType:
    | "FIRE BUSINESS Commercial Property"
    | "FIRE PRIVATE DWELLING"
    | "FIRE PRIVATE HOMEGOODS";
  totalSumtobeInsured: string;
  privatePremises: boolean;
  privateDwellingSumInsured: string;
  houseGoodsSumInsured: string;
  businessSumtobeInsured: string;
  impactPeril: boolean;
  AircraftPeril: boolean;
  ExplosionPeril: boolean;
  WindStormPeril: boolean;
  BurstPipePeril: boolean;
  FloodPeril: boolean;
  EarthQuakePeril: boolean;
  RiotPeril: boolean;
  BushfirePeril: boolean;
  schedule: FireSchedule;
}

interface FireSchedule {
  InsuranceCompany: string;
  id: string;
  fireOnly: number;
  totalFiresum: number;
  perilsBreakdown: {
    peril: string;
    value: number;
    amount: number;
  }[];
  discountsApplied: {
    type: string;
    supported: boolean;
    value: number;
    amount: number;
  }[];
  preDeductibleTotal: number;
  deductible: {
    applied: boolean;
    percentage: number;
    amount: number;
  };
  calculation: {
    basePremium: number;
    totalDiscountRate: number;
    discountAmount: number;
    businessType: string;
    insuredSum: number;
  };
}

export interface BundleCreationPayload {
  BundleName: string;
  BundleInfo: BundleProductInput[];
  bundleNameID?: string;
}

export type BundleProductInput =
  | VehicleThirdPartyInput
  | VehicleComprehensiveInput
  | FireInsuranceInput
  | GoodsInTransitInput
  | MoneyInsuranceInput
  | AssetAllRiskInput
  | FireCommercialInput;

// Reuse loyalty non-motor interfaces for bundle inputs
import type {
  AssetAllRiskCreationPayload,
  BuyFireCommercialCreationPayload,
  BuyMoneyInsuranceCreationPayload,
  GoodsInTransitCreationPayload,
} from "./non-motor/loyalty";

type GoodsInTransitInput = GoodsInTransitCreationPayload & {
  productType: "GoodsInTransit";
  totalSumtobeInsured: number;
};

type MoneyInsuranceInput = BuyMoneyInsuranceCreationPayload & {
  productType: "BuyMoneyInsurance";
  totalSumtobeInsured: number;
};

type AssetAllRiskInput = AssetAllRiskCreationPayload & {
  productType: "AssetAllRisks";
  totalSumtobeInsured: number;
};

type FireCommercialInput = BuyFireCommercialCreationPayload & {
  productType: "BuyFireCommercial";
  totalSumtobeInsured: number;
};

interface VehicleThirdPartyInput {
  id?: string;
  productType: "THIRD PARTY";
  typeofVehicle: string;
  companyID: string;
}

interface VehicleComprehensiveInput {
  id?: string;
  productType: "COMPREHENSIVE";
  typeofVehicle: string;
  valueofVehicle: number;
  companyID: string;
}

export interface FireInsuranceInput {
  id?: string;
  productType:
    | "FIRE BUSINESS Commercial Property"
    | "FIRE PRIVATE DWELLING"
    | "FIRE PRIVATE HOMEGOODS";
  totalSumtobeInsured: number;
  privatePremises: boolean;
  privateDwellingSumInsured: number;
  houseGoodsSumInsured: number;
  businessSumtobeInsured: number;
  impactPeril: boolean;
  AircraftPeril: boolean;
  ExplosionPeril: boolean;
  WindStormPeril: boolean;
  BurstPipePeril: boolean;
  FloodPeril: boolean;
  EarthQuakePeril: boolean;
  RiotPeril: boolean;
  BushfirePeril: boolean;
  companyID: string;
}

export interface PaymentSchedule {
  id: string;
  entityid: string | null;
  userID: string;
  companyID: string | null;
  accountName: string;
  accountNumber: string;
  balance: string;
  initialDeposit: string;
  currentDeposit: string;
  interestRate: string;
  totalInterestvalue: string;
  loanAmount: string;
  premiumAmount: string;
  OriginalPremium?: string;
  regularInstallment?: string;
  minimumInitialDeposit?: string;
  interestPerInstallment?: string;
  totalRepayment?: string;
  totalPaid?: string;
  loanStatus: string;
  method: string;
  methodCode: string;
  methodName: string;
  paymentFrequency: PaymentFrequency;
  quoteType: string;
  noofInstallments: number;
  duration?: number;
  lastInstallmentno: number;
  lastInstallmentvalue: string;
  lastInstallmentdate: string | null; // ISO date string
  lastEmailSentAt: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  refId: string;
  userAgentID: string | null;
  user_agent: Agent | null;
  insuranceCompany: InsuranceCompany | null;
  user: User;
  assignedBundleName?: string | null;
  declarationDoc?: UploadedFile;
  signature?: UploadedFile;
}

type UploadedFile = File | string | null;
export interface CompanyMessage {
  companyObj: InsuranceCompany;
  product: Product;
}

export type RISK_TYPE =
  | "TRAVEL"
  | "OTHERS"
  | "OIL AND GAS"
  | "MOTORS"
  | "MARINE"
  | "LIABILITY"
  | "FIRE"
  | "ENGINEERING"
  | "BOND"
  | "ACCIDENT"
  | "WORKMENS COMPENSATION"
  | "Goods In Transit"
  | "Fire Commercial"
  | "Money Insurance"
  | "Assets All Risks";

export interface Product {
  id: string;
  name: RISK_TYPE;
  code: string;
  category: string;
}

export interface SettlementAccount {
  id: string;
  companyID: string;
  method: string;
  methodName: string;
  methodCode: string;
  accountNumber: string;
  accountName: string;
  Latestamountreceived: string;
  lasttransactionNo: string | null;
  createdAt: string;
  updatedAt: string;
  insuranceCompany: InsuranceCompany;
}

export interface SettlementAccountCreationPayload {
  method: string;
  methodName: string;
  methodCode: string;
  accountNumber: string;
  accountName: string;
  companyID: string;
}

export interface CompanySearchItem {
  companyID: string;
  Product: string;
}

export interface FetchInsuranceCompanyRewardStatusPayload {
  companySearch: CompanySearchItem[];
}

export interface Reward {
  id: string;
  companyID: string;
  status: string;
  rewardType: string;
  flatRateAmount?: number;
  percentageAmount?: number;
  Product: string;
  commencementDate: string;
  ExpiryDate: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown; // Allow for additional fields from API
}

export interface RewardPayload {
  companyID: string;
  status: string;
  rewardType: string;
  flatRateAmount: number;
  percentageAmount: number;
  Product: string;
  commencementDate: string;
  ExpiryDate: string;
}

export interface UpdateRewardPayload {
  companyID: string;
  Product: string;
  status: string;
  rewardType?: string;
  flatRateAmount?: number;
  percentageAmount?: number;
  commencementDate?: string;
  ExpiryDate?: string;
}

export interface CustomerReward {
  id: string;
  companyID: string;
  userID: string;
  points: number;
  totalPoints: number;
  Product: string;
  createdAt: string;
  updatedAt: string;
}

export type NavItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  children?: Omit<NavItem, "children">[];
  external?: boolean;
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

export interface ReferralStatus {
  id: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auto Debit OTP Types
export interface ConfirmAutoDebitOTPRequest {
  uniq_ref_id: string;
  auth_code: string | number;
  pfId: string;
}

export interface ResendOTPRequest {
  pfId: string;
}

export interface PremiumFinancingScheduleRequest {
  initialDeposit: string;
  totalRepayment: string;
  totalPaid: string;
  loanAmount: string;
  noofInstallments: number;
  paymentFrequency: PaymentFrequency;
}

export type PaymentFrequency = "daily" | "weekly" | "monthly";
