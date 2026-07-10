export function errorHandler(err, req, res, next) {
  console.error(`[Auth Error] ${err.message}`);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
  });
}
