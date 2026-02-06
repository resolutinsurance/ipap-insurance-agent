import useAnalytics, { generateEventID } from "@/hooks/use-analytics";
import {
  COOKIE_KEYS,
  COOKIE_OPTIONS,
  LOCAL_STORAGE_KEYS,
  ROUTES,
  USER_TYPES,
  UserType,
} from "@/lib/constants";
import { EventAction, EventName, SessionEventType } from "@/lib/constants/session";
import { User } from "@/lib/interfaces";
import type { SessionEventMetadata } from "@/lib/interfaces/analytics-sessions";
import {
  changePassword,
  decryptUser,
  getUser,
  loginUser,
  logout,
  requestPasswordReset,
  resendOTP,
  updateUser,
  verifyPasswordResetCode,
} from "@/lib/services/auth";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  saveToLocalStorage,
} from "@/lib/storage";
import { userAtom } from "@/lib/store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import Cookies from "js-cookie";
import { toast } from "sonner";

export const useAuth = () => {
  const [user, setUser] = useAtom(userAtom);

  // Get user type from cookies for analytics
  const userTypeCookie = Cookies.get(COOKIE_KEYS.userType);
  const userType = userTypeCookie ? (userTypeCookie as UserType) : null;
  const { createLog } = useAnalytics(user, userType);

  const logAuthEvent = async (params: {
    name: EventName;
    action: EventAction;
    description: string;
    metadata?: SessionEventMetadata;
  }) => {
    try {
      if (typeof window === "undefined") return;

      await createLog({
        eventID: generateEventID(params.name),
        eventType: SessionEventType.CUSTOM_EVENT,
        eventAction: params.action,
        description: params.description,
        path: window.location.pathname,
        created_at: new Date().toISOString(),
        metadata: params.metadata ?? {},
      });
    } catch {
      // Swallow analytics errors so they never break the app
    }
  };

  const login = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (!data.user) {
        throw new Error("Invalid response from server");
      }
      const userData = data.user;
      Cookies.set(COOKIE_KEYS.user, JSON.stringify(userData), COOKIE_OPTIONS);

      if (data.refreshToken) {
        Cookies.set(COOKIE_KEYS.refreshToken, data.refreshToken, COOKIE_OPTIONS);
      }

      if (data.accessToken) {
        Cookies.set(COOKIE_KEYS.accessToken, data.accessToken, COOKIE_OPTIONS);
      }

      if (data.role) {
        Cookies.set(COOKIE_KEYS.userType, data.role.role, COOKIE_OPTIONS);
      }

      if (data.agentData) {
        Cookies.set(COOKIE_KEYS.agent, JSON.stringify(data.agentData), COOKIE_OPTIONS);
      }

      if (data.purchases) {
        saveToLocalStorage(LOCAL_STORAGE_KEYS.purchases, JSON.stringify(data.purchases));
      }
      if (data.quotes) {
        saveToLocalStorage(LOCAL_STORAGE_KEYS.quotes, JSON.stringify(data.quotes));
      }
      setUser(userData);

      void logAuthEvent({
        name: EventName.LOGIN_SUCCESS,
        action: EventAction.LOGIN_SUCCESS,
        description: "User logged in successfully",
        metadata: {
          userId: userData.id,
          role: data.role?.role ?? null,
          hasInsuranceCompany: !!data.InsuranceCompany,
        },
      });

      // This app is agent-only. If userType is not agent, logout
      if (data.role) {
        const role = data.role.role.toLowerCase();
        if (role !== USER_TYPES.AGENT.toLowerCase()) {
          toast.error("You are not an agent");
          // Not an agent, logout
          logout(() => setUser(null));
          return;
        }

        // Check if agent has companyId
        if (data.agentData) {
          const agentData =
            typeof data.agentData === "string"
              ? JSON.parse(data.agentData)
              : data.agentData;

          if (!agentData.companyID) {
            toast.error("You are not an agent with a company");
            // Agent without companyId, logout
            logout(() => setUser(null));
            return;
          }
        } else {
          toast.error("You are not an agent");
          // No agent data, logout
          logout(() => setUser(null));
          return;
        }

        // Check if user has verified Ghana card
        const isGhanaVerified =
          userData.GhcardNo != null &&
          userData.GhcardNo !== "" &&
          userData.verified === true;

        // Redirect based on verification status
        if (!isGhanaVerified) {
          // Not verified, redirect to verify-id
          window.location.href = ROUTES.VERIFY_ID;
        } else {
          // Verified, redirect to dashboard
          window.location.href = ROUTES.AGENT.FIND_POLICY;
        }
      } else {
        // No role, logout
        logout(() => setUser(null));
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
      void logAuthEvent({
        name: EventName.LOGIN_FAILURE,
        action: EventAction.LOGIN_FAILURE,
        description: "User login failed",
        metadata: {
          errorMessage: error instanceof Error ? error.message : String(error),
        },
      });
      Cookies.remove(COOKIE_KEYS.user);
      Cookies.remove(COOKIE_KEYS.accessToken);
      Cookies.remove(COOKIE_KEYS.userType);
      Cookies.remove(COOKIE_KEYS.agent);
      removeFromLocalStorage(LOCAL_STORAGE_KEYS.purchases);
      removeFromLocalStorage(LOCAL_STORAGE_KEYS.quotes);
      setUser(null);
    },
  });

  const decryptUserRefLink = useMutation({
    mutationFn: ({ ref, companyID }: { ref: string; companyID: string }) =>
      decryptUser({ ref, companyID }),
    onSuccess: (data) => {
      Cookies.set(COOKIE_KEYS.emailRef, JSON.stringify(data), COOKIE_OPTIONS);
    },
    onError: (error) => {
      console.error("Decrypt user error:", error);
    },
  });

  // Resend OTP mutation
  const resendVerificationOTP = useMutation({
    mutationFn: resendOTP,
    onError: (error) => {
      console.error("OTP resend error:", error);
    },
  });

  // Update user mutation
  const updateUserProfile = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<User> }) =>
      updateUser(userId, data),
    onSuccess: (data) => {
      const userData = data as unknown as User;
      setUser(userData as User);

      // Update the user cookie with the new data
      Cookies.set(COOKIE_KEYS.user, JSON.stringify(userData), COOKIE_OPTIONS);
    },
    onError: (error) => {
      console.error("Update user error:", error);
    },
  });

  const getUserProfile = useMutation({
    mutationFn: getUser,
    onSuccess: (data) => {
      setUser(data);
      Cookies.set(COOKIE_KEYS.user, JSON.stringify(data), COOKIE_OPTIONS);
    },
    onError: (error) => {
      console.error("Get user error:", error);
    },
  });

  const logoutUser = () => {
    void logAuthEvent({
      name: EventName.USER_LOGOUT,
      action: EventAction.USER_LOGOUT,
      description: "User logged out",
    });
    logout(() => setUser(null));
  };

  const isAuthenticated = !!user;

  const getCurrentUser = (): User | null => {
    if (user) return user;

    const userLocalStorage = getFromLocalStorage(COOKIE_KEYS.user);
    if (userLocalStorage) {
      setUser(userLocalStorage);
      return userLocalStorage;
    }

    const userCookie = Cookies.get(COOKIE_KEYS.user);
    if (!userCookie) return null;

    try {
      const userData = JSON.parse(userCookie);
      setUser(userData);
      saveToLocalStorage(COOKIE_KEYS.user, userData);
      return userData;
    } catch (error) {
      console.error("Failed to parse user cookie:", error);
      Cookies.remove(COOKIE_KEYS.user);
      Cookies.remove(COOKIE_KEYS.accessToken);
      removeFromLocalStorage(COOKIE_KEYS.user);
      removeFromLocalStorage(COOKIE_KEYS.accessToken);
      return null;
    }
  };

  // Get user type from cookies
  const getUserType = (): UserType | null => {
    const userTypeCookie = Cookies.get(COOKIE_KEYS.userType);
    if (userTypeCookie) {
      return userTypeCookie as UserType;
    }
    return null;
  };

  const getUserTypeUnmasked = (): string | null => {
    const type = getUserType();
    if (type === USER_TYPES.AGENT) {
      return "Agent";
    }
    return null;
  };

  const changeUserPassword = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      void logAuthEvent({
        name: EventName.PASSWORD_CHANGE,
        action: EventAction.PASSWORD_CHANGE,
        description: "User changed password successfully",
      });
    },
    onError: (error) => {
      console.error("Password change error:", error);
    },
  });

  const requestPasswordResetCode = useMutation({
    mutationFn: requestPasswordReset,
    onError: (error) => {
      console.error("Password reset verification error:", error);
      void logAuthEvent({
        name: EventName.RESET_PASSWORD_FAIL,
        action: EventAction.RESET_PASSWORD_FAIL,
        description: "Password reset request failed",
        metadata: {
          errorMessage: error instanceof Error ? error.message : String(error),
        },
      });
    },
  });

  const verifyPasswordResetCodeMutation = useMutation({
    mutationFn: verifyPasswordResetCode,
    onSuccess: () => {
      void logAuthEvent({
        name: EventName.RESET_PASSWORD_START,
        action: EventAction.RESET_PASSWORD_START,
        description: "User verified password reset code",
      });
    },
    onError: (error) => {
      console.error("Password reset verification error:", error);
      void logAuthEvent({
        name: EventName.RESET_PASSWORD_FAIL,
        action: EventAction.RESET_PASSWORD_FAIL,
        description: "Password reset code verification failed",
        metadata: {
          errorMessage: error instanceof Error ? error.message : String(error),
        },
      });
    },
  });

  return {
    user: user || getCurrentUser(),
    userType: getUserType(),
    userTypeUnmasked: getUserTypeUnmasked(),
    isAuthenticated,
    login,
    decryptUserRefLink,
    resendVerificationOTP,
    updateUserProfile,
    getUserProfile,
    logoutUser,
    getUserType,
    changeUserPassword,
    requestPasswordResetCode,
    verifyPasswordResetCodeMutation,
  };
};

export const useUserById = (id: string) => {
  const userQuery = useQuery({
    queryKey: ["get-user-by-id", id],
    queryFn: () => getUser(id),
    enabled: !!id,
  });

  return {
    getUserById: userQuery,
  };
};
