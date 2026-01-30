import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { hostname: "wave.resolutfinance.com" },
      { hostname: "jelly.resolutfinance.com" },
    ],
  },
  redirects: async () => {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/home",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(), geolocation=()",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Content-Security-Policy",
            value: `
                  default-src 'self' https://jelly.resolutfinance.com https://*.resolutfinance.com https://embed.tawk.to https://*.tawk.to;
                  img-src 'self' blob: data: https:;
                  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://jelly.resolutfinance.com https://*.resolutfinance.com https://*.wave.resolutfinance.com https://embed.tawk.to https://*.tawk.to https://cdn.jsdelivr.net https://*.jsdelivr.net;
                  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://embed.tawk.to https://*.tawk.to;
                  font-src 'self' https://fonts.gstatic.com https://embed.tawk.to https://*.tawk.to data:;
                  connect-src 'self' https://jelly.resolutfinance.com https://*.resolutfinance.com https://*.wave.resolutfinance.com https://embed.tawk.to https://*.tawk.to wss://vsa21.tawk.to wss://*.tawk.to https:;
                  frame-ancestors 'none';
                  form-action 'self';
                  base-uri 'self';
                `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
          {
            key: "Expect-CT",
            value: "max-age=86400, enforce",
          },
          {
            key: "X-Permitted-Cross-Domain-Policies",
            value: "none",
          },
        ],
      },
      {
        source: "/manifest.json",
        headers: [
          {
            key: "Content-Type",
            value: "application/manifest+json; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  },
};
export default nextConfig;
