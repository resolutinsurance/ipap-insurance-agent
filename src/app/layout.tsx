import AnalyticsLayout from "@/layouts/analytics-layout";
import AppLayout from "@/layouts/app-layout";
import { Providers } from "@/lib/providers";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resolut | IPAP",
  description: "Insurance Products Aggregation Portal",
};

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
    modal: React.ReactNode;
  }>
) {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");

  const isDashboardRoute = pathname?.startsWith("/dashboard");

  return (
    <html lang="en" className="light scroll-smooth" style={{ colorScheme: "light" }}>
      <body
        className={`antialiased ${
          isDashboardRoute ? "overflow-clip" : "overflow-x-clip"
        }`}
      >
        <AppLayout>
          <Toaster />
          <Providers>
            <AnalyticsLayout>
              {props.children}
              {props.modal}
            </AnalyticsLayout>
          </Providers>
        </AppLayout>
      </body>
    </html>
  );
}
