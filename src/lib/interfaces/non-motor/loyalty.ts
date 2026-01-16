export interface GoodsInTransit {
  id?: string;
  companyID: string;
  userAgentID: string;
  userID: string;
  net_premium: string;
  sum_insured: number;
  class: number;
  product_id: number;
  policy_start: string;
  user_type: string;
  customer_name: string;
  prefcontact: string;
  prefemail: string;
  risk_desc_goods: string;
  list_array: {
    item: string;
    value: number;
  }[];
  user_category: number;
  customer_org_id: number;
  rm_id: string | null;
  customer_id: string | null;
  isUSSD: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  debitNoteNumber: string | null;
  declaration: boolean;
  paymentStatus: string;
  policyId: string | null;
  policyNumber: string | null;
  policyURL: string | null;
}

export type GoodsInTransitCreationPayload = Partial<GoodsInTransit>;

export interface BuyMoneyInsurance {
  id: string;
  companyID: string;
  userAgentID: string;
  userID: string;
  net_premium: string;
  sum_insured: number;
  class: number;
  product_id: number;
  policy_start: string;
  user_type: string;
  customer_name: string;
  prefcontact: string;
  prefemail: string;
  bank_branch: string;
  customer_id: string | null;
  user_category: number;
  customer_org_id: number;
  rm_id: string | null;
  isUSSD: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  debitNoteNumber: string | null;
  declaration: boolean;
  paymentStatus: string;
  policyId: string | null;
  policyNumber: string | null;
  policyURL: string | null;
}

export type BuyMoneyInsuranceCreationPayload = Partial<BuyMoneyInsurance>;

export interface BuyFireCommercial {
  id: string;
  companyID: string;
  userAgentID: string;
  userID: string;
  net_premium: string;
  sum_insured: number;
  class: number;
  product_id: number;
  policy_start: string;
  user_type: string;
  customer_name: string;
  prefcontact: string;
  prefemail: string;
  risk_description: string;
  branch_region: string;
  branch_city: string;
  location: string;
  customer_id: string | null;
  user_category: number;
  customer_org_id: number;
  rm_id: string | null;
  isUSSD: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  debitNoteNumber: string | null;
  declaration: boolean;
  paymentStatus: string;
  policyId: string | null;
  policyNumber: string | null;
  policyURL: string | null;
}

export type BuyFireCommercialCreationPayload = Partial<BuyFireCommercial>;

export interface AssetAllRisk {
  id: string;
  companyID: string;
  userAgentID: string;
  userID: string;
  net_premium: string;
  sum_insured: number;
  class: number;
  product_id: number;
  policy_start: string;
  user_type: string;
  customer_name: string;
  prefcontact: string;
  prefemail: string;
  risk_description: string;
  branch_region: string;
  branch_city: string;
  location: string;
  section_id: number;
  customer_id: string | null;
  user_category: number;
  customer_org_id: number;
  rm_id: string | null;
  isUSSD: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  debitNoteNumber: string | null;
  declaration: boolean;
  paymentStatus: string;
  policyId: string | null;
  policyNumber: string | null;
  policyURL: string | null;
}

export type AssetAllRiskCreationPayload = Partial<AssetAllRisk>;

export type NonMotorQuoteType =
  | "buy-money-insurance"
  | "fire-insurance"
  | "asset-all-risk"
  | "goods-in-transit";

// Union type for all possible quote data
export type LoyaltyNonMotorQuoteData =
  | BuyMoneyInsurance
  | BuyFireCommercial
  | AssetAllRisk
  | GoodsInTransit;
