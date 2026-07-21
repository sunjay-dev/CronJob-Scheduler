import { z } from "zod";

const envSchema = z.object({
  MONGO_DB_URI: z.string().url(),
  REDIS_URL: z.string().url().optional(),

  PORT: z.coerce.number().default(3002),
  MONGO_DB_COLLECTION: z.string().default("agendaJobs"),
  MAX_FAILS_ALLOWED: z.coerce.number().default(10),

  ENABLE_EMAIL_SERVICE: z.coerce.boolean().default(false),
  EMAIL_SERVICE_URL: z.string().default("http://localhost:3001"),
  EMAIL_SERVICE_SECRET: z.string().default(""),
  QSTASH_TOKEN: z.string().default(""),

  APP_JOB_NAME: z.string().default("runner"),
  PROMETHEUS_SECRET: z.string().default(""),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = parsed.data;

export default env;
