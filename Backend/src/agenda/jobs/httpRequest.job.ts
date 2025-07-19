import agenda from "../agenda";
import logsModel from "../../models/logs.models";
import { Job } from "agenda";
import got from 'got';

interface HttpRequestJobData {
  name: string;
  url: string;
  method: "GET" | "POST";
  headers?: Record<string, string>;
  userId: string;
  jobId?: string;
}

agenda.define("http-request", { concurrency: 5 }, async (job: Job<HttpRequestJobData>) => {
  const { _id, data } = job.attrs;
  const { name, url, method, headers, userId } = data;

  const jobId = data.jobId || _id.toString();

  try {
    const response = await got(url, {
      method,
      headers,
      throwHttpErrors: false,
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
      status: response.statusCode >= 200 && response.statusCode < 300 ? "success" : "failed",
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

  } catch (err: any) {
    
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
    } catch (logErr) {
      console.error("Failed to save log to DB:", logErr);
    }
  }
});
