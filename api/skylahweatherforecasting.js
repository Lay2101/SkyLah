import {
  getCredentialInfo,
  fetchTwoHourForecastUpstream,
  sendJson,
} from "./_upstream.js";

/**
 * Serverless handler for Skylah Weather Forecasting:
 * Calls data.gov.sg two-hour forecast, verifies credentials prior to fetch,
 * checks response.ok before reading body, caches with s-maxage=20, stale-while-revalidate=40,
 * and filters payload strictly to only the fields needed by the UI.
 */
export default async function handler(req, res) {
  // 1. BEFORE the fetch: verify credential presence
  const credential = getCredentialInfo();
  if (!credential.isConfigured || !credential.value) {
    res.setHeader("Cache-Control", "no-store, max-age=0");
    return sendJson(res, 503, {
      error: true,
      upstreamStatus: null,
      message: `Missing or empty environment variable: ${credential.varName}`,
    });
  }

  // 2. Call upstream with credential in x-api-key header
  const upstreamResult = await fetchTwoHourForecastUpstream(credential.value);

  // 3. Upstream is unreachable (timeout, network error, DNS failure)
  if (!upstreamResult.answered || !upstreamResult.response) {
    res.setHeader("Cache-Control", "no-store, max-age=0");
    return sendJson(res, 503, {
      error: true,
      upstreamStatus: null,
      message: "We couldn’t reach the weather service. Please try again shortly.",
    });
  }

  // 4. AFTER the fetch: check response.ok BEFORE reading body (refusal handling)
  if (!upstreamResult.ok) {
    res.setHeader("Cache-Control", "no-store, max-age=0");
    const status = upstreamResult.status || 502;
    const reason =
      status === 429
        ? "The weather service is receiving too many requests. Please wait a moment and try again."
        : "The weather service declined this request. Please try again later.";

    return sendJson(res, status, {
      error: true,
      upstreamStatus: status,
      message: reason,
    });
  }

  // 5. Read body safely
  let rawJson;
  try {
    const rawText = await upstreamResult.response.text();
    rawJson = JSON.parse(rawText);
  } catch (_err) {
    res.setHeader("Cache-Control", "no-store, max-age=0");
    return sendJson(res, 502, {
      error: true,
      upstreamStatus: upstreamResult.status,
      message: "The weather service returned an unreadable response. Please try again shortly.",
    });
  }

  // 6. Validate response structure
  const areaMetadata = rawJson?.data?.area_metadata;
  const items = rawJson?.data?.items;

  if (!Array.isArray(areaMetadata) || !Array.isArray(items) || items.length === 0) {
    res.setHeader("Cache-Control", "no-store, max-age=0");
    return sendJson(res, 502, {
      error: true,
      upstreamStatus: upstreamResult.status,
      message: "The weather service returned an unexpected response structure. Please try again shortly.",
    });
  }

  const firstItem = items[0];
  const forecasts = firstItem?.forecasts;

  if (!Array.isArray(forecasts)) {
    res.setHeader("Cache-Control", "no-store, max-age=0");
    return sendJson(res, 502, {
      error: true,
      upstreamStatus: upstreamResult.status,
      message: "The weather service returned an unexpected response structure. Please try again shortly.",
    });
  }

  // Empty forecasts
  if (forecasts.length === 0) {
    res.setHeader("Cache-Control", "s-maxage=20, stale-while-revalidate=40");
    return sendJson(res, 200, {
      areas: [],
      validPeriod: firstItem.valid_period || null,
      sourceTimestamps: {
        updateTimestamp: firstItem.update_timestamp || null,
        timestamp: firstItem.timestamp || null,
      },
      retrievedAt: new Date().toISOString(),
      empty: true,
      message: "No forecast is available for this area right now.",
    });
  }

  // 7. Extract ONLY the fields needed by the screen: area names and forecast texts
  const forecastMap = new Map();
  for (const item of forecasts) {
    if (item && typeof item.area === "string") {
      forecastMap.set(item.area.trim().toLowerCase(), item.forecast || "");
    }
  }

  const areas = [];
  for (const meta of areaMetadata) {
    if (meta && typeof meta.name === "string") {
      const name = meta.name.trim();
      areas.push({
        name,
        forecast: forecastMap.get(name.toLowerCase()) || "No forecast is available for this area right now.",
      });
    }
  }

  // Cache directive matching provider update rhythm (30s cache)
  res.setHeader("Cache-Control", "s-maxage=20, stale-while-revalidate=40");

  return sendJson(res, 200, {
    areas,
    validPeriod: firstItem.valid_period || null,
    sourceTimestamps: {
      updateTimestamp: firstItem.update_timestamp || null,
      timestamp: firstItem.timestamp || null,
    },
    retrievedAt: new Date().toISOString(),
  });
}
