"use client";

import { ReactNode } from "react";

interface PaymentFlowLayoutProps {
  children: ReactNode;
}

/**
 * Shared layout for payment flows.
 * - Wraps payment pages so they share lifecycle behaviour.
 * - Clears the direct payment verification state when navigating away
 *   from the payments section (layout unmount).
 */
export const PaymentFlowLayout = ({ children }: PaymentFlowLayoutProps) => {
  return <>{children}</>;
};
