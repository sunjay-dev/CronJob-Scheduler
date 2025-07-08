import { Request, Response, NextFunction } from "express";
import logsModels from "../models/logs.models";

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