import express from 'express';
const router =  express.Router();

import { handleUserLogs, handleJobLogs, handleFailedLogs, handleGetLogById} from '../controllers/log.controllers'
import { restrictUserLogin } from '../middlewares/auth.middlewares';
import { validateParams } from '../middlewares/validate.middlewares';
import { jobLogsParamsSchema, LogIdParamsSchema } from '../schemas/log.schema';

// Logs routes
router.get('/',restrictUserLogin, handleUserLogs);
router.get('/:jobId',restrictUserLogin, validateParams(jobLogsParamsSchema) ,handleJobLogs);
router.get('/id/:logId', restrictUserLogin, validateParams(LogIdParamsSchema),handleGetLogById);
router.get('/error/:jobId',restrictUserLogin, validateParams(jobLogsParamsSchema), handleFailedLogs);

export default router