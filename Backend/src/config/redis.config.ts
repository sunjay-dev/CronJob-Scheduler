import Redis from "ioredis";
import logger from "../utils/logger.utils";
const redis = new Redis({
  host: process.env.REDIS_HOST!,
  port: Number(process.env.REDIS_PORT!),
  username: process.env.REDIS_USERNAME!,
  password: process.env.REDIS_PASSWORD!,
  tls: {}
});

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