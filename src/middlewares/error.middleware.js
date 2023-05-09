import CustomError from "../utils/errors/customError.utils.js";
import { logger } from "../utils/winston.js";

export function errorMiddleware(error, _req, res, _next) {
  logger.error("An error has occurred", error.message);
  if (!(error instanceof CustomError)) {
    return res.status(500).json({
      status: "Process error",
      message: error.message,
      cause: error.cause || "Unknown",
    });
  }
  const [status, cause] = error.cause.split("-");
  res.status(parseInt(status)).json({
    status: error.name,
    message: error.message,
    cause,
  });
}
