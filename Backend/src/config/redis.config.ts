import Redis from "ioredis";
import logger from "../utils/logger.utils";

const redis = new Redis(process.env.REDIS_URL!);

redis.on("connect", () => {
  logger.info("Redis client connected");
});

redis.on("ready", () => {
  logger.info("Redis is ready to use");
});

redis.on("error", (err) => {
  logger.error(`Redis connection error: ${err}`);
});

redis.on("close", () => {
  logger.info("Redis connection closed");
});

export default redis;
