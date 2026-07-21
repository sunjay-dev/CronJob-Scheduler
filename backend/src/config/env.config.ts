import { z } from "zod";

const envSchema = z.object({
  MONGO_DB_URI: z.string().url(),
  REDIS_URL: z.string().url(),

  MONGO_DB_COLLECTION: z.string().default("agendaJobs"),
  JWT_SECRET: z.string().min(1),
  CLIENT_URL: z.string().url().default("http://localhost:5173"),
  PORT: z.coerce.number().default(3000),

  GOOGLE_CLIENT_ID: z.string().default(""),
  GOOGLE_CLIENT_SECRET: z.string().default(""),
  GOOGLE_CALLBACK_URL: z.string().default("http://localhost:3000/auth/google/callback"),

  ENABLE_EMAIL_SERVICE: z.coerce.boolean().default(false),
  EMAIL_SERVICE_URL: z.string().default("http://localhost:3001"),
  EMAIL_SERVICE_SECRET: z.string().default(""),
  QSTASH_TOKEN: z.string().default(""),

  PROMETHEUS_SECRET: z.string().default(""),
  APP_JOB_NAME: z.string().default("backend"),

  OTEL_TRACING_ENABLED: z.coerce.boolean().default(false),
  OTEL_SERVICE_NAME: z.string().default("backend"),
  OTEL_TRACES_EXPORTER: z.string().default("otlp"),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().default("http://localhost:4318"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = parsed.data;

export default env;
