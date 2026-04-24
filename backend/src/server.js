import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import routes from './routes/index.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

// Allow your React app (local + production) to call this API
app.use(
  cors({
    origin: env.corsOrigin.split(',').map((s) => s.trim()),
    credentials: true,
  }),
)

// Parse JSON bodies (e.g. future endpoints for job preferences)
app.use(express.json({ limit: '1mb' }))

// All API routes live under /api (see src/routes)
app.use('/api', routes)

// Last: turn thrown errors into JSON { error: "..." }
app.use(errorHandler)

app.listen(env.port, () => {
  console.log(`API listening on http://localhost:${env.port}`)
})
