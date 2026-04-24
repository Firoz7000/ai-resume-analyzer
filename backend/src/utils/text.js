/**
 * Trims resume text before sending to an LLM (token limits, cost).
 * @param {string} text
 * @param {number} maxChars
 */
export function truncateForAi(text, maxChars) {
  if (!text || text.length <= maxChars) return text
  return text.slice(0, maxChars)
}
