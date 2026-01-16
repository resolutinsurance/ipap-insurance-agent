import { COOKIE_KEYS } from "@/lib/constants";
import { User } from "@/lib/interfaces";
import { atom } from "jotai";
import Cookies from "js-cookie";

// Helper function to get initial user from cookies
const getInitialUser = (): User | null => {
  const userCookie = Cookies.get(COOKIE_KEYS.user);
  if (!userCookie) return null;

  try {
    return JSON.parse(userCookie);
  } catch (error) {
    console.error("Failed to parse user cookie:", error);
    return null;
  }
};

// Authentication atoms
export const userAtom = atom<User | null>(getInitialUser());
export const isAuthenticatedAtom = atom((get) => !!get(userAtom));
export const authLoadingAtom = atom(false);
export const sidebarCollapsedAtom = atom(false);

// Re-export payment verification atoms and utilities
export {
  bundlePaymentVerificationAtom,
  customerSelfVerificationAtom,
  directPaymentVerificationAtom,
  getDefaultPaymentVerificationState,
  loyaltyPaymentVerificationAtom,
  paymentVerificationAtom,
} from "./payment-verification";
