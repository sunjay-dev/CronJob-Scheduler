import { Request, Response, NextFunction } from "express";
import logsModels from "../models/logs.models";
import { ObjectId } from "mongodb";

export const handleUserLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.user;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const [logs, total] = await Promise.all([
      logsModels.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      logsModels.countDocuments({ userId })
    ]);

    res.status(200).json({
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("Error while fetching user logs", error);
    res.status(500).json({ message: "Error while fetching user logs" });
  }
};

export const handleJobLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { jobId } = req.params
  const { userId } = req.user;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

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
    const [logs, total] = await Promise.all([
      logsModels.find({ userId, jobId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      logsModels.countDocuments({ userId, jobId })
    ]);
    res.status(200).json({
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("Error while fetching user logs", error)
    res.status(500).json({ message: "Error while fetching user logs" });
  }
}

export const handleFailedLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const { jobId } = req.params;
  const { userId } = req.user;

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
    const logs = await logsModels.find({
      jobId: jobId,
      userId: userId,
      status: "failed"
    });
    res.status(200).json(logs);
  } catch (error) {
    console.log("Error while fetching failed logs", error);
    res.status(500).json({ message: "Error while fetching failed logs" });
  }
}