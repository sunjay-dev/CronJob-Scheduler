import { z } from "zod";
import { isValidCron } from "cron-validator";
import validator from "validator";
import mongoose from "mongoose";

export const jobIdSchema = z.object({
  jobId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Please provide a valid jobId",
  }),
});

export const jobStatusSchema = z.object({
  jobId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Please provide a valid jobId",
  }),
  status: z.boolean("Please provide status"),
});

export const jobSchema = z.object({
  name: z.string().trim().min(1, { message: "Please provide a name" }),
  url: z.string().refine((val) => validator.isURL(val, { require_protocol: true }), { message: "Please provide a valid url" }),
  timezone: z.string().min(1, { message: "Please provide a valid timezone" }),
  enabled: z.boolean({ message: "Enabled must be a boolean" }),
  method: z
    .string()
    .toUpperCase()
    .refine((val) => ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH", "TRACE"].includes(val), {
      message: "Please provide a valid method type",
    }),
  email: z.boolean({ message: "Please provide email as boolean" }),
  cron: z.string().refine((val) => isValidCron(val, { seconds: true }), { message: "Please provide a valid cron expression" }),
  body: z.string({ message: "Body must be provided as string" }).max(10000, { message: "Body cannot be longer than 10,000 characters" }),
  timeout: z.number().refine((val) => val >= 1 && val <= 30, { message: "Timout must be between 1-30 seconds" }),
  headers: z
    .array(
      z.object({
        key: z.string({ message: "Header key must be a string" }),
        value: z.string({ message: "Header value must be a string" }),
      }),
    )
    .default([]),
});
