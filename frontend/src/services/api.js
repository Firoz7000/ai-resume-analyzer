/**
 * Central place for HTTP calls to your Express API.
 * Uses VITE_API_URL when provided (production), otherwise local backend.
 */
const base = (import.meta.env.VITE_API_URL ?? 'http://localhost:5050').replace(/\/$/, '')

export async function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${base}${path}`
  const res = await fetch(url, {
    ...options,
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
