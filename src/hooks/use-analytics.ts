"use client";

import { COOKIE_KEYS, USER_TYPES, type UserType } from "@/lib/constants";
import type { User } from "@/lib/interfaces";
import type { CreateSessionEventPayload } from "@/lib/interfaces/analytics-sessions";
import { createSessionEvent } from "@/lib/services/sessions";
import { randomUUID } from "@/lib/utils/generate-id";
import Cookies from "js-cookie";

type OmitSessionAndUserID<T> = Omit<T, "sessionID" | "userID">;

interface UseAnalytics {
  createLog: (
    payload: OmitSessionAndUserID<CreateSessionEventPayload>,
    logForOnlyCustomer?: boolean
  ) => Promise<void>;
}

function generateEventID(eventName: string): string {
  // Generate a unique ID with the event name as prefix
  const id = randomUUID({ length: 8 });
  return `evt_${eventName}_${id}`;
}

export default function useAnalytics(
  user?: User | null,
  userType?: UserType | null
): UseAnalytics {
  // Helper function to check if we should log events (only for customers)
  const shouldLogEvent = (): boolean => {
    return !!user && userType === USER_TYPES.CUSTOMER;
  };

  async function createLog(
    payload: OmitSessionAndUserID<CreateSessionEventPayload>,
    logForOnlyCustomer?: boolean
  ): Promise<void> {
    // If logForOnlyCustomer is true, only create log if user is a customer
    if (logForOnlyCustomer && !shouldLogEvent()) {
      return;
    }

    try {
      if (typeof window === "undefined") return;

      const sessionID = Cookies.get(COOKIE_KEYS.userSession) ?? "";

      if (!sessionID) {
        if (process.env.NODE_ENV === "development") {
          console.warn("No session ID found, skipping event log");
        }
        return;
      }

      // Get userID from passed user, null if not authenticated
      const userID = user?.id ?? null;

      const fullPayload: CreateSessionEventPayload = {
        ...payload,
        sessionID,
        userID,
      };

      await createSessionEvent(fullPayload);

      if (process.env.NODE_ENV === "development") {
        console.log(
          `🪵 SessionEvent created with payload ${JSON.stringify(fullPayload)}`
        );
      }
    } catch (error) {
      // Only log errors in development mode - silent failure in production
      if (process.env.NODE_ENV === "development") {
        console.error("An error occurred while logging analytics event", error);
      }
    }
  }

  return { createLog };
}

// Export helper function for generating event IDs
export { generateEventID };
