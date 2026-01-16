import { InsuranceCompanyRiskType, RiskType } from "@/lib/interfaces";

/**
 * Transforms an InsuranceCompanyRiskType object into a RiskType object
 * @param insuranceCompanyRiskType The InsuranceCompanyRiskType object to transform
 * @returns A RiskType object
 */
export const transformInsuranceCompanyRiskTypeToRiskType = (
  insuranceCompanyRiskType: InsuranceCompanyRiskType
): RiskType => {
  return {
    id: insuranceCompanyRiskType.id,
    name: insuranceCompanyRiskType.riskType.name,
    code: insuranceCompanyRiskType.riskType.code,
    risk_category: insuranceCompanyRiskType.riskType.risk_category,
    inputter: insuranceCompanyRiskType.riskType.inputter,
    riskTypeId: insuranceCompanyRiskType.riskTypeId,
    createdAt: insuranceCompanyRiskType.createdAt,
    updatedAt: insuranceCompanyRiskType.updatedAt,
  };
};

/**
 * Transforms an array of InsuranceCompanyRiskType objects into RiskType objects
 * @param insuranceCompanyRiskTypes Array of InsuranceCompanyRiskType objects to transform
 * @returns Array of RiskType objects
 */
export const transformInsuranceCompanyRiskTypesToRiskTypes = (
  insuranceCompanyRiskTypes: InsuranceCompanyRiskType[]
): RiskType[] => {
  return insuranceCompanyRiskTypes.map(transformInsuranceCompanyRiskTypeToRiskType);
};
