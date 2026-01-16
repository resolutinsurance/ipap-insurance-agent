export default async function getBrowserInstance() {
  if (process.env.NODE_ENV === "development") {
    // Dynamically import the full puppeteer package for local development
    const puppeteer = (await import("puppeteer")).default;
    return puppeteer.launch({ headless: true, timeout: 0 });
  }

  // Production environment (like Netlify)
  const puppeteer = (await import("puppeteer-core")).default;
  const chromium = (await import("@sparticuz/chromium")).default;

  return puppeteer.launch({
    timeout: 0,
    args: chromium.args,
    executablePath: await chromium.executablePath(),
  });
}
