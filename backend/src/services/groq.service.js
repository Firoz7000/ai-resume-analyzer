import Groq from 'groq-sdk'
import { env } from '../config/env.js'
import { truncateForAi } from '../utils/text.js'

const MAX_RESUME_CHARS = 12000
const DEFAULT_TARGET_ROLE = 'Software Developer'

/**
 * Example: send resume text to Groq for analysis. Extend prompts/models as you build features.
 * @param {string} resumeText
 * @param {string} [targetRole]
 */
export async function analyzeResumeWithGroq(resumeText, targetRole = DEFAULT_TARGET_ROLE) {
  if (!env.groqApiKey) {
    throw Object.assign(new Error('GROQ_API_KEY is not set'), { status: 503 })
  }

  // Create the client only after we know the API key exists.
  const groq = new Groq({ apiKey: env.groqApiKey })

  let completion
  try {
    completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert ATS reviewer and hiring manager assistant. ' +
            'Return STRICTLY valid JSON with EXACTLY these keys and types:\n' +
            '{\n' +
            '  "score": number,\n' +
            '  "strengths": string[],\n' +
            '  "weaknesses": string[],\n' +
            '  "missing_skills": string[],\n' +
            '  "improvement_suggestions": string[],\n' +
            '  "recommended_job_roles": string[]\n' +
            '}\n' +
            'No extra keys. No markdown. No surrounding text.\n' +
            'Use simple, clear language suitable for beginners.',
        },
        {
          role: 'user',
          content:
            `Target role: ${targetRole || DEFAULT_TARGET_ROLE}\n\n` +
            `Resume text:\n\n${truncateForAi(resumeText, MAX_RESUME_CHARS)}\n\n` +
            'Evaluate this resume ONLY for the selected role and produce the JSON response.\n' +
            'Scoring rules (important):\n' +
            '1) Evaluate fit for the target role first (skills, projects, impact, and experience relevance).\n' +
            '2) Ignore irrelevant projects/certifications that do not help this role.\n' +
            '3) Penalize resumes that list many unrelated skills/technologies.\n' +
            '4) Check consistency: if a skill is listed, verify project/experience evidence supports it.\n' +
            '5) If skills are not supported by projects/experience, reduce score and mention this in weaknesses.\n' +
            '6) Avoid score inflation: do not reward quantity of projects/certifications; reward quality, depth, relevance, and measurable outcomes.\n' +
            '7) Keep scoring realistic and strict. Average resumes should be near 50-70, strong role-aligned resumes 75-90, exceptional evidence-backed resumes 90+.\n\n' +
            'Output guidance:\n' +
            '- score: 0 to 100 role-fit score.\n' +
            '- strengths: 3-6 concise points focused on target-role relevance.\n' +
            '- weaknesses: 3-6 concise points, including unsupported skills or irrelevant focus.\n' +
            '- missing_skills: 3-10 role-relevant missing skills only.\n' +
            '- improvement_suggestions: 5-10 practical actions to improve fit for the target role.\n' +
            '- recommended_job_roles: 3-8 realistic role titles based on current resume strength and evidence.',
        },
      ],
      max_tokens: 900,
      temperature: 0.2,
    })
  } catch (err) {
    console.error('Groq API error:', err)
    throw Object.assign(new Error('Failed to analyze resume with Groq'), { status: 502 })
  }

  const raw = completion.choices?.[0]?.message?.content?.trim() || ''
  const parsed = tryParseJson(raw)

  // Ensure the contract even if the model output is imperfect.
  if (
    !parsed ||
    typeof parsed.score !== 'number' ||
    !Array.isArray(parsed.strengths) ||
    !Array.isArray(parsed.weaknesses) ||
    !Array.isArray(parsed.missing_skills) ||
    !Array.isArray(parsed.improvement_suggestions) ||
    !Array.isArray(parsed.recommended_job_roles)
  ) {
    return {
      score: 0,
      strengths: [],
      weaknesses: [],
      missing_skills: [],
      improvement_suggestions: [],
      recommended_job_roles: [],
    }
  }

  return {
    score: clampScore(parsed.score),
    strengths: asStringArray(parsed.strengths),
    weaknesses: asStringArray(parsed.weaknesses),
    missing_skills: asStringArray(parsed.missing_skills),
    improvement_suggestions: asStringArray(parsed.improvement_suggestions),
    recommended_job_roles: asStringArray(parsed.recommended_job_roles),
  }
}

function tryParseJson(text) {
  try {
    return JSON.parse(text)
  } catch {
    // Some models wrap JSON in text; attempt to extract the first JSON object.
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start === -1 || end === -1 || end <= start) return null

    const candidate = text.slice(start, end + 1)
    try {
      return JSON.parse(candidate)
    } catch {
      return null
    }
  }
}

function asStringArray(value) {
  if (!Array.isArray(value)) return []
  return value
    .filter((v) => typeof v === 'string')
    .map((s) => s.trim())
    .filter(Boolean)
}

function clampScore(score) {
  if (typeof score !== 'number' || Number.isNaN(score)) return 0
  return Math.max(0, Math.min(100, Math.round(score)))
}
