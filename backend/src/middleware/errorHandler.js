export function errorHandler(err, _req, res, _next) {
  const status =
    err.status ||
    err.statusCode ||
    (err.name === 'MulterError' ? 400 : null) ||
    500
  const message = err.message || 'Internal Server Error'
  console.error(err)
  res.status(status).json({ error: message })
}
