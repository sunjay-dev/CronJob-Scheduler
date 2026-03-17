import { Router } from "express";
const router = Router();

import {
  handleUserLogs,
  handleJobLogs,
  handleGetLogById,
  handleGetLast24hoursLog,
} from "../controllers/log.controllers.js";
import { restrictUserLogin } from "../middlewares/auth.middlewares.js";
import { jobLogsParamsSchema, LogIdSchema, logQuerySchema } from "../schemas/log.schema.js";
import { validateParams, validateQuery } from "../middlewares/validate.middlewares.js";

// Logs routes
router.get("/", restrictUserLogin, validateQuery(logQuerySchema), handleUserLogs);
router.get("/insights", restrictUserLogin, handleGetLast24hoursLog);
router.get(
  "/:jobId",
  restrictUserLogin,
  validateParams(jobLogsParamsSchema),
  validateQuery(logQuerySchema),
  handleJobLogs,
);
router.get("/id/:logId", restrictUserLogin, validateParams(LogIdSchema), handleGetLogById);

export default router;
