export function errorMiddleware(error, _req, res, _next) {
  const [status, cause] = error.cause.split("-");
  res.status(parseInt(status)).json({
    status: error.name,
    message: error.message,
    cause,
  });
}
