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
