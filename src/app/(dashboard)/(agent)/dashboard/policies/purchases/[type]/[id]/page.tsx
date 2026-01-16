"use client";
import AgentPaymentPage from "@/components/dashboard/payment/agent-payment-page";
import { useAgent } from "@/hooks/use-agent";
import { useAuth } from "@/hooks/use-auth";
import { USER_TYPES } from "@/lib/constants";
import { useParams } from "next/navigation";

const Page = () => {
  const { id } = useParams();
  const entityId = id?.toString().trim() || "";

  const { userType } = useAuth();
  const { isCompanyCreatedAgent } = useAgent();

  if (userType === USER_TYPES.AGENT && isCompanyCreatedAgent) {
    return <AgentPaymentPage id={entityId} />;
  }
};

export default Page;
