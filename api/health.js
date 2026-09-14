import {
  isKeyConfigured,
  fetchTwoHourForecastUpstream,
  sendJson,
} from "./_upstream.js";

/**
 * Health check endpoint reporting:
 * - keyRequired: false
 * - keyConfigured: boolean
 * - upstreamAnswered: boolean
 * - upstreamStatus: number | null
 */
export default async function handler(req, res) {
  // Do not cache health responses
  res.setHeader("Cache-Control", "no-store, max-age=0");

  const upstreamResult = await fetchTwoHourForecastUpstream();

  const body = {
    keyRequired: false,
    keyConfigured: isKeyConfigured(),
    upstreamAnswered: upstreamResult.answered,
    upstreamStatus: upstreamResult.status,
  };

  return sendJson(res, 200, body);
}
