import { Redis } from "ioredis";
import logger from "../utils/logger.utils.js";

const redis = new Redis(process.env.REDIS_URL as string);

redis.on("connect", () => {
  logger.info({ message: "Redis client connected" });
});

redis.on("ready", () => {
  logger.info({ message: "Redis is ready to use" });
});

redis.on("error", (error) => {
  logger.error({ message: `Redis connection error`, error });
});

redis.on("close", () => {
  logger.info({ message: "Redis connection closed" });
});

export default redis;
