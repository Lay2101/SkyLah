/**
 * Shared helper for calling Singapore data.gov.sg two-hour forecast API.
 * Supports unauthenticated access or optional DATA_GOV_SG_API_KEY.
 * Never prints or logs the credential.
 */

const UPSTREAM_URL = "https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast";
const REQUEST_TIMEOUT_MS = 8000;

export function isKeyConfigured() {
  const key = process.env.DATA_GOV_SG_API_KEY;
  return typeof key === "string" && key.trim().length > 0;
}

export function getSafeApiKey() {
  if (isKeyConfigured()) {
    return process.env.DATA_GOV_SG_API_KEY.trim();
  }
  return null;
}

export async function fetchTwoHourForecastUpstream() {
  const headers = {
    Accept: "application/json",
  };

  const apiKey = getSafeApiKey();
  if (apiKey) {
    headers["x-api-key"] = apiKey;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(UPSTREAM_URL, {
      method: "GET",
      headers,
      signal: controller.signal,
    });

    return {
      answered: true,
      status: response.status,
      ok: response.ok,
      response,
      error: null,
    };
  } catch (err) {
    return {
      answered: false,
      status: null,
      ok: false,
      response: null,
      error: err,
    };
  } finally {
    clearTimeout(timer);
  }
}

export function sendJson(res, statusCode, data) {
  if (typeof res.status === "function" && typeof res.json === "function") {
    return res.status(statusCode).json(data);
  }
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}
