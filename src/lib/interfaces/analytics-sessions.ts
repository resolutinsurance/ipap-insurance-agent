export interface SessionDevice {
  os: string | null;
  os_version: string | null;
  browser: string | null;
  browser_version: string | null;
}

export interface SessionIpMeta {
  ip: string | null;
  country: string | null;
  country_code: string | null;
  region: string | null;
  city: string | null;
  timezone: string | null;
}

export interface Session {
  id: string;
  sessionID: string;
  userID: string | null;
  created_at: string;
  device: SessionDevice;
  ipMeta: SessionIpMeta;
  createdAt?: string;
  updatedAt?: string;
}

export interface SessionListMetadata {
  page: string;
  pageSize: string;
  totalPages: number;
  totalItems: number;
}

export interface SessionListResponse {
  message: Session[];
  metadata: SessionListMetadata;
}

export type SessionEventMetadata = Record<string, unknown>;

export interface SessionEvent {
  id: string;
  userID: string | null;
  sessionID: string;
  eventID: string;
  eventType: string;
  eventAction: string;
  description: string;
  path: string;
  created_at: string;
  metadata: SessionEventMetadata;
  createdAt?: string;
  updatedAt?: string;
}

export interface SessionEventListResponse {
  message: SessionEvent[];
  metadata: SessionListMetadata;
}

export interface CreateSessionPayload {
  sessionID: string;
  userID: string | null;
  created_at: string;
  device: {
    os: string | null;
    os_version: string | null;
    browser: string | null;
    browser_version: string | null;
  };
  ipMeta: {
    ip: string | null;
    country: string | null;
    country_code: string | null;
    region: string | null;
    city: string | null;
    timezone: string | null;
  };
}

export type UpdateSessionPayload = Partial<Pick<CreateSessionPayload, "userID">>;

export interface CreateSessionEventPayload {
  eventID: string;
  sessionID: string;
  userID: string | null;
  eventType: string;
  eventAction: string;
  description: string;
  path: string;
  created_at: string;
  metadata: SessionEventMetadata;
}

export type UpdateSessionEventPayload = Partial<
  Pick<CreateSessionEventPayload, "userID">
>;

export interface UseIPResponse {
  asn?: string;
  city?: string;
  continent_code?: string;
  country?: string;
  country_area?: 239460;
  country_calling_code?: string;
  country_capital?: string;
  country_code?: string;
  country_code_iso3?: string;
  country_name?: string;
  country_population?: number;
  country_tld?: string;
  currency?: string;
  currency_name?: string;
  in_eu?: boolean;
  ip?: string;
  languages?: string;
  latitude?: number;
  longitude?: number;
  network?: string;
  org?: string;
  postal?: unknown;
  region?: string;
  region_code?: string;
  timezone?: string;
  utc_offset?: string;
  version?: string;
}
