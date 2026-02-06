import PageLoader from "@/components/ui/page-loader";
import { Suspense } from "react";
import PaymentDirect from "./components/pay-page";

const PaymentDirectPage = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <PaymentDirect />
    </Suspense>
  );
};

export default PaymentDirectPage;
