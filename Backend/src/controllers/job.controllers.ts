import { Request, Response, NextFunction } from "express";
import agenda from "../agenda/agenda";
import { isValidCron } from 'cron-validator';
import { ObjectId } from 'mongodb';
import validator from "validator";

export const handleNewCronJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const { url, method, headers, cron } = req.body;
  const { userId } = req.user;

  if (!url || !method || !cron || !userId) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  if (typeof url !== 'string') {
    res.status(400).json({ error: "url must be a string" });
    return
  }

  if (!validator.isURL(url, { protocols: ['http', 'https'], require_protocol: true })) {
    res.status(400).json({ error: "Invalid url" });
    return;
  }

  if (typeof cron !== 'string') {
    res.status(400).json({ error: "url must be a string" });
    return
  }

  if (!isValidCron(cron, { seconds: true })) {
    res.status(400).json({ error: "Invalid cron expression" });
    return;
  }

  if (typeof method !== 'string') {
    res.status(400).json({ error: "Method must be a string" });
    return
  }

  if (!['GET', 'POST', 'PUT', 'DELETE'].includes(method.toUpperCase())) {
    res.status(400).json({ error: "Invalid method type" });
    return;
  }

  try {
    const job = agenda.create("http-request", {
      url,
      method,
      headers: headers || {},
      userId,
    });

    job.repeatEvery(cron);
    await job.save();

    res.status(200).json(job);
  } catch (error) {
    console.error("Error while creating new job", error)
    res.status(500).json({ message: "Error while creating new job" });
  }
}

export const handleUserJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.user;
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
  const { userId } = req.user;
  try {
    const jobs = await agenda.jobs({ 'data.userId': userId, _id: new ObjectId(jobId) });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error while fetching user job by Id", error)
    res.status(500).json({ message: "Error while fetching user job by Id" });
  }
}

export const handleJobStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.user;
  const { jobId, enable } = req.body;

  try {
    const jobs = await agenda.jobs({ 'data.userId': userId, _id: new ObjectId(jobId) });

    if (jobs.length === 0) {
      res.status(404).json({
        message: "No Job found"
      });
      return;
    }

    const job = jobs[0];
    enable ? job.enable() : job.disable();
    await job.save();

    res.status(200).json({ message: `Job ${enable ? "enabled" : "disabled"}` });
  } catch (error) {
    console.error("Server error while updating job status", error)
    res.status(500).json({ message: "Server error while updating job status" });
  }
}

export const handleDeleteJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { jobId } = req.params;
  const { userId } = req.user;
  try {
    const result = await agenda.cancel({ _id: new ObjectId(jobId), 'data.userId': userId })

    if (result === 0) {
      res.status(400).json({
        message: "No Job found"
      });
      return;
    }

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
  const { userId } = req.user;
  const { jobId } = req.body;

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