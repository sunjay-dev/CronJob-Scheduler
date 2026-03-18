import type { Request, Response } from "express";
import * as logService from "../services/log.service.js";

export const handleUserLogs = async (req: Request, res: Response) => {
  const { userId } = req.jwtUser;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const { status, method } = req.query;

  const data = await logService.fetchLogs({
    userId,
    page,
    limit,
    status: status as string | undefined,
    method: method as string | undefined,
  });
  res.status(200).json(data);
};

export const handleJobLogs = async (req: Request, res: Response) => {
  const { jobId } = req.params;
  const { userId } = req.jwtUser;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const { status, method } = req.query;

  const data = await logService.fetchLogs({
    userId,
    jobId,
    page,
    limit,
    status: status as string | undefined,
    method: method as string | undefined,
  });
  res.status(200).json(data);
};

export const handleGetLogById = async (req: Request, res: Response) => {
  const { userId } = req.jwtUser;
  const { logId } = req.params;

  const log = await logService.fetchLogById(logId, userId);
  res.status(200).json(log);
};

export const handleGetLast24hoursLog = async (req: Request, res: Response) => {
  const { userId } = req.jwtUser;

  const insights = await logService.fetchLogInsights(userId);
  res.status(200).json(insights);
};
