import { Suspense } from "react";
import AgentRemotePremiumFinancing from "./components/remote-page";

const AgentRemoteFinancingPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AgentRemotePremiumFinancing />
    </Suspense>
  );
};

export default AgentRemoteFinancingPage;
