import { z } from "zod";
import mongoose from "mongoose";

export const jobLogsParamsSchema = z.object({
  jobId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Please provide a valid jobId",
  }),
});
export const LogIdSchema = z.object({
  logId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Please provide a valid logId",
  }),
});

export const logQuerySchema = z.object({
  status: z.enum(["success", "failed"]).optional(),
  method: z
    .string()
    .transform((val) => val.toUpperCase())
    .pipe(z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]))
    .optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 10))
    .pipe(z.number().max(100)),
});
