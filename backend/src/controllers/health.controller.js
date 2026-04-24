/**
 * GET /api/health — confirms the API process is running (for uptime checks, Render, etc.).
 */
export function healthCheck(_req, res) {
  res.json({ ok: true, service: 'resume-analyzer-api' })
}
