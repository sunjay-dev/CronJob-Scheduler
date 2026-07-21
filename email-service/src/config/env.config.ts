import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  RESEND_EMAIL_API_KEY: z.string().min(1),
  SENDEREMAIL: z.email(),
  EMAIL_SERVICE_SECRET: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = parsed.data;

export default env;
