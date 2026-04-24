import { asyncHandler } from '../utils/asyncHandler.js'
import { extractTextFromPdf } from '../services/pdf.service.js'
import { analyzeResumeWithGroq } from '../services/groq.service.js'
import { RESUME_FIELD_NAME } from '../utils/constants.js'

/**
 * POST /api/analyze
 * 1) Multer puts the PDF in req.file (see resume.routes + upload middleware).
 * 2) pdf.service extracts plain text.
 * 3) groq.service runs AI analysis (extend prompts/scoring here later).
 */
export const analyzeResume = asyncHandler(async (req, res) => {
  if (!req.file?.buffer) {
    return res.status(400).json({
      error: `Missing PDF file (form field: ${RESUME_FIELD_NAME})`,
    })
  }

  const text = await extractTextFromPdf(req.file.buffer)
  if (!text) {
    return res.status(400).json({ error: 'Could not read text from PDF' })
  }

  const targetRole =
    typeof req.body?.targetRole === 'string' && req.body.targetRole.trim()
      ? req.body.targetRole.trim()
      : 'Software Developer'

  const analysis = await analyzeResumeWithGroq(text, targetRole)

  res.json({
    textPreview: text.slice(0, 500),
    targetRole,
    analysis,
  })
})
