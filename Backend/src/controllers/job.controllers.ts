import { Request, Response, NextFunction } from "express";
import agenda from "../agenda/agenda";
import { isValidCron } from 'cron-validator';
import { ObjectId } from 'mongodb';
import validator from "validator";
import logsModels from "../models/logs.models";

export const handleNewCronJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const { name, url, method, headers, cron, timezone, enabled } = req.body;
  const { userId } = req.user;

  if (!name || !url || !method || !cron || !timezone || enabled === undefined) {
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

  if (typeof timezone !== 'string') {
    res.status(400).json({ error: "timezone must be a string" });
    return
  }
  if (typeof enabled !== 'boolean') {
    res.status(400).json({ error: "enabled must be a boolean" });
    return
  }
  try {
    const job = agenda.create("http-request", {
      name,
      url,
      method,
      headers: headers || {},
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
  const { jobId, status } = req.body;


  if(!jobId || typeof status === "undefined" ){
    res.status(400).json({
      message: "Please Provide both jobId and status"
    })
    return;
  }

  if(typeof status !== "boolean"){
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

    res.status(200).json({ message: `Job ${status ? "enabled" : "disabled"}` });
  } catch (error) {
    console.error("Server error while updating job status", error)
    res.status(500).json({ message: "Server error while updating job status" });
  }
}

export const handleDeleteJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { jobId } = req.params;
  const { userId } = req.user;

  if(!jobId) {
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
    
    await logsModels.deleteMany({jobId});


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