import PageLoader from "@/components/ui/page-loader";
import { Suspense } from "react";
import AgentRemotePremiumFinancing from "./components/remote-page";

const AgentRemoteFinancingPage = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <AgentRemotePremiumFinancing />
    </Suspense>
  );
};

export default AgentRemoteFinancingPage;
