export enum LogEvents {
  VisitLandingPage = "visit_landing_page",
  ClickJoinWaitList = "click_join_waitlist_btn",
  JoinedWaitList = "joined_waitlist",
  FailedToJoinWaitList = "join_waitlist_failed",
  ClickSocialLink = "click_social_link",
}

/**
 * Session Event Types - maps to backend eventType field
 * Used to categorize different types of user events
 */
export enum SessionEventType {
  PAGE_VIEW = "PAGE_VIEW",
  PAGE_VISIT = "PAGE_VISIT",
  CLICK = "CLICK",
  CUSTOM_EVENT = "CUSTOM_EVENT",
}

/**
 * Event Names - used to generate eventID
 * Each event name maps to a unique identifier
 */
export enum EventName {
  PAGE_VISIT = "page_visit",
  PAGE_VIEW = "page_view",
  VISIT_LANDING_PAGE = "visit_landing_page",
  CLICK_SOCIAL_LINK = "click_social_link",
  LOGIN_SUCCESS = "login_success",
  LOGIN_FAILURE = "login_failure",
  APP_CLOSE = "app_close",
  RESET_PASSWORD_START = "reset_password_start",
  RESET_PASSWORD_FAIL = "reset_password_fail",
  EMAIL_VERIFIED = "email_verified",
  USER_LOGOUT = "user_logout",
  ASSIGN_ROLE = "assign_role",
  PASSWORD_CHANGE = "password_change",
}

/**
 * Event Actions - maps to backend eventAction field
 * Describes the specific action taken by the user
 */
export enum EventAction {
  VIEW_HOME_PAGE = "view_home_page",
  VIEW_PAGE = "view_page",
  VISIT_LANDING_PAGE = "visit_landing_page",
  CLICK_SOCIAL_LINK = "click_social_link",
  LOGIN_SUCCESS = "login_success",
  LOGIN_FAILURE = "login_failure",
  APP_CLOSE = "app_close",
  TAB_CLOSE = "tab_close",
  RESET_PASSWORD_START = "reset_password_start",
  RESET_PASSWORD_FAIL = "reset_password_fail",
  EMAIL_VERIFIED = "email_verified",
  USER_LOGOUT = "user_logout",
  ASSIGN_ROLE = "assign_role",
  PASSWORD_CHANGE = "password_change",
}
