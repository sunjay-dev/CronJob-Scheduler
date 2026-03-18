import agenda from "../agenda.js";
import logsModel from "../../models/logs.models.js";
import userModel from "../../models/user.models.js";
import { queueEmail } from "../../utils/qstashEmail.utils.js";

import got, { HTTPError, OptionsOfBufferResponseBody, RequestError, TimeoutError } from "got";
import type { Job } from "agenda";

interface HttpRequestJobData {
  name: string;
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS" | "HEAD" | "PATCH" | "TRACE";
  headers?: Record<string, string>;
  userId: string;
  jobId?: string;
  body: string;
  errorCount: number;
  cooldownUntil?: number;
  timeout: number;
  email: boolean;
}

const MAX_FAILS_ALLOWED = Number(process.env.MAX_FAILS_ALLOWED) || 10;

agenda.define("http-request", { concurrency: 5 }, async (job: Job<HttpRequestJobData>) => {
  const { _id, data } = job.attrs;
  const { name, url, method, headers, userId, body, timeout, email } = data;

  const jobId = data.jobId || _id.toString();

  const methodsWithBody: OptionsOfBufferResponseBody["method"][] = ["POST", "PUT", "PATCH"];
  const requestOptions: OptionsOfBufferResponseBody = {
    method,
    headers: {
      "user-agent": "CronJon/1.0 (+https://www.cronjon.site)",
      ...headers,
    },
    throwHttpErrors: true,
    responseType: "buffer",
    decompress: false,
    retry: { limit: 0 },
    timeout: { request: 1000 * timeout },
  };

  if (body && methodsWithBody.includes(method)) {
    requestOptions.body = body;
  }

  try {
    const response = await got(url, requestOptions);

    const {
      dns = 0,
      tcp = 0,
      tls = 0,
      request: send = 0,
      firstByte = 0,
      download = 0,
      total = 0,
    } = response?.timings?.phases || {};

    await logsModel.create({
      name,
      jobId,
      userId,
      url,
      method,
      timeout,
      status: "success",
      response: response.statusMessage,
      statusCode: response.statusCode,
      responseTime: {
        DNS: dns,
        Connect: tcp,
        SSL: tls,
        Send: send,
        Wait: firstByte,
        Receive: download,
        Total: total,
      },
    });

    job.attrs.data.errorCount = 0;
    await job.save();
  } catch (err: unknown) {
    job.attrs.data.errorCount += 1;

    let statusCode = 0;
    let timings = {} as Record<string, number>;
    let errorMessage = "Unknown error";

    if (err instanceof HTTPError) {
      statusCode = err.response.statusCode;
      timings = err.response.timings?.phases ?? {};
      errorMessage = err.response?.statusMessage ?? err.message;
    } else if (err instanceof TimeoutError) {
      errorMessage = "Request timed out";
    } else if (err instanceof RequestError || err instanceof Error) {
      errorMessage = err.message;
    } else {
      console.error("Unknown error type in http-request job:", err);
    }

    if (job.attrs.data.errorCount >= MAX_FAILS_ALLOWED) {
      job.attrs.disabled = true;

      const now = Date.now();
      if (!job.attrs.data.cooldownUntil || job.attrs.data.cooldownUntil < now) {
        const user = await userModel.findById(userId);
        if (user && email && user.emailNotifications) {
          await queueEmail({
            name: user.name,
            email: user.email,
            template: "JOB_FAILED",
            data: {
              jobName: name,
              url,
              method,
              error: errorMessage,
              lastRunAt: new Date(now),
            },
          });
        }
        job.attrs.data.cooldownUntil = now + 3 * 24 * 60 * 60 * 1000; // 3 days cooldown
      }
    }

    try {
      await logsModel.create({
        name,
        jobId,
        userId,
        url,
        method,
        timeout,
        status: "failed",
        statusCode,
        response: errorMessage,
        responseTime: {
          DNS: timings.dns ?? 0,
          Connect: timings.tcp ?? 0,
          SSL: timings.tls ?? 0,
          Send: timings.request ?? 0,
          Wait: timings.firstByte ?? 0,
          Receive: timings.download ?? 0,
          Total: timings.total ?? 0,
        },
      });
    } catch (logError) {
      console.error("Failed to save failure log:", logError);
    }

    await job.save();
  }
});
