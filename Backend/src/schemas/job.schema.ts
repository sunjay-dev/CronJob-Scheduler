import { z } from "zod";
import { ObjectId } from "mongodb";
import { isValidCron } from "cron-validator";
import validator from "validator";

export const jobIdSchema = z.object({
    jobId: z.string().refine((val) => ObjectId.isValid(val), {
        message: "Please provide a valid jobId",
    }),
});

export const jobStatusSchema = z.object({
    jobId: z.string().refine((val) => ObjectId.isValid(val), {
        message: "Please provide a valid jobId",
    }),
    status: z.boolean("Please provide status")
});

export const jobSchema = z.object({
    name: z.string().min(1, { message: "Please provide a name" }),
    url: z.string().refine(val =>
        validator.isURL(val, { require_protocol: true}),
        { message: "Please provide a valid URL" }
    ),
    timezone: z.string().min(1, { message: "Please provide a valid timezone" }),
    enabled: z.boolean({ message: "Enabled must be a boolean" }),
    method: z.string().toUpperCase().refine((val) =>
        ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "CONNECT", "PATCH", "TRACE"].includes(val),
        { message: "Please provide a valid method type" }
    ),
    cron: z.string().refine((val) => isValidCron(val, { seconds: true }), { message: "Please provide a valid cron expression" }),
    body: z.string({ message: "Body must be provided as string" }),
    headers: z
        .array(
            z.object({
                key: z.string({ message: "Header key must be a string" }),
                value: z.string({ message: "Header value must be a string" }),
            })
        )
        .default([])
});