import { z } from "zod";
import { PAYMENT_METHODS } from "../constants";

export const settlementAccountSchema = z.object({
  method: z.enum(
    [PAYMENT_METHODS.MOBILE_MONEY, PAYMENT_METHODS.BANK_TRANSFER, PAYMENT_METHODS.CARD],
    {
      required_error: "Method is required",
    }
  ),
  methodName: z.string().min(1, "Method name is required"),
  methodCode: z.string().min(1, "Method code is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  accountName: z.string().min(1, "Account name is required"),
});

export type SettlementAccountFormData = z.infer<typeof settlementAccountSchema>;

export const goodsInTransitItemSchema = z.object({
  item: z.string().min(1, "Item name is required"),
  value: z.number().min(1, "Item value must be greater than 0"),
});

export const goodsInTransitFormSchema = z.object({
  sum_insured: z.number().min(1, "Sum insured is required"),
  class: z.number().min(1, "Class is required"),
  product_id: z.number().min(1, "Product ID is required"),
  policy_start: z.string().min(1, "Policy start date is required"),
  user_type: z.string().min(1, "User type is required"),
  risk_desc_goods: z.string().min(1, "Risk description is required"),
  list_array: z.array(goodsInTransitItemSchema).min(1, "At least one item is required"),
  user_category: z.number().min(1, "User category is required"),
  customer_org_id: z.number().min(1, "Customer organization ID is required"),
});

export type GoodsInTransitFormData = z.infer<typeof goodsInTransitFormSchema>;
export type GoodsInTransitItemData = z.infer<typeof goodsInTransitItemSchema>;

export const buyMoneyInsuranceFormSchema = z.object({
  companyID: z.string().min(1, "Company ID is required"),
  userAgentID: z.string().min(1, "User Agent ID is required"),
  userID: z.string().min(1, "User ID is required"),
  sum_insured: z.number().min(1, "Sum insured is required"),
  class: z.number().min(1, "Class is required"),
  product_id: z.number().min(1, "Product ID is required"),
  policy_start: z.string().min(1, "Policy start date is required"),
  user_type: z.string().min(1, "User type is required"),
  bank_branch: z.string().min(1, "Bank branch is required"),
  user_category: z.number().min(1, "User category is required"),
  customer_org_id: z.number().min(1, "Customer organization ID is required"),
});

export type BuyMoneyInsuranceFormData = z.infer<typeof buyMoneyInsuranceFormSchema>;

export const assetAllRiskFormSchema = z.object({
  companyID: z.string().min(1, "Company ID is required"),
  userAgentID: z.string().min(1, "User Agent ID is required"),
  userID: z.string().min(1, "User ID is required"),
  sum_insured: z.number().min(0, "Sum insured must be 0 or greater"),
  class: z.number().min(1, "Class is required"),
  product_id: z.number().min(1, "Product ID is required"),
  policy_start: z.string().min(1, "Policy start date is required"),
  user_type: z.string().min(1, "User type is required"),
  risk_description: z.string().min(1, "Risk description is required"),
  branch_region: z.string().min(1, "Branch region is required"),
  branch_city: z.string().min(1, "Branch city is required"),
  location: z.string().min(1, "Location is required"),
  user_category: z.number().min(1, "User category is required"),
  section_id: z.number().min(1, "Section ID is required"),
  customer_org_id: z.number().min(1, "Customer organization ID is required"),
});

export type AssetAllRiskFormData = z.infer<typeof assetAllRiskFormSchema>;

export const buyFireCommercialFormSchema = z.object({
  companyID: z.string().min(1, "Company ID is required"),
  userAgentID: z.string().min(1, "User Agent ID is required"),
  userID: z.string().min(1, "User ID is required"),
  sum_insured: z.number().min(1, "Sum insured is required"),
  class: z.number().min(1, "Class is required"),
  product_id: z.number().min(1, "Product ID is required"),
  policy_start: z.string().min(1, "Policy start date is required"),
  user_type: z.string().min(1, "User type is required"),
  risk_description: z.string().min(1, "Risk description is required"),
  branch_region: z.string().min(1, "Branch region is required"),
  branch_city: z.string().min(1, "Branch city is required"),
  location: z.string().min(1, "Location is required"),
  user_category: z.number().min(1, "User category is required"),
  customer_org_id: z.number().min(1, "Customer organization ID is required"),
});

export type BuyFireCommercialFormData = z.infer<typeof buyFireCommercialFormSchema>;
