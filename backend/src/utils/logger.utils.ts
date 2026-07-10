import pino from "pino";
import { env } from "process";

const isProduction = env.NODE_ENV === "production";

const logger = pino({
  level: env.LOG_LEVEL || "info",
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(!isProduction && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
      },
    },
  }),
});

export default logger;
