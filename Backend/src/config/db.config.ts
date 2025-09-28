import mongoose from "mongoose";
import logger from "../utils/logger.utils";

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI!);
    logger.info("MongoDB connected");
  } catch (err) {
    logger.error(`MongoDB connection error: ${err}`);
  }
}