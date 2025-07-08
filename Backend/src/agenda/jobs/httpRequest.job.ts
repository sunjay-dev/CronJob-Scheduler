import agenda from "../agenda";
import logsModel from "../../models/logs.models";
import { Job } from "agenda";

interface HttpRequestJobData {
  url: string;
  method: "GET" | "POST";
  headers?: Record<string, string>;
  userId: string;
}

agenda.define("http-request", {concurrency: 5}, async (job: Job<HttpRequestJobData>) => {
  const { _id, data } = job.attrs;
  const { url, method, headers, userId } = data;

  try {
    const res = await fetch(url, { method, headers });
    await logsModel.create({
      jobId: _id.toString(),
      userId,
      url,
      method,
      status: res.ok ? "success" : "error",
      statusCode: res.status
    });
  } catch (err: any) {
    console.log(err);
    await logsModel.create({
      jobId: _id.toString(),
      userId,
      url,
      method,
      status: "error",
      statusCode: null,
      response: err?.message || "Unknown error"
    });
  }
});