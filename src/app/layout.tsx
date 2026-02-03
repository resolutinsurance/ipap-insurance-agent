import AnalyticsLayout from "@/layouts/analytics-layout";
import { Providers } from "@/lib/providers";
import type { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resolut | IPAP",
  description: "Insurance Products Aggregation Portal",
};

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
  }>
) {
  return (
    <html lang="en" className="light scroll-smooth" style={{ colorScheme: "light" }}>
      <body className={`antialiased overflow-clip`}>
        <Toaster position="top-right" richColors />
        <Providers>
          <AnalyticsLayout>{props.children}</AnalyticsLayout>
        </Providers>
        <Script
          id="tawk-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/6970a39e137fe5198154e695/1jffvu938';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
