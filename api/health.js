import {
  getCredentialInfo,
  fetchTwoHourForecastUpstream,
  sendJson,
} from "./_upstream.js";

/**
 * Health check endpoint reporting:
 * - keyConfigured: boolean (whether credential is set and valid)
 * - upstreamAnswered: boolean (whether the upstream server replied)
 * - upstreamStatus: number | null (HTTP status code returned by upstream)
 *
 * Never prints or logs the credential or any part of it.
 */
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");

  const credential = getCredentialInfo();
  const upstreamResult = await fetchTwoHourForecastUpstream(credential.value);

  const payload = {
    keyConfigured: credential.isConfigured,
    upstreamAnswered: upstreamResult.answered,
    upstreamStatus: upstreamResult.status,
  };

  return sendJson(res, 200, payload);
}
