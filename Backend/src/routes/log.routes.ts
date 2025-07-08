import express from 'express';
const router =  express.Router();

import { handleUserLogs, handleJobLogs, handleErrorLogs} from '../controllers/log.controllers'
import { restrictUserLogin } from '../middlewares/auth.middlewares';

// Logs routes
router.get('/',restrictUserLogin, handleUserLogs);
router.get('/:jobId',restrictUserLogin, handleJobLogs);
router.get('/error/:jobId',restrictUserLogin, handleErrorLogs);

export default router