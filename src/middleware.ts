import { COOKIE_KEYS, ROUTES, USER_TYPES } from "@/lib/constants";
import type { User } from "@/lib/interfaces";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Array of public routes that should be accessible to everyone
const PUBLIC_ROUTES = [
  ROUTES.PUBLIC.PRIVACY_POLICY,
  ROUTES.PUBLIC.CONTACT,
  ROUTES.PUBLIC.TERMS,
  ROUTES.PUBLIC.SUPPORT,
];

// Array of public route patterns (for routes that start with certain paths)
const PUBLIC_ROUTE_PATTERNS = [
  ROUTES.PUBLIC.PREMIUM_FINANCING,
  ROUTES.PUBLIC.QUOTE_PAYMENT,
  ROUTES.PUBLIC.CUSTOMER_SELF_VERIFICATION,
  ROUTES.PUBLIC.VERIFY_USER,
];

export function middleware(request: NextRequest) {
  console.log("🔍 MIDDLEWARE TRIGGERED");
  console.log("🔍 Request URL:", request.url);
  console.log("🔍 Request method:", request.method);

  const userCookie = request.cookies.get(COOKIE_KEYS.user)?.value;
  const agentCookie = request.cookies.get(COOKIE_KEYS.agent)?.value;
  const accessTokenCookie = request.cookies.get(COOKIE_KEYS.accessToken)?.value;
  const userTypeCookie = request.cookies.get(COOKIE_KEYS.userType)?.value;
  const pathname = new URL(request.url).pathname;
  const headers = new Headers(request.headers);

  // Parse user data from cookie to check Ghana verification status
  let userData: Pick<User, "GhcardNo" | "verified"> | null = null;
  if (userCookie) {
    try {
      userData = JSON.parse(userCookie);
    } catch {
      // If parsing fails, userData remains null
    }
  }

  // Parse agent data from cookie to check companyId
  let agentData: { companyID?: string | null } | null = null;
  if (agentCookie) {
    try {
      agentData = JSON.parse(agentCookie);
    } catch {
      // If parsing fails, agentData remains null
    }
  }

  // Check if user is Ghana verified
  const isGhanaVerified =
    userData?.GhcardNo != null &&
    userData?.GhcardNo !== "" &&
    userData?.verified === true;

  // Helper function to clear cookies and redirect to login (logout)
  const clearAuthAndRedirect = () => {
    const response = NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
    response.cookies.delete(COOKIE_KEYS.user);
    response.cookies.delete(COOKIE_KEYS.accessToken);
    response.cookies.delete(COOKIE_KEYS.userType);
    response.cookies.delete(COOKIE_KEYS.agent);
    response.cookies.delete(COOKIE_KEYS.refreshToken);
    return response;
  };

  // Handle base "/" route - redirect to dashboard if authenticated, signin if not
  if (pathname === "/") {
    if (
      userCookie &&
      accessTokenCookie &&
      userTypeCookie === USER_TYPES.AGENT &&
      agentCookie
    ) {
      // Check if agent has companyId
      if (!agentData?.companyID) {
        console.log("🔍 Base route - agent without companyId, logging out");
        return clearAuthAndRedirect();
      }
      // Check if user has verified Ghana card
      if (!isGhanaVerified) {
        console.log("🔍 Base route - user not Ghana verified, redirecting to verify-id");
        return NextResponse.redirect(new URL(ROUTES.VERIFY_ID, request.url));
      }
      console.log("🔍 Base route - authenticated agent, redirecting to dashboard");
      return NextResponse.redirect(new URL(ROUTES.AGENT.HOME, request.url));
    } else {
      console.log("🔍 Base route - not authenticated, redirecting to signin");
      return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
    }
  }

  // Check if the path is a public route that should be accessible to everyone
  const isExactPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isPublicRoutePattern = PUBLIC_ROUTE_PATTERNS.some((pattern) =>
    pathname.startsWith(pattern)
  );
  const isPublicRoute = isExactPublicRoute || isPublicRoutePattern;

  // If it's a public route, allow access regardless of authentication status
  if (isPublicRoute) {
    console.log("🔍 Public route detected, allowing access");
    return NextResponse.next({ headers });
  }

  const isAuthRoute =
    pathname === ROUTES.LOGIN ||
    pathname === ROUTES.FORGOT_PASSWORD ||
    pathname === ROUTES.VERIFY_EMAIL;

  const isVerifyIdRoute = pathname === ROUTES.VERIFY_ID;
  const isProtectedRoute = pathname.startsWith("/dashboard");

  // If user is authenticated
  if (userCookie && accessTokenCookie) {
    console.log("🔍 User is authenticated (has userCookie and accessTokenCookie)");

    // If no userType, redirect to login
    if (!userTypeCookie) {
      console.log("🔍 No userType, redirecting to login");
      return clearAuthAndRedirect();
    }

    // This app is agent-only. If userType is not agent, logout
    if (userTypeCookie !== USER_TYPES.AGENT) {
      console.log("🔍 Invalid userType for agent app, logging out");
      return clearAuthAndRedirect();
    }

    // Check if agent has companyId
    if (!agentData?.companyID) {
      console.log("🔍 Agent without companyId, logging out");
      return clearAuthAndRedirect();
    }

    // Check if user has verified Ghana card
    if (!isGhanaVerified) {
      // Allow access to verify-id route if not verified
      if (isVerifyIdRoute) {
        console.log("🔍 Verify ID route - allowing access for unverified user");
        return NextResponse.next({ headers });
      }
      // Redirect to verify-id if trying to access protected routes
      if (isProtectedRoute) {
        console.log("🔍 User not Ghana verified, redirecting to verify-id");
        return NextResponse.redirect(new URL(ROUTES.VERIFY_ID, request.url));
      }
    }

    // If trying to access auth routes with full authentication, redirect to dashboard
    if (isAuthRoute) {
      console.log("🔍 Auth route with authentication, redirecting to dashboard");
      return NextResponse.redirect(new URL(ROUTES.AGENT.HOME, request.url));
    }

    // If trying to access verify-id route but already verified, redirect to dashboard
    if (isVerifyIdRoute && isGhanaVerified) {
      console.log("🔍 Already verified, redirecting to dashboard");
      return NextResponse.redirect(new URL(ROUTES.AGENT.HOME, request.url));
    }

    // For protected routes, allow access (already validated agent with companyId and Ghana verification)
    if (isProtectedRoute) {
      console.log("🔍 Protected route, allowing access");
      return NextResponse.next({ headers });
    }

    // For any other authenticated routes
    console.log("🔍 Other authenticated route, allowing access");
    return NextResponse.next({ headers });
  }

  // Allow access to auth routes for non-authenticated users
  if (isAuthRoute) {
    console.log("🔍 Auth route for non-authenticated user, allowing access");
    return NextResponse.next({ headers });
  }

  // Redirect non-authenticated users to login for all other routes
  console.log(
    "🔍 Non-authenticated user accessing protected route, redirecting to login:",
    ROUTES.LOGIN
  );
  return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap.xml (sitemap file)
     * - robots.txt (robots file)
     * - assets (public assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets|manifest\\.json|manifest\\.webmanifest|sw\\.js|workbox-.*|icon-192x192\\.png|icon-512x512\\.png|icon\\.svg|apple-touch-icon\\.png).*)",
  ],
};
