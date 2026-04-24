/**
 * Wraps an async route handler so errors are passed to Express error middleware.
 * Keeps controllers free of repetitive try/catch blocks.
 */
export function asyncHandler(fn) {
  return function asyncHandlerWrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
