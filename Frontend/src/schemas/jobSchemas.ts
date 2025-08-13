import { z } from "zod";
import validator from "validator"
import { isValidCron } from "cron-validator";

export const jobSchema = z.object({
    name: z.string().trim().min(1, { message: "Please provide a job name" }),
    url: z.string().refine(val =>
        validator.isURL(val, { require_protocol: true}),
        { message: "Please provide a valid url" }
    ),
    timezone: z.string().min(1, { message: "Please provide a valid timezone" }),
    enabled: z.boolean({ message: "Enabled must be a boolean" }),
    method: z.string().toUpperCase().refine((val) =>
        ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH", "TRACE"].includes(val),
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