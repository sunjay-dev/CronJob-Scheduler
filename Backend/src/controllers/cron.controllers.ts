import { Request, Response, NextFunction } from "express";
import { isValidCron } from 'cron-validator';
import { ObjectId } from 'mongodb';
import agenda from "../agenda/agenda";
import logsModels from "../models/logs.models";

export const handleNewCronJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const { url, method, headers, cron } = req.body;
  const { userId } = req.user;

  if (!url || !method || !cron || !userId) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  if (!isValidCron(cron, { seconds: true })) {
    res.status(400).json({ error: "Invalid cron expression" });
    return;
  }

  const job = agenda.create("http-request", {
    url,
    method,
    headers: headers || {},
    userId,
  });

  job.repeatEvery(cron);
  await job.save();

  console.log("✅ New job scheduled!");
  res.status(200).json(job);
  return;
}

export const handleUserLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.user;
  try {
    const logs = await logsModels.find({ userId });
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error while fetching user logs", error)
    res.status(500).json({ message: "Error while fetching user logs" });
  }
}

export const handleJobLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { jobId } = req.params
  const { userId } = req.user;

  if (!jobId) {
    res.status(400).json({
      message: "Job Id is required"
    });
    return;
  }
  try {
    const logs = await logsModels.find({ userId, jobId });
    res.status(200).json(logs);
    return;
  } catch (error) {
    console.error("Error while fetching user logs", error)
    res.status(500).json({ message: "Error while fetching user logs" });
  }
}

export const handleErrorLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const { jobId } = req.params;
  const { userId } = req.user;

  try {

    const logs = await logsModels.find({
      jobId: jobId,
      userId: userId,
      status: "error"
    });

    res.status(200).json(logs);

  } catch (error) {
    console.log("Error while fetching error logs", error);
    res.status(500).json({ message: "Error while fetching error logs" });
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
      job: result
    });

  } catch (error) {
    console.log("Error while deleting job", error);
    res.status(500).json({ message: "Error while deleting job" });
  }
}