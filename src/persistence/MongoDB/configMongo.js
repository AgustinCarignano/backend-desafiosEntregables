import mongoose from "mongoose";
import config from "../../config.js";
import { logger } from "../../utils/winston.js";

const URI = config.uri;

try {
  mongoose.connect(URI);
  logger.info("Successfull connection to the database");
} catch (error) {
  logger.error("Error trying to connect to database", error);
}
