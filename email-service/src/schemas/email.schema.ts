import {z} from 'zod';

export const emailSchema = z.object({
  email: z.email(),
  name: z.string().trim().min(1, { message: "Please provide name" }),
  template: z.enum(["FORGOT_PASSWORD", "JOB_FAILED", "EMAIL_VERIFY"]),
  data: z.record(z.string(), z.any()).optional()
});

export type EmailSchema = z.infer<typeof emailSchema>;