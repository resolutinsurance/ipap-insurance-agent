"use client";
import useAnalytics, { generateEventID } from "@/hooks/use-analytics";
import { useAuth } from "@/hooks/use-auth";
import useIP from "@/hooks/use-ip";
import { COOKIE_KEYS, COOKIE_OPTIONS, ROUTES } from "@/lib/constants";
import { EventAction, EventName, SessionEventType } from "@/lib/constants/session";
import type { CreateSessionPayload, Session } from "@/lib/interfaces/analytics-sessions";
import { UseIPResponse } from "@/lib/interfaces/analytics-sessions";
import { createSession, getSession, updateSession } from "@/lib/services/sessions";
import { randomUUID } from "@/lib/utils/generate-id";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useMemo, useRef } from "react";
import { UAParser } from "ua-parser-js";

export default function AnalyticsLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const pathname = usePathname();
  const { user, userType } = useAuth();
  const { createLog } = useAnalytics(user, userType);
  const { fetchLocation, ipResponse } = useIP();
  const sessionIdRef = useRef<string | null>(null);
  const previousUserIDRef = useRef<string | null>(null);

  // Get userID from auth, null if not authenticated
  const userID = user?.id ?? null;

  const parser = useMemo(() => new UAParser(), []);

  // Serialize UAParser results to plain objects for API compatibility
  const browserInfo = useMemo(() => {
    const browser = parser.getBrowser();
    return browser ? { name: browser.name, version: browser.version } : null;
  }, [parser]);

  const osInfo = useMemo(() => {
    const os = parser.getOS();
    return os ? { name: os.name, version: os.version } : null;
  }, [parser]);

  const getIpMeta = (): CreateSessionPayload["ipMeta"] => {
    const location = localStorage.getItem(COOKIE_KEYS.userLocation);
    const locationData: UseIPResponse | null = location
      ? JSON.parse(location)
      : ipResponse;

    return {
      ip: locationData?.ip ?? null,
      country: locationData?.country_name ?? locationData?.country ?? null,
      country_code: locationData?.country_code ?? null,
      region: locationData?.region ?? null,
      city: locationData?.city ?? null,
      timezone: locationData?.timezone ?? null,
    };
  };

  const getDeviceInfo = (): CreateSessionPayload["device"] => {
    return {
      os: osInfo?.name ?? null,
      os_version: osInfo?.version ?? null,
      browser: browserInfo?.name ?? null,
      browser_version: browserInfo?.version ?? null,
    };
  };

  const createOrGetSession = async (sessionID: string): Promise<void> => {
    if (!sessionID) return;

    try {
      const deviceInfo = getDeviceInfo();
      const ipMeta = getIpMeta();

      // Check if we have the backend session ID stored in cookie
      const storedBackendSessionId = Cookies.get(COOKIE_KEYS.userSession);

      let session: Session | null = null;

      // If we have a stored backend session ID, try to get the session
      if (storedBackendSessionId) {
        try {
          session = await getSession(storedBackendSessionId);
          sessionIdRef.current = session.id;
        } catch {
          // Session doesn't exist (404), clear stored ID
          Cookies.remove(COOKIE_KEYS.userSession);
          session = null;
        }
      }

      // If no session exists, create a new one
      if (!session) {
        const sessionPayload: CreateSessionPayload = {
          sessionID,
          userID,
          created_at: new Date().toISOString(),
          device: deviceInfo,
          ipMeta,
        };

        session = await createSession(sessionPayload);
        sessionIdRef.current = session.id;

        // Store the backend session ID for future use
        Cookies.set(COOKIE_KEYS.userSession, session.id, COOKIE_OPTIONS);
      } else {
        // Session exists, update if userID has changed (user logged in)
        if (userID && session.userID !== userID) {
          try {
            await updateSession(session.id, { userID });
            if (process.env.NODE_ENV === "development") {
              console.log(`Session updated with userID: ${userID}`);
            }
          } catch (error) {
            console.error("Error updating session with userID:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error creating or getting session:", error);
    }
  };

  const logPageVisit = async (): Promise<void> => {
    const url =
      typeof window !== "undefined" ? `${window.location.origin}${pathname}` : pathname;

    if (pathname === ROUTES.PUBLIC.HOME) {
      // Log page visit event
      await createLog({
        eventID: generateEventID(EventName.PAGE_VISIT),
        eventType: SessionEventType.PAGE_VISIT,
        eventAction: EventAction.VISIT_LANDING_PAGE,
        description: "User visited the landing page",
        path: pathname,
        created_at: new Date().toISOString(),
        metadata: {
          pathname,
          url,
          time: new Date().toISOString(),
        },
      });

      // Log landing page specific event
      await createLog({
        eventID: generateEventID(EventName.VISIT_LANDING_PAGE),
        eventType: SessionEventType.PAGE_VIEW,
        eventAction: EventAction.VIEW_HOME_PAGE,
        description: "User viewed the home page",
        path: pathname,
        created_at: new Date().toISOString(),
        metadata: {
          pathname,
          url,
          time: new Date().toISOString(),
        },
      });
    } else {
      await createLog({
        eventID: generateEventID(EventName.PAGE_VIEW),
        eventType: SessionEventType.PAGE_VIEW,
        eventAction: EventAction.VIEW_PAGE,
        description: `User viewed ${pathname}`,
        path: pathname,
        created_at: new Date().toISOString(),
        metadata: {
          pathname,
          url,
          time: new Date().toISOString(),
        },
      });
    }
  };

  const setUserSession = (): void => {
    if (!Cookies.get(COOKIE_KEYS.userSession)) {
      Cookies.set(COOKIE_KEYS.userSession, randomUUID({ length: 32 }), {
        sameSite: "strict",
        secure: true,
      });
    }
  };

  const setLocationData = async (): Promise<void> => {
    if (!localStorage.getItem(COOKIE_KEYS.userLocation)) {
      try {
        await fetchLocation();
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    }
  };

  const logData = async (): Promise<void> => {
    setUserSession();
    await setLocationData();
    const sessionID = Cookies.get(COOKIE_KEYS.userSession) || "";
    await createOrGetSession(sessionID);
    await logPageVisit();
  };

  // Update session when userID changes (user logs in)
  useEffect(() => {
    const updateSessionOnLogin = async () => {
      // Check if userID changed from null to a value (user logged in)
      if (userID && previousUserIDRef.current === null && sessionIdRef.current) {
        try {
          await updateSession(sessionIdRef.current, { userID });
          if (process.env.NODE_ENV === "development") {
            console.log(`Session updated with userID after login: ${userID}`);
          }
        } catch (error) {
          console.error("Error updating session after login:", error);
        }
      }
      previousUserIDRef.current = userID;
    };

    void updateSessionOnLogin();
  }, [userID]);

  useEffect(() => {
    void logData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, userID]);

  // Track app/tab close events at the layout (app) level
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleBeforeUnload = () => {
      // Log app close event (may not always complete before unload)
      void createLog({
        eventID: generateEventID(EventName.APP_CLOSE),
        eventType: SessionEventType.CUSTOM_EVENT,
        eventAction: EventAction.APP_CLOSE,
        description: "User closed app or browser tab",
        path: pathname,
        created_at: new Date().toISOString(),
        metadata: {
          pathname,
          userID,
          time: new Date().toISOString(),
        },
      });
    };

    const handleVisibilityChange = async () => {
      if (document.visibilityState === "hidden") {
        await createLog({
          eventID: generateEventID(EventName.APP_CLOSE),
          eventType: SessionEventType.CUSTOM_EVENT,
          eventAction: EventAction.TAB_CLOSE,
          description: "User closed tab or switched away",
          path: pathname,
          created_at: new Date().toISOString(),
          metadata: {
            pathname,
            userID,
            time: new Date().toISOString(),
          },
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname, userID, createLog]);

  return <div className="overflow-x-clip">{children}</div>;
}
