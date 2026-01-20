import { PaymentFlowLayout } from "@/components/dashboard/payment/payment-flow-layout";
import type { ReactNode } from "react";

interface PurchasesLayoutProps {
  children: ReactNode;
}

const PurchasesLayout = ({ children }: PurchasesLayoutProps) => {
  return <PaymentFlowLayout>{children}</PaymentFlowLayout>;
};

export default PurchasesLayout;
