import { Request, Response, NextFunction } from "express";
import agenda from "../agenda/agenda";
import { ObjectId } from 'mongodb';
import logsModels from "../models/logs.models";

export const handleNewCronJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name, url, method, headers, body, cron, timezone, enabled } = req.body;
  const { userId } = req.jwtUser;

  const headersObj = Array.isArray(headers) ? headers.reduce((acc, { key, value }) => {
    if (key && value) acc[key] = value;
    return acc;
  }, {})
    : {};

  let payload = { name, url, method, headers: headersObj, userId } as any;

  if (body && body.trim() !== "") {
    const allowedMethods = ['POST', 'PUT', 'PATCH'];

    if (!allowedMethods.includes(method.toUpperCase())) {
      res.status(400).json({
        message: `Method ${method} should not include a body.`,
      });
      return;
    }

    if (body.length > 10000) {
      res.status(413).json({ message: 'Body too large.' });
      return;
    }

    const contentType = headersObj['Content-Type'] || headersObj['content-type'];

    if (contentType === 'application/json') {
      try {
        JSON.parse(body);
      } catch (error) {
        res.status(400).json({ message: 'Invalid JSON in body.' });
        return;
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
    console.error("Error while creating new job", error)
    res.status(500).json({ message: "Error while creating new job" });
  }
}

export const handleUserJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.jwtUser;
  try {
    const jobs = await agenda.jobs({ 'data.userId': userId });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error while fetching user jobs", error)
    res.status(500).json({ message: "Error while fetching user jobs" });
  }
}

export const handleUserJobById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { jobId } = req.params;
  const { userId } = req.jwtUser;

  try {
    const jobs = await agenda.jobs({ 'data.userId': userId, _id: new ObjectId(jobId) });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error while fetching user job by Id", error)
    res.status(500).json({ message: "Error while fetching user job by Id" });
  }
}

export const handleJobStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.jwtUser;
  const { jobId, status } = req.body;

  try {
    const jobs = await agenda.jobs({ 'data.userId': userId, _id: new ObjectId(jobId as string) });

    if (jobs.length === 0) {
      res.status(404).json({
        message: "No Job found"
      });
      return;
    }

    const job = jobs[0];
    status ? job.enable() : job.disable();
    await job.save();

    res.status(200).json({ message: `Job ${status ? "enabled" : "disabled"}`, status });
  } catch (error) {
    console.error("Server error while updating job status", error)
    res.status(500).json({ message: "Server error while updating job status" });
  }
}

export const handleDeleteJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { jobId } = req.params;
  const { userId } = req.jwtUser;

  try {
    const result = await agenda.cancel({ _id: new ObjectId(jobId), 'data.userId': userId })

    if (result === 0) {
      res.status(400).json({
        message: "No Job found"
      });
      return;
    }

    await logsModels.deleteMany({ jobId });

    res.status(200).json({
      message: "Job deleted",
      job: result,
      jobId
    });

  } catch (error) {
    console.error("Error while deleting job", error);
    res.status(500).json({ message: "Error while deleting job" });
  }
}

export const handleRunJobNow = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.jwtUser;
  const { jobId } = req.body;

  try {
    const jobs = await agenda.jobs({ _id: new ObjectId(jobId as string), 'data.userId': userId });

    if (jobs.length === 0) {
      res.status(404).json({ message: "Job not found" });
      return;
    }

    const job = jobs[0];
    const data = job.attrs.data;

    await agenda.now(job.attrs.name, {
      ...data,
      jobId: job.attrs._id.toString(),
    });

    res.status(200).json({ message: "Job executed immediately" });

  } catch (error) {
    console.error("Error while running job now", error);
    res.status(500).json({ message: "Error while running job now" });
  }
}

export const handleJobEdit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { jobId } = req.params;
  const { userId } = req.jwtUser;

  const { name, url, method, headers, body, cron, timezone, enabled } = req.body;

  const headersObj = Array.isArray(headers) ? headers.reduce((acc, { key, value }) => {
    if (key && value) acc[key] = value;
    return acc;
  }, {})
    : {};

  let payload = { name, url, method, headers: headersObj, userId } as any;

  if (body && body.trim() !== "") {
    const allowedMethods = ['POST', 'PUT', 'PATCH'];

    if (!allowedMethods.includes(method.toUpperCase())) {
      res.status(400).json({
        message: `Method ${method} should not include a body.`,
      });
      return;
    }

    if (body.length > 10000) {
      res.status(413).json({ message: 'Body too large.' });
      return;
    }

    const contentType = headersObj['Content-Type'] || headersObj['content-type'];

    if (contentType === 'application/json') {
      try {
        JSON.parse(body);
      } catch (error) {
        res.status(400).json({ message: 'Invalid JSON in body.' });
        return;
      }
    }
  }

  payload.body = body.trim();

  try {
    const jobs = await agenda.jobs({ 'data.userId': userId, _id: new ObjectId(jobId) });

    if (jobs.length === 0) {
      res.status(404).json({
        message: "No Job found"
      });
      return;
    }

    const job = jobs[0];

    job.attrs.data = payload;
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
    console.error("Server error while editing job", error)
    res.status(500).json({ message: "Server error while editing job" });
  }
}