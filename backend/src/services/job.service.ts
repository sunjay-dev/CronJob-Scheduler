import agenda from "../config/agenda.config.js";
import logsModels from "../models/logs.models.js";
import mongoose from "mongoose";
import { NotFoundError } from "../utils/appError.utils.js";
import { JobPayload } from "@/types/job.types.js";

export const createJobAction = async (payload: JobPayload, cron: string, timezone: string, enabled: boolean) => {
  const job = agenda.create("http-request", payload);

  job.repeatEvery(cron, {
    timezone,
    skipImmediate: true,
  });

  if (!enabled) {
    job.attrs.disabled = true;
  }
  await job.save();

  return job;
};

export const editJobAction = async (
  jobId: string,
  userId: string,
  payload: JobPayload,
  cron: string,
  timezone: string,
  enabled: boolean,
) => {
  const jobs = await agenda.jobs({
    "data.userId": userId,
    _id: new mongoose.Types.ObjectId(jobId),
  });

  if (jobs.length === 0) {
    throw new NotFoundError("No Job found");
  }

  const job = jobs[0];

  job.attrs.data = { ...job.attrs.data, ...payload, errorCount: 0 };
  job.attrs.repeatInterval = cron;
  job.attrs.repeatTimezone = timezone;

  job.computeNextRunAt();

  if (enabled === false) {
    job.disable();
  } else {
    job.enable();
  }

  await job.save();

  return job;
};

export const fetchUserJobs = async (userId: string) => {
  const jobs = await agenda.jobs({ "data.userId": userId });
  return jobs;
};

export const fetchUserJobById = async (jobId: string, userId: string) => {
  const jobs = await agenda.jobs({
    "data.userId": userId,
    _id: new mongoose.Types.ObjectId(jobId),
  });
  return jobs;
};

export const updateJobState = async (jobId: string, userId: string, status: boolean) => {
  const jobs = await agenda.jobs({
    "data.userId": userId,
    _id: new mongoose.Types.ObjectId(jobId),
  });

  if (jobs.length === 0) {
    throw new NotFoundError("No Job found");
  }

  const job = jobs[0];
  if (status) job.enable();
  else job.disable();

  job.attrs.data.errorCount = 0;
  await job.save();

  return job;
};

export const deleteJobAction = async (jobId: string, userId: string) => {
  const result = await agenda.cancel({
    _id: new mongoose.Types.ObjectId(jobId),
    "data.userId": userId,
  });

  if (result === 0) {
    throw new NotFoundError("No Job found");
  }

  await logsModels.deleteMany({ jobId });

  return result;
};

export const executeJobNow = async (jobId: string, userId: string) => {
  const jobs = await agenda.jobs({
    _id: new mongoose.Types.ObjectId(jobId),
    "data.userId": userId,
  });

  if (jobs.length === 0) {
    throw new NotFoundError("Job not found");
  }

  const job = jobs[0];
  const data = job.attrs.data;

  await agenda.now(job.attrs.name, {
    ...data,
    jobId: job.attrs._id.toString(),
  });

  return job;
};
