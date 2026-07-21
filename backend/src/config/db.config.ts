import mongoose from "mongoose";
import logger from "../utils/logger.utils.js";
import env from "./env.config.js";

export default async function connectDB() {
  try {
    await mongoose.connect(env.MONGO_DB_URI);
    logger.info({ message: "MongoDB connected" });
  } catch (error) {
    logger.error({ message: "Failed to connect to MongoDB", error });
    throw error;
  }
}
