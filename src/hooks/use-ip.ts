import { COOKIE_KEYS } from "@/lib/constants";
import type { UseIPResponse } from "@/lib/interfaces/analytics-sessions";
import { useEffect, useState } from "react";

function useIP(): {
  ipResponse: UseIPResponse | null;
  fetchLocation: () => Promise<void>;
} {
  const [ipResponse, setIPResponse] = useState<UseIPResponse | null>(null);

  useEffect(() => {
    void fetchLocation();
  }, []);

  async function fetchLocation(): Promise<void> {
    try {
      const response = await fetch("https://ipapi.co/json/");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: UseIPResponse = await response.json();
      const ipResponse_ = {
        country_name: data.country_name,
        country_code: data.country_code,
        city: data.city,
        region: data.region,
        timezone: data.timezone,
        utc_offset: data.utc_offset,
        ip: data.ip,
      };
      setIPResponse(ipResponse_);
      localStorage.setItem(COOKIE_KEYS.userLocation, JSON.stringify(ipResponse_));
    } catch (error) {
      console.error("Failed to fetch IP location:", error);
      setIPResponse(null);
    }
  }

  return {
    ipResponse,
    fetchLocation,
  };
}

export default useIP;
