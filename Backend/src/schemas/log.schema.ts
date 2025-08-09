import { z } from "zod";
import { ObjectId } from "mongodb";

export const jobLogsParamsSchema = z.object({
  jobId: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Please provide a valid jobId",
  }),
});
export const LogIdSchema = z.object({
  logId: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Please provide a valid logId",
  }),
});
