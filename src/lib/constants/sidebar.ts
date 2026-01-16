import {
  FileTextIcon,
  HelpCircleIcon,
  HomeIcon,
  SearchIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { ROUTES, USER_TYPES, UserType } from ".";
import { NavSection } from "../interfaces";

export const SIDEBAR_ROUTE_TITLES: Record<string, string> = {
  [ROUTES.AGENT.HOME]: "Dashboard",
  [ROUTES.AGENT.PROFILE.USER]: "User Profile",
  [ROUTES.AGENT.PROFILE.SUPPORT]: "Support",
  [ROUTES.AGENT.PROFILE.TERMS]: "Terms and Conditions",
  [ROUTES.AGENT.PROFILE.PRIVACY]: "Privacy Policy",
  [ROUTES.AGENT.FIND_POLICY]: "Find Policy",
  [ROUTES.AGENT.CUSTOMERS]: "Agent Customers",
  [ROUTES.AGENT.POLICY.INDEX]: "My Policies",
  [ROUTES.AGENT.POLICY.PURCHASED]: "My Purchased Policies",
  [ROUTES.AGENT.FINANCIAL_LOGS]: "Financial Logs",
};

export const USER_TYPE_TO_NAVIGATION_MAP: Record<UserType, NavSection[]> = {
  [USER_TYPES.CUSTOMER]: [],
  [USER_TYPES.INSURANCE_COMPANY]: [],
  [USER_TYPES.SYSTEM_ADMIN]: [],
  [USER_TYPES.AGENT]: [
    {
      label: "Insurance",
      items: [
        {
          label: "Home",
          icon: HomeIcon,
          href: ROUTES.AGENT.HOME,
        },
        {
          label: "Find Policy",
          icon: SearchIcon,
          href: ROUTES.AGENT.FIND_POLICY,
        },

        {
          label: "Agent Customers",
          icon: UsersIcon,
          href: ROUTES.AGENT.CUSTOMERS,
        },
        {
          label: "My Purchased Policies",
          icon: FileTextIcon,
          href: ROUTES.AGENT.POLICY.PURCHASED,
        },
        {
          label: "Financial Logs",
          icon: UsersIcon,
          href: ROUTES.AGENT.FINANCIAL_LOGS,
        },
      ],
    },
    {
      label: "Profile",
      items: [
        {
          label: "User Profile",
          icon: UserIcon,
          href: ROUTES.AGENT.PROFILE.USER,
        },
        {
          label: "Support",
          icon: HelpCircleIcon,
          href: ROUTES.AGENT.PROFILE.SUPPORT,
        },
        {
          label: "Terms and Conditions",
          icon: FileTextIcon,
          href: ROUTES.AGENT.PROFILE.TERMS,
          external: true,
        },
        {
          label: "Privacy Policy",
          icon: FileTextIcon,
          href: ROUTES.AGENT.PROFILE.PRIVACY,
          external: true,
        },
      ],
    },
  ],
};
