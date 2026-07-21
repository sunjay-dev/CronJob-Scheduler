import mongoose from "mongoose";
import env from "./env.config.js";

export default async function connectDB() {
  try {
    await mongoose.connect(env.MONGO_DB_URI);
    console.log("MongoDB connected!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
