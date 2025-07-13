import agenda from "../agenda";
import logsModel from "../../models/logs.models";
import { Job } from "agenda";

interface HttpRequestJobData {
  name: string;
  url: string;
  method: "GET" | "POST";
  headers?: Record<string, string>;
  userId: string;
  jobId?: string;
}

agenda.define("http-request", {concurrency: 5}, async (job: Job<HttpRequestJobData>) => {
  const { _id, data } = job.attrs;
  const { name, url, method, headers, userId } = data;
  
  const jobId = data.jobId ||  _id.toString();
  try {
    const res = await fetch(url, { method, headers });
    await logsModel.create({
      name,
      jobId,
      userId,
      url,
      method,
      status: res.ok ? "success" : "failed",
      statusCode: res.status
    });
    
  } catch (err: any) {
    console.log(err);
    await logsModel.create({
      name,
      jobId,
      userId,
      url,
      method,
      status: "failed",
      response: err?.message || "Unknown error"
    });
  }
});