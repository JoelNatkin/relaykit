import crypto from "crypto";
import { createServiceClient } from "@/lib/supabase";

// ---------------------------------------------------------------------------
// Encryption helpers (AES-256-GCM)
// ---------------------------------------------------------------------------

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96 bits — recommended for GCM
const AUTH_TAG_LENGTH = 16; // 128 bits

function getEncryptionKey(): Buffer {
  const hex = process.env.TWILIO_ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error(
      "TWILIO_ENCRYPTION_KEY must be a 64-character hex string (32 bytes)"
    );
  }
  return Buffer.from(hex, "hex");
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Returns a JSON string containing base64-encoded `iv`, `authTag`, and `ciphertext`.
 */
export function encryptSecret(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return JSON.stringify({
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
    ciphertext: encrypted.toString("base64"),
  });
}

/**
 * Decrypts an encrypted string produced by `encryptSecret`.
 * Expects a JSON string with base64-encoded `iv`, `authTag`, and `ciphertext`.
 */
export function decryptSecret(encrypted: string): string {
  const key = getEncryptionKey();
  const { iv, authTag, ciphertext } = JSON.parse(encrypted) as {
    iv: string;
    authTag: string;
    ciphertext: string;
  };

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(iv, "base64"),
    { authTagLength: AUTH_TAG_LENGTH }
  );
  decipher.setAuthTag(Buffer.from(authTag, "base64"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(ciphertext, "base64")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

// ---------------------------------------------------------------------------
// TwilioApiError
// ---------------------------------------------------------------------------

export class TwilioApiError extends Error {
  status: number;
  code: number;
  moreInfo: string;

  constructor(message: string, status: number, code: number, moreInfo: string) {
    super(message);
    this.name = "TwilioApiError";
    this.status = status;
    this.code = code;
    this.moreInfo = moreInfo;
  }
}

// ---------------------------------------------------------------------------
// Base URL mapping
// ---------------------------------------------------------------------------

const BASE_URLS: Record<TwilioBaseUrl, string> = {
  api: "https://api.twilio.com",
  messaging: "https://messaging.twilio.com",
  trusthub: "https://trusthub.twilio.com",
};

type TwilioBaseUrl = "api" | "messaging" | "trusthub";

// ---------------------------------------------------------------------------
// twilioFetch — core HTTP client for Twilio REST API
// ---------------------------------------------------------------------------

interface TwilioFetchOptions {
  baseUrl: TwilioBaseUrl;
  path: string;
  method: "GET" | "POST" | "DELETE";
  params?: Record<string, string>;
  accountSid: string;
  authToken: string;
  registrationId?: string;
}

const MAX_RETRIES = 3;
const RETRY_STATUSES = new Set([429, 500, 503]);

function backoffMs(attempt: number): number {
  // 1s, 4s, 16s  (1000 * 4^attempt)
  return 1000 * Math.pow(4, attempt);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Makes an authenticated HTTP request to the Twilio REST API.
 *
 * - POST body uses `application/x-www-form-urlencoded` encoding.
 * - GET appends params as query string.
 * - Retries up to 3 times on 429 / 500 / 503 with exponential backoff.
 * - Logs every call to the `twilio_api_log` table (fire-and-forget).
 * - Throws `TwilioApiError` on non-retryable 4xx errors.
 */
export async function twilioFetch<T = Record<string, unknown>>(
  options: TwilioFetchOptions
): Promise<T> {
  const { baseUrl, path, method, params, accountSid, authToken, registrationId } =
    options;

  const base = BASE_URLS[baseUrl];
  let url = `${base}${path}`;

  // Build headers
  const authHeader =
    "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  const headers: Record<string, string> = {
    Authorization: authHeader,
    Accept: "application/json",
  };

  // Build request body / query string
  let body: string | undefined;
  if (method === "GET" && params && Object.keys(params).length > 0) {
    const qs = new URLSearchParams(params).toString();
    url += (url.includes("?") ? "&" : "?") + qs;
  } else if (method === "POST" && params) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    body = new URLSearchParams(params).toString();
  }

  let lastError: Error | null = null;
  let responseStatus: number | undefined;
  let responseBody: unknown;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, { method, headers, body });
      responseStatus = res.status;

      // Parse response body (may be empty for DELETE)
      const text = await res.text();
      responseBody = text ? JSON.parse(text) : null;

      if (res.ok) {
        // Fire-and-forget log
        logApiCall(registrationId, url, method, params, responseStatus, responseBody, null);
        return responseBody as T;
      }

      // Retryable status — back off and retry
      if (RETRY_STATUSES.has(res.status)) {
        lastError = new TwilioApiError(
          (responseBody as { message?: string })?.message ?? `HTTP ${res.status}`,
          res.status,
          (responseBody as { code?: number })?.code ?? 0,
          (responseBody as { more_info?: string })?.more_info ?? ""
        );

        if (attempt < MAX_RETRIES - 1) {
          await sleep(backoffMs(attempt));
          continue;
        }
      }

      // Non-retryable 4xx — throw immediately
      const errBody = responseBody as {
        message?: string;
        code?: number;
        more_info?: string;
      };
      const apiError = new TwilioApiError(
        errBody?.message ?? `HTTP ${res.status}`,
        res.status,
        errBody?.code ?? 0,
        errBody?.more_info ?? ""
      );

      logApiCall(
        registrationId,
        url,
        method,
        params,
        responseStatus,
        responseBody,
        apiError.message
      );
      throw apiError;
    } catch (err) {
      // Network-level errors (not HTTP errors) — retry
      if (err instanceof TwilioApiError) throw err;

      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < MAX_RETRIES - 1) {
        await sleep(backoffMs(attempt));
        continue;
      }
    }
  }

  // All retries exhausted
  logApiCall(registrationId, url, method, params, responseStatus, responseBody, lastError?.message ?? "Unknown error");
  throw lastError ?? new Error("twilioFetch failed after retries");
}

// ---------------------------------------------------------------------------
// API call logging (fire-and-forget)
// ---------------------------------------------------------------------------

function logApiCall(
  registrationId: string | undefined,
  endpoint: string,
  method: string,
  requestBody: Record<string, string> | undefined,
  responseStatus: number | undefined,
  responseBody: unknown,
  error: string | null
): void {
  try {
    const supabase = createServiceClient();
    // Fire-and-forget — no await, no blocking
    supabase
      .from("twilio_api_log")
      .insert({
        registration_id: registrationId ?? null,
        endpoint,
        method,
        request_body: requestBody ?? null,
        response_status: responseStatus ?? null,
        response_body: responseBody ?? null,
        error,
      })
      .then(({ error: logErr }) => {
        if (logErr) {
          console.error("[twilio_api_log] Failed to write log:", logErr.message);
        }
      });
  } catch (err) {
    console.error("[twilio_api_log] Failed to initialize log write:", err);
  }
}

// ---------------------------------------------------------------------------
// Credential helpers
// ---------------------------------------------------------------------------

/**
 * Returns the parent ISV account credentials from environment variables.
 */
export function getParentCredentials(): {
  accountSid: string;
  authToken: string;
} {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error("Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN env vars");
  }

  return { accountSid, authToken };
}

/**
 * Returns subaccount credentials by decrypting the stored auth token.
 */
export function getSubaccountCredentials(
  subaccountSid: string,
  encryptedAuth: string
): { accountSid: string; authToken: string } {
  return {
    accountSid: subaccountSid,
    authToken: decryptSecret(encryptedAuth),
  };
}
