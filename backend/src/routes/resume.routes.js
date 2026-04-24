import { Router } from 'express'
import { analyzeResume } from '../controllers/resume.controller.js'
import { uploadResume } from '../middleware/upload.js'

const router = Router()

/**
 * Resume upload + AI pipeline.
 * Multer runs first; on success, the controller handles PDF → text → Groq.
 */
router.post('/analyze', (req, res, next) => {
  uploadResume(req, res, (err) => {
    if (err) return next(err)
    analyzeResume(req, res, next)
  })
})

export default router
