import mongoose from "mongoose";
import logger from "../utils/logger.utils.js";

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI as string);
    logger.info({ message: "MongoDB connected" });
  } catch (error) {
    logger.error({ message: "Failed to connect to MongoDB", error });
    throw error;
  }
}
