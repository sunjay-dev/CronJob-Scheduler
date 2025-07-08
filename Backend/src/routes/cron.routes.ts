import express from 'express';
const router =  express.Router();

import { handleNewCronJobs, handleUserLogs, handleJobLogs, handleErrorLogs,handleUserJobs, handleUserJobById, handleJobStatus, handleDeleteJob} from '../controllers/cron.controllers'
import { restrictUserLogin } from '../middlewares/auth.middlewares';

// Logs routes
router.post('/', restrictUserLogin,handleNewCronJobs);
router.get('/logs',restrictUserLogin, handleUserLogs);
router.get('/logs/:jobId',restrictUserLogin, handleJobLogs);
router.get('/logs/error/:jobId',restrictUserLogin, handleErrorLogs);

// Jobs routes
router.get('/jobs',restrictUserLogin, handleUserJobs);
router.get('/jobs/:jobId',restrictUserLogin, handleUserJobById);
router.put('/jobs/status',restrictUserLogin, handleJobStatus);
router.delete('/jobs/:jobId',restrictUserLogin, handleDeleteJob);

export default router