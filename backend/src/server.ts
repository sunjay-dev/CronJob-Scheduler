import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.config.js";
import logger from "./utils/logger.utils.js";
import redis from "./config/redis.config.js";
import mongoose from "mongoose";

async function startServer() {
  try {
    await connectDB();

    const port = process.env.PORT || 3000;
    const server = app.listen(port, () => {
      logger.info({ message: "Server running on Port", port });
    });

    const shutdown = async (signal: string) => {
      logger.info({ message: "Closing connections...", signal });
      await redis.quit();
      await mongoose.connection.close();
      server.close(() => {
        logger.info({ message: "Server and DB connections closed." });
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    logger.error({ message: "Failed to start server", error });
    process.exit(1);
  }
}

startServer();
