import agenda from "../agenda";
import logsModel from "../../models/logs.models";
import userModel from "../../models/user.models";
import { Job } from "agenda";
import got from 'got';
import { queueEmail } from "../../utils/qstashEmail.util";

interface HttpRequestJobData {
  name: string;
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS" | "HEAD" | "PATCH" | "TRACE";
  headers?: Record<string, string>;
  userId: string;
  jobId?: string;
  body: string;
  errorCount: number
  cooldownUntil?: number;
}

const MAX_ERRORS = 5;

agenda.define("http-request", { concurrency: 5 }, async (job: Job<HttpRequestJobData>) => {
  const { _id, data } = job.attrs;
  const { name, url, method, headers, userId, body } = data;

  const jobId = data.jobId || _id.toString();

  try {
    const response = await got(url, {
      method,
      headers: {
        'user-agent': 'CronJon/1.0 (+https://www.cronjon.site)',
        ...headers,
      },
      body: body || undefined,
      throwHttpErrors: true,
      responseType: 'buffer',
      resolveBodyOnly: false,
      decompress: false,
      retry: 0
    });

    const { dns, tcp, tls, request, firstByte, download, total } = response?.timings?.phases;
    await logsModel.create({
      name,
      jobId,
      userId,
      url,
      method,
      status: "success",
      statusCode: response.statusCode,
      responseTime: {
        DNS: dns || 0,
        Connect: tcp || 0,
        SSL: tls || 0,
        Send: request || 0,
        Wait: firstByte || 0,
        Receive: download || 0,
        Total: total || 0,
      },
    });

    job.attrs.data.errorCount = 0;
    await job.save();

  } catch (err: any) {
    job.attrs.data.errorCount += 1;

    if (job.attrs.data.errorCount >= MAX_ERRORS) {
      job.attrs.disabled = true;

      const now = Date.now();
      if (!job.attrs.data.cooldownUntil || job.attrs.data.cooldownUntil < now) {

        const user = await userModel.findById(userId);
        if(user)
        await queueEmail({ data: {name: user.name,jobName: name, url, method, error: err.message, lastRunAt: new Date(now)}, email: user.email, template: "JOB_COOLDOWN" });

        job.attrs.data.cooldownUntil = now + 3 * 24 * 60 * 60 * 1000;
      }
    }

    const statusCode = err?.response?.statusCode || 0;
    const timings = err?.response?.timings?.phases || {};

    try {
      await logsModel.create({
        name,
        jobId,
        userId,
        url,
        method,
        status: "failed",
        statusCode,
        response: err.message || "Unknown error",
        responseTime: {
          DNS: timings.dns || 0,
          Connect: timings.tcp || 0,
          SSL: timings.tls || 0,
          Send: timings.request || 0,
          Wait: timings.firstByte || 0,
          Receive: timings.download || 0,
          Total: timings.total || 0,
        }
      });
    } catch (logError) {
      console.error("Failed to save log to DB:", logError);
    }
  }
});
