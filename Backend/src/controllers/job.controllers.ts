import { Request, Response, NextFunction } from "express";
import agenda from "../agenda/agenda";
import logsModels from "../models/logs.models";
import mongoose from "mongoose";
import { BadRequestError, InternalServerError, NotFoundError } from "../utils/AppError";

function getHeaderObj(headers: any[]) {

  return headers.reduce((acc, { key, value }) => {
    const trimmedKey = key?.trim();
    const trimmedValue = value?.trim();

    if (trimmedKey && trimmedValue) acc[trimmedKey] = trimmedValue;
    return acc;
  }, {} as Record<string, string>);
}

export const handleNewCronJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name, url, method, headers, body, cron, timezone, enabled, timeout, email } = req.body;
  const { userId } = req.jwtUser;

  const headersObj = Array.isArray(headers) ? getHeaderObj(headers) : {};

  let payload = { name, url, method, headers: headersObj, userId, errorCount: 0, timeout, email } as any;

  if (body && body.trim() !== "") {
    const allowedMethods = ['POST', 'PUT', 'PATCH'];

    if (!allowedMethods.includes(method.toUpperCase())) {
      return next(new BadRequestError(`Method ${method} should not include a body.`));
    }

    const contentType = headersObj['Content-Type'] || headersObj['content-type'];

    if (contentType === 'application/json') {
      try {
        JSON.parse(body);
      } catch (error) {
        return next(new BadRequestError('Invalid JSON in body.'));
      }
    }
  }

  payload.body = body.trim();

  try {
    const job = agenda.create("http-request", payload);

    job.repeatEvery(cron, {
      timezone,
      skipImmediate: true
    });

    if (!enabled) {
      job.attrs.disabled = true;
    }
    await job.save();

    res.status(200).json({ message: "Job created successfully", job });
  } catch (error) {
    next(new InternalServerError("Error while creating new job"));
  }
}

export const handleJobEdit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { jobId } = req.params;
  const { userId } = req.jwtUser;

  const { name, url, method, headers, body, cron, timezone, enabled, timeout, email } = req.body;

  const headersObj = Array.isArray(headers) ? getHeaderObj(headers) : {};

  let payload = { name, url, method, headers: headersObj, userId, timeout, email } as any;

  if (body && body.trim() !== "") {
    const allowedMethods = ['POST', 'PUT', 'PATCH'];

    if (!allowedMethods.includes(method.toUpperCase())) {
      return next(new BadRequestError(`Method ${method} should not include a body.`));
    }

    const contentType = headersObj['Content-Type'] || headersObj['content-type'];

    if (contentType === 'application/json') {
      try {
        JSON.parse(body);
      } catch (error) {
        return next(new BadRequestError('Invalid JSON in body.'));
      }
    }
  }

  payload.body = body.trim();

  try {
    const jobs = await agenda.jobs({ 'data.userId': userId, _id: new mongoose.Types.ObjectId(jobId) });

    if (jobs.length === 0) {
      return next(new NotFoundError("No Job found"));
    }

    const job = jobs[0];

    job.attrs.data = {...payload, errorCount: 0 };
    // delete job.attrs.data.cooldownUntil;
    job.attrs.repeatInterval = cron;
    job.attrs.repeatTimezone = timezone;

    job.computeNextRunAt();

    if (enabled === false) {
      job.disable();
    } else {
      job.enable();
    }

    await job.save();

    res.status(200).json({ message: "Job updated successfully", job });
  } catch (error) {
    next(new InternalServerError("Server error while editing job"));
  }
}

export const handleUserJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.jwtUser;
  try {
    const jobs = await agenda.jobs({ 'data.userId': userId });
    res.status(200).json(jobs);
  } catch (error) {
    next(new InternalServerError("Error while fetching user jobs"));
  }
}

export const handleUserJobById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { jobId } = req.params;
  const { userId } = req.jwtUser;

  try {
    const jobs = await agenda.jobs({ 'data.userId': userId, _id: new mongoose.Types.ObjectId(jobId) });
    res.status(200).json(jobs);
  } catch (error) {
    next(new InternalServerError("Error while fetching user job by Id"));
  }
}

export const handleJobStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.jwtUser;
  const { jobId, status } = req.body;

  try {
    const jobs = await agenda.jobs({ 'data.userId': userId, _id: new mongoose.Types.ObjectId(jobId as string) });

    if (jobs.length === 0) {
      return next(new NotFoundError("No Job found"));
    }

    const job = jobs[0];
    status ? job.enable() : job.disable();
    job.attrs.data.errorCount = 0;
    // delete job.attrs.data.cooldownUntil;
    await job.save();

    res.status(200).json({ message: `Job ${status ? "enabled" : "disabled"}`, status });
  } catch (error) {
    next(new InternalServerError("Server error while updating job status"));
  }
}

export const handleDeleteJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { jobId } = req.params;
  const { userId } = req.jwtUser;

  try {
    const result = await agenda.cancel({ _id: new mongoose.Types.ObjectId(jobId), 'data.userId': userId })

    if (result === 0) {
      return next(new NotFoundError("No Job found"));
    }

    await logsModels.deleteMany({ jobId });

    res.status(200).json({
      message: "Job deleted",
      job: result,
      jobId
    });

  } catch (error) {
    next(new InternalServerError("Error while deleting job"));
  }
}

export const handleRunJobNow = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.jwtUser;
  const { jobId } = req.body;

  try {
    const jobs = await agenda.jobs({ _id: new mongoose.Types.ObjectId(jobId as string), 'data.userId': userId });

    if (jobs.length === 0) {
      return next(new NotFoundError("Job not found"));
    }

    const job = jobs[0];
    const data = job.attrs.data;

    await agenda.now(job.attrs.name, {
      ...data,
      jobId: job.attrs._id.toString(),
    });

    res.status(200).json({ message: "Job executed immediately" });

  } catch (error) {
    next(new InternalServerError("Error while running job now"));
  }
}