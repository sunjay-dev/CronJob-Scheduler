import { Request, Response, NextFunction } from "express";
import logsModels from "../models/logs.models";
import mongoose from "mongoose";
import { InternalServerError, NotFoundError } from "../utils/AppError";

export const handleUserLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.jwtUser;
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
    next(new InternalServerError("Error while fetching user logs"));
  }
};

export const handleJobLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { jobId } = req.params;
  const { userId } = req.jwtUser;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

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
    next(new InternalServerError("Error while fetching user logs"));
  }
}

export const handleFailedLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const { jobId } = req.params;
  const { userId } = req.jwtUser;

  try {
    const logs = await logsModels.find({
      jobId: jobId,
      userId: userId,
      status: "failed"
    });
    res.status(200).json(logs);
  } catch (error) {
    next(new InternalServerError("Error while fetching failed logs"));
  }
}

export const handleGetLogById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.jwtUser;
  const { logId } = req.params;

  try {
    const log = await logsModels.findOne({ _id: new mongoose.Types.ObjectId(logId), userId });

    if (!log) {
      return next(new NotFoundError("No Log found"));
    }

    res.status(200).json(log);

  } catch (error) {
    next(new InternalServerError("Error while fetching log by Id"));
  }
}