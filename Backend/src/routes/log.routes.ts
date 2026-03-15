import { Router } from "express";
const router = Router();

import { handleUserLogs, handleJobLogs, handleFailedLogs, handleGetLogById, handleGetLast24hoursLog } from "../controllers/log.controllers.js";
import { restrictUserLogin } from "../middlewares/auth.middlewares.js";
import { validateParams } from "../middlewares/validate.middlewares.js";
import { jobLogsParamsSchema, LogIdSchema } from "../schemas/log.schema.js";

// Logs routes
router.get("/", restrictUserLogin, handleUserLogs);
router.get("/insights", restrictUserLogin, handleGetLast24hoursLog);
router.get("/:jobId", restrictUserLogin, validateParams(jobLogsParamsSchema), handleJobLogs);
router.get("/id/:logId", restrictUserLogin, validateParams(LogIdSchema), handleGetLogById);
router.get("/error/:jobId", restrictUserLogin, validateParams(jobLogsParamsSchema), handleFailedLogs);

export default router;
