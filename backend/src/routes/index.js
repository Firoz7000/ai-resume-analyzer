import { Router } from 'express'
import healthRoutes from './health.routes.js'
import resumeRoutes from './resume.routes.js'

const router = Router()

router.use('/', healthRoutes)
router.use('/', resumeRoutes)

export default router
