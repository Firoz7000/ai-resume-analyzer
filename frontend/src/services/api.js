/**
 * Central place for HTTP calls to your Express API.
 * Uses VITE_API_URL when provided (production), otherwise local backend.
 */
const base = (import.meta.env.VITE_API_URL ?? 'http://localhost:5050').replace(/\/$/, '')

export async function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${base}${path}`
  const res = await fetch(url, {
    ...options,
    cache: options.cache ?? 'no-store',
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  })
  if (!res.ok) {
    const text = await res.text()
    let message = text || res.statusText
    try {
      const data = JSON.parse(text)
      if (data && typeof data.error === 'string') {
        message = data.error
      }
    } catch {
      // use plain text message
    }
    throw new Error(message)
  }
  const ct = res.headers.get('content-type')
  if (ct?.includes('application/json')) return res.json()
  return res.text()
}

function normalizeScore(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.min(100, Math.round(value)))
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value.replace(/[^\d.-]/g, ''))
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.min(100, Math.round(parsed)))
    }
  }

  return null
}

function toStringArray(value) {
  if (!Array.isArray(value)) return []
  return value
    .filter((item) => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function normalizeAnalyzeResponse(payload) {
  const analysis = payload?.analysis ?? {}
  return {
    targetRole: payload?.targetRole ?? null,
    analysis: {
      score: normalizeScore(analysis.score),
      strengths: toStringArray(analysis.strengths),
      weaknesses: toStringArray(analysis.weaknesses),
      missing_skills: toStringArray(analysis.missing_skills),
      improvement_suggestions: toStringArray(analysis.improvement_suggestions),
      recommended_job_roles: toStringArray(analysis.recommended_job_roles),
    },
  }
}
