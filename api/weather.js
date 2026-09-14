import {
  fetchTwoHourForecastUpstream,
  sendJson,
} from "./_upstream.js";

/**
 * 2-Hour weather forecast API endpoint:
 * Fetches real-time two-hour forecast from data.gov.sg, matches area metadata to forecasts,
 * validates structure, and applies Vercel shared caching headers.
 */
export default async function handler(req, res) {
  const upstreamResult = await fetchTwoHourForecastUpstream();

  // 1. Upstream unreachable (timeout, network drop, DNS failure)
  if (!upstreamResult.answered || !upstreamResult.response) {
    res.setHeader("Cache-Control", "no-store, max-age=0");
    return sendJson(res, 503, {
      error: true,
      upstreamStatus: null,
      message: "We couldn’t reach the weather service. Please try again shortly.",
    });
  }

  // 2. Non-2xx reply from upstream
  if (!upstreamResult.ok) {
    res.setHeader("Cache-Control", "no-store, max-age=0");
    const status = upstreamResult.status || 500;
    const message =
      status === 429
        ? "The weather service is receiving too many requests. Please wait a moment and try again."
        : "The weather service declined this request. Please try again later.";

    return sendJson(res, status, {
      error: true,
      upstreamStatus: status,
      message,
    });
  }

  // 3. Parse JSON safely
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

  // 4. Validate response structure
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

  // Handle empty forecasts array
  if (forecasts.length === 0) {
    res.setHeader("Cache-Control", "no-store, max-age=0");
    return sendJson(res, 200, {
      areas: [],
      sourceTimestamps: {
        updateTimestamp: firstItem.update_timestamp || null,
        timestamp: firstItem.timestamp || null,
      },
      validPeriod: firstItem.valid_period || null,
      retrievedAt: new Date().toISOString(),
      empty: true,
      message: "No forecast is available for this area right now.",
    });
  }

  // 5. Match area metadata names with forecast descriptions
  const forecastLookup = new Map();
  for (const f of forecasts) {
    if (f && typeof f.area === "string") {
      forecastLookup.set(f.area.trim(), f.forecast || "");
    }
  }

  const matchedAreas = [];
  for (const meta of areaMetadata) {
    if (meta && typeof meta.name === "string") {
      const areaName = meta.name.trim();
      matchedAreas.push({
        name: areaName,
        forecast: forecastLookup.get(areaName) || "No forecast is available for this area right now.",
      });
    }
  }

  // 6. Set shared Vercel response caching header for 30 minutes
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=1800, stale-while-revalidate=3600"
  );

  const payload = {
    areas: matchedAreas,
    sourceTimestamps: {
      updateTimestamp: firstItem.update_timestamp || null,
      timestamp: firstItem.timestamp || null,
    },
    validPeriod: firstItem.valid_period || null,
    retrievedAt: new Date().toISOString(),
  };

  return sendJson(res, 200, payload);
}
