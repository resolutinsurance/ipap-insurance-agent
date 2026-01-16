import ComingSoon from "@/components/coming-soon";
import { useAgent } from "@/hooks/use-agent";
import { COMPANIES } from "@/lib/constants";
import { LoyaltyFetchPolicyDetails } from "./loyalty-fetch-policy-details";

const FindCustomerPolicyDetailsForCompany = () => {
  const { agent } = useAgent();

  if (agent?.companyID && agent?.companyID === COMPANIES.LOYALTY) {
    return <LoyaltyFetchPolicyDetails />;
  }
  return (
    <div>
      <ComingSoon />
    </div>
  );
};

export default FindCustomerPolicyDetailsForCompany;
