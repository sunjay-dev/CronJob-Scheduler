import "./tracing.js";
import { shutdownTracing } from "./tracing.js";
import app from "./app.js";
import connectDB from "./config/db.config.js";
import logger from "./utils/logger.utils.js";
import redis from "./config/redis.config.js";
import mongoose from "mongoose";
import env from "./config/env.config.js";

async function startServer() {
  try {
    await connectDB();

    const server = app.listen(env.PORT, () => {
      logger.info({ message: "Server running on Port", port: env.PORT });
    });

    const shutdown = async (signal: string) => {
      logger.info({ message: "Shutting down...", signal });

      server.close(async () => {
        logger.info({ message: "HTTP server closed." });

        const results = await Promise.allSettled([redis.quit(), mongoose.connection.close()]);

        for (const result of results) {
          if (result.status === "rejected") {
            logger.error({ message: "Error closing connection", error: result.reason });
          }
        }

        await shutdownTracing();

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
