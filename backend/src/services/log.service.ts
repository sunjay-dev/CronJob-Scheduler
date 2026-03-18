import logsModels from "../models/logs.models.js";
import mongoose from "mongoose";
import redis from "../config/redis.config.js";
import { NotFoundError } from "../utils/appError.utils.js";
import { GetLogsParams } from "../types/log.types.js";

export const fetchLogs = async ({ userId, jobId, page = 1, limit = 10, status, method }: GetLogsParams) => {
  const skip = (page - 1) * limit;

  const query: { userId: string; jobId?: string; status?: string; method?: string } = { userId };
  if (jobId) query.jobId = jobId;
  if (status) query.status = status;
  if (method) query.method = method.toUpperCase();

  const [logs, total] = await Promise.all([
    logsModels.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    logsModels.countDocuments(query),
  ]);

  return {
    logs,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const fetchLogById = async (logId: string, userId: string) => {
  const log = await logsModels.findOne({ _id: new mongoose.Types.ObjectId(logId), userId }).lean();

  if (!log) {
    throw new NotFoundError("No Log found");
  }

  return log;
};

export const fetchLogInsights = async (userId: string) => {
  const cached = await redis.get(`logsInsights_${userId}`);
  if (cached) {
    return JSON.parse(cached);
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
  return insights;
};
