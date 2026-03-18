import type { Request, Response } from "express";
import * as jobService from "../services/job.service.js";
import { JobPayload } from "../types/job.types.js";
import { getHeaderObj, processJobBody } from "../utils/job.utils.js";

export const handleNewCronJobs = async (req: Request, res: Response) => {
  const { name, url, method, headers, body, cron, timezone, enabled, timeout, email } = req.body;
  const { userId } = req.jwtUser;

  const headersObj = Array.isArray(headers) ? getHeaderObj(headers) : {};
  const processedBody = processJobBody(body, method, headersObj);

  const payload: JobPayload = {
    name,
    url,
    method,
    headers: headersObj,
    userId,
    errorCount: 0,
    timeout,
    email,
    body: processedBody,
  };

  const job = await jobService.createJobAction(payload, cron, timezone, enabled);
  res.status(200).json({ message: "Job created successfully", job });
};

export const handleJobEdit = async (req: Request, res: Response) => {
  const { jobId } = req.params;
  const { userId } = req.jwtUser;
  const { name, url, method, headers, body, cron, timezone, enabled, timeout, email } = req.body;

  const headersObj = Array.isArray(headers) ? getHeaderObj(headers) : {};
  const processedBody = processJobBody(body, method, headersObj);

  const payload: JobPayload = {
    name,
    url,
    method,
    headers: headersObj,
    userId,
    timeout,
    email,
    body: processedBody,
  };

  const job = await jobService.editJobAction(jobId, userId, payload, cron, timezone, enabled);
  res.status(200).json({ message: "Job updated successfully", job });
};

export const handleUserJobs = async (req: Request, res: Response) => {
  const { userId } = req.jwtUser;
  const jobs = await jobService.fetchUserJobs(userId);
  res.status(200).json(jobs);
};

export const handleUserJobById = async (req: Request, res: Response) => {
  const { jobId } = req.params;
  const { userId } = req.jwtUser;

  const jobs = await jobService.fetchUserJobById(jobId, userId);
  res.status(200).json(jobs);
};

export const handleJobStatus = async (req: Request, res: Response) => {
  const { userId } = req.jwtUser;
  const { jobId, status } = req.body;

  await jobService.updateJobState(jobId, userId, status);
  res.status(200).json({ message: `Job ${status ? "enabled" : "disabled"}`, status });
};

export const handleDeleteJob = async (req: Request, res: Response) => {
  const { jobId } = req.params;
  const { userId } = req.jwtUser;

  const result = await jobService.deleteJobAction(jobId, userId);
  res.status(200).json({
    message: "Job deleted",
    job: result,
    jobId,
  });
};

export const handleRunJobNow = async (req: Request, res: Response) => {
  const { userId } = req.jwtUser;
  const { jobId } = req.body;

  await jobService.executeJobNow(jobId, userId);
  res.status(200).json({ message: "Job executed immediately" });
};
