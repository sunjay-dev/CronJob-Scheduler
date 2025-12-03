import type { Request, Response, NextFunction } from "express";
import logsModels from "../models/logs.models";
import mongoose from "mongoose";
import { InternalServerError, NotFoundError } from "../utils/appError.utils";
import redis from "../config/redis.config";

export const handleUserLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.jwtUser;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const [logs, total] = await Promise.all([
      logsModels.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      logsModels.countDocuments({ userId }),
    ]);

    res.status(200).json({
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
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
      logsModels.find({ userId, jobId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      logsModels.countDocuments({ userId, jobId }),
    ]);
    res.status(200).json({
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(new InternalServerError("Error while fetching user logs"));
  }
};

export const handleFailedLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { jobId } = req.params;
  const { userId } = req.jwtUser;

  try {
    const logs = await logsModels
      .find({
        jobId: jobId,
        userId: userId,
        status: "failed",
      })
      .lean();
    res.status(200).json(logs);
  } catch (error) {
    next(new InternalServerError("Error while fetching failed logs"));
  }
};

export const handleGetLogById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.jwtUser;
  const { logId } = req.params;

  try {
    const log = await logsModels.findOne({ _id: new mongoose.Types.ObjectId(logId), userId }).lean();

    if (!log) {
      return next(new NotFoundError("No Log found"));
    }

    res.status(200).json(log);
  } catch (error) {
    next(new InternalServerError("Error while fetching log by Id"));
  }
};

export const handleGetLast24hoursLog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.jwtUser;

  try {
    const cached = await redis.get(`logsInsights_${userId}`);
    if (cached) {
      res.status(200).json(JSON.parse(cached));
      return;
    }

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const insights = await logsModels
      .aggregate([
        { $match: { createdAt: { $gte: since }, userId } },
        {
          $group: {
            _id: {
              hour: {
                $dateTrunc: { date: "$createdAt", unit: "hour" },
              },
              status: "$status",
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: "$_id.hour",
            counts: {
              $push: {
                status: "$_id.status",
                count: "$count",
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .allowDiskUse(true);

    await redis.set(`logsInsights_${userId}`, JSON.stringify(insights), "EX", 60);
    res.status(200).json(insights);
  } catch (error) {
    next(new InternalServerError("Error while fetching log insights"));
  }
};
