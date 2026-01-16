import { COOKIE_KEYS } from "@/lib/constants";
import getBrowserInstance from "@/lib/utils/get-browser-instance";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, params } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Parse URL to merge any additional params
    const urlObj = new URL(url);

    // Get authorization config and token from cookies
    const cookieStore = await cookies();
    const cookieName = COOKIE_KEYS.accessToken;
    const authType = "Bearer";
    const authToken = cookieStore.get(cookieName)?.value || "";

    const browser = await getBrowserInstance();
    const page = await browser.newPage();

    // Merge any additional params from the request body
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          urlObj.searchParams.set(key, String(value));
        }
      });
    }

    // Set authorization cookie on the page before navigation
    if (authToken) {
      await page.setCookie({
        name: cookieName,
        value: authToken,
        domain: urlObj.hostname,
        path: "/",
      });
    }

    // Set up request interception to add authorization headers to all requests
    await page.setRequestInterception(true);

    page.on(
      "request",
      (request: {
        headers: () => Record<string, string>;
        continue: (options: { headers: Record<string, string> }) => Promise<void>;
      }) => {
        const requestHeaders = request.headers();
        if (authToken) {
          requestHeaders.Authorization = `${authType} ${authToken}`;
        }
        void request.continue({ headers: requestHeaders });
      }
    );

    await page.goto(urlObj.toString(), { waitUntil: "networkidle0" });

    const buffer = await page.pdf({
      waitForFonts: true,
      timeout: 0,
      printBackground: true,
      format: "A4",
      margin: {
        top: "2.1cm",
        right: "1.32cm",
        bottom: "1.8cm",
        left: "1.9cm",
      },
      preferCSSPageSize: true,
      displayHeaderFooter: false,
    });

    await page.close();

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        "Content-Type": "application/pdf",
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
