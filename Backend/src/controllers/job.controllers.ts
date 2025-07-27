import { Request, Response, NextFunction } from "express";
import agenda from "../agenda/agenda";
import { isValidCron } from 'cron-validator';
import { ObjectId } from 'mongodb';
import validator from "validator";
import logsModels from "../models/logs.models";

export const handleNewCronJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const { name, url, method, headers, cron, timezone, enabled } = req.body;
  const { userId } = req.jwtUser;

  const headersObj = Array.isArray(headers) ? headers.reduce((acc, { key, value }) => {
      if (key && value) acc[key] = value;
      return acc;
    }, {})
  : {};

  try {
    const job = agenda.create("http-request", {
      name,
      url,
      method,
      headers: headersObj,
      userId,
    });

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

  if (!jobId) {
    res.status(400).json({
      message: "field jobId is required"
    })
    return;
  }

  if (!ObjectId.isValid(jobId)) {
    res.status(400).json({
      message: "Invalid jobId"
    });
    return;
  }

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


  if (!jobId || typeof status === "undefined") {
    res.status(400).json({
      message: "Please Provide both jobId and status"
    })
    return;
  }

  if (!ObjectId.isValid(jobId)) {
    res.status(400).json({
      message: "Invalid jobId"
    });
    return;
  }

  if (typeof status !== "boolean") {
    res.status(400).json({
      message: "status must be a boolean"
    })
    return;
  }

  try {
    const jobs = await agenda.jobs({ 'data.userId': userId, _id: new ObjectId(jobId) });

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

  if (!jobId) {
    res.status(400).json({
      message: "Field jobId is required."
    });
    return;
  }

  if (!ObjectId.isValid(jobId)) {
    res.status(400).json({ message: "Invalid jobId" });
    return;
  }

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
    console.log("Error while deleting job", error);
    res.status(500).json({ message: "Error while deleting job" });
  }
}

export const handleRunJobNow = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.jwtUser;
  const { jobId } = req.body;

  if (!jobId) {
    res.status(400).json({
      message: "field jobId is required"
    })
    return;
  }

  if (!ObjectId.isValid(jobId)) {
    res.status(400).json({
      message: "Invalid jobId"
    });
    return;
  }

  try {
    const jobs = await agenda.jobs({ _id: new ObjectId(jobId), 'data.userId': userId });

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
    console.log("Error while running job now", error);
    res.status(500).json({ message: "Error while running job now" });
  }
}

export const handleJobEdit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { jobId } = req.params;
  const { userId } = req.jwtUser;

  const {name, url, method, headers, body, cron, timezone, enabled } = req.body;

  const headersObj = Array.isArray(headers) ? headers.reduce((acc, { key, value }) => {
      if (key && value) acc[key] = value;
      return acc;
    }, {})
  : {};

  try {
    const jobs = await agenda.jobs({ 'data.userId': userId, _id: new ObjectId(jobId) });

    if (jobs.length === 0) {
      res.status(404).json({
        message: "No Job found"
      });
      return;
    }

    const job = jobs[0];

    job.attrs.data = {
      ...job.attrs.data,
      name,
      url,
      method,
      headers: headersObj,
      body,
    };

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