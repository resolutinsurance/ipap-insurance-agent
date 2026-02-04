import { Suspense } from "react";
import PaymentDirect from "./components/pay-page";

const PaymentDirectPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentDirect />
    </Suspense>
  );
};

export default PaymentDirectPage;
