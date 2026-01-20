import {
  ActiveBundleProduct,
  ActiveProduct,
  Agent,
  BundleData,
  Claim,
  ClaimedReward,
  CompanyMessage,
  ComprehensiveInsuranceCompanyResponse,
  ComprehensiveQuoteRequestData,
  CustomerReward,
  CustomerTransaction,
  FinancialAccountingEntry,
  FireInsurance,
  FireInsuranceDeductible,
  FireInsuranceDiscount,
  FireInsurancePeril,
  InsuranceCompany,
  Pagination,
  PaymentRecord,
  ReferralCode,
  Reward,
  SettlementAccount,
  ThirdPartyInsuranceCompanyResponse,
  ThirdPartyQuoteRequestData,
  TransactionJournalEntry,
  User,
} from ".";
import {
  AssetAllRisk,
  BuyFireCommercial,
  BuyMoneyInsurance,
  GoodsInTransit,
} from "./non-motor/loyalty";

export interface APIResponse<T> {
  message: T;
  metadata?: Pagination;
}
export type InsuranceCompaniesResponse = APIResponse<InsuranceCompany[]>;
export type ClaimsResponse = APIResponse<Claim[]>;
export type SingleClaimResponse = APIResponse<Claim>;
export type QuotePaymentsResponse = APIResponse<PaymentRecord[]>;
export type ActiveProductsResponse = APIResponse<ActiveProduct[]>;
export type ActiveBundleProductsResponse = APIResponse<ActiveBundleProduct[]>;
export type FinancialAccountingEntriesResponse = APIResponse<FinancialAccountingEntry[]>;
export type SingleFinancialAccountingEntryResponse =
  APIResponse<FinancialAccountingEntry>;
export type TransactionJournalEntriesResponse = APIResponse<TransactionJournalEntry[]>;
export type SingleTransactionJournalEntryResponse = APIResponse<TransactionJournalEntry>;
export type FireInsuranceResponse = APIResponse<FireInsurance[]>;
export type SingleFireInsuranceResponse = APIResponse<FireInsurance>;
export type InsuranceCompanyCustomerTransactionsResponse = APIResponse<
  CustomerTransaction[]
>;
export type ThirdPartyQuoteRequestsResponse = APIResponse<ThirdPartyQuoteRequestData[]>;
export type ThirdPartyQuoteResponsesResponse = APIResponse<
  ThirdPartyInsuranceCompanyResponse[]
>;
export type ComprehensiveQuoteResponsesResponse = APIResponse<
  ComprehensiveInsuranceCompanyResponse[]
>;
export type ComprehensiveQuoteRequestsResponse = APIResponse<
  ComprehensiveQuoteRequestData[]
>;

export type FireInsuranceDeductiblesResponse = APIResponse<FireInsuranceDeductible[]>;
export type FireInsuranceDiscountsResponse = APIResponse<FireInsuranceDiscount[]>;
export type FireInsurancePerilsResponse = APIResponse<FireInsurancePeril[]>;

// Goods in Transit Response Types
export type GoodsInTransitResponse = APIResponse<GoodsInTransit[]>;
export type SingleGoodsInTransitResponse = APIResponse<GoodsInTransit>;

// Money Insurance Response Types
export type BuyMoneyInsuranceResponse = APIResponse<BuyMoneyInsurance[]>;
export type SingleBuyMoneyInsuranceResponse = APIResponse<BuyMoneyInsurance>;

// Fire Commercial Response Types
export type BuyFireCommercialResponse = APIResponse<BuyFireCommercial[]>;
export type SingleBuyFireCommercialResponse = APIResponse<BuyFireCommercial>;

// Asset All Risk Response Types
export type AssetAllRiskResponse = APIResponse<AssetAllRisk[]>;
export type SingleAssetAllRiskResponse = APIResponse<AssetAllRisk>;

// Settlement Account Response Types
export type SettlementAccountResponse = APIResponse<SettlementAccount[]>;
export type SingleSettlementAccountResponse = APIResponse<SettlementAccount>;

export type BundleResponse = APIResponse<BundleData[]>;
export type SingleBundleResponse = APIResponse<BundleData>;

export type CompanyProductsResponse = APIResponse<CompanyMessage[]>;
export type SingleCompanyProductResponse = APIResponse<CompanyMessage>;

// Rewards Response Types
export type RewardsResponse = APIResponse<Reward[]>;
export type SingleRewardResponse = APIResponse<Reward>;
export type InsuranceCompanyRewardStatusResponse = APIResponse<Reward[]>;

// Customer Rewards Response Types
export type CustomerRewardsResponse = APIResponse<CustomerReward[]>;
export type SingleCustomerRewardResponse = APIResponse<CustomerReward>;

// Referral Response Types
export type GenerateReferralCodeResponse = APIResponse<ReferralCode>;
export type ClaimedRewardsResponse = APIResponse<ClaimedReward[]>;
export type SingleReferralCodeResponse = APIResponse<ReferralCode>;
export type AgentsResponse = APIResponse<Agent[]>;
export type CustomersResponse = APIResponse<User[]>;

export type LoyaltyPolicyInfoResponse = APIResponse<{
  model: Record<string, unknown>;
  loyaltyPolicy: LoyaltyPolicy;
}>;

export type LoyaltyPolicy = {
  id: string;
  policyID: number;
  policyType: string;
  quoteType: string;
  updatedAt: string;
  createdAt: string;
};

export interface PublicGhanaCardVerificationResponse {
  id: string;
  surname: string;
  forenames: string;
  verified: boolean;
  cardValidTo: string;
  cardValidFrom: string;
  userID: string | null;
  userEmail: string;
  pinNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface MainUserGhanaCardVerificationResponse {
  id: string;
  userEmail: string;
  phone: string;
  verified: boolean;
  center: string;
  pinNumber: string;
  ghCardResponse: string;
  success: boolean;
  code: string;
  msg: string;
}

export type PaymentScheduleDetailsResponse = APIResponse<PaymentScheduleDetails>;

export interface PaymentScheduleItem {
  installmentNumber: number;
  paymentAmount: string;
  amountPaid: string;
  dueDate: string;
  remainingBalance: string;
  status: "overdue" | "pending" | "paid";
  daysOverdue: number;
}

export interface PaymentScheduleSummary {
  totalInstallments: number;
  paidInstallments: number;
  pendingInstallments: number;
  overdueInstallments: number;
}

export interface PaymentScheduleDetails {
  loanId: string;
  initialDeposit: string;
  totalRepayment: string;
  regularInstallment: string;
  loanAmount: string;
  totalPaid: string;
  paymentFrequency: string;
  startDate: string;
  schedule: PaymentScheduleItem[];
  summary: PaymentScheduleSummary;
}
