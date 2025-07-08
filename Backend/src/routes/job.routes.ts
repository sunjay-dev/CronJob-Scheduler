import express from 'express';
const router =  express.Router();

import {handleNewCronJobs, handleUserJobs, handleUserJobById, handleJobStatus, handleDeleteJob} from '../controllers/job.controllers'
import { restrictUserLogin } from '../middlewares/auth.middlewares';

router.post('/', restrictUserLogin,handleNewCronJobs);
router.get('/',restrictUserLogin, handleUserJobs);
router.get('/:jobId',restrictUserLogin, handleUserJobById);
router.put('/status',restrictUserLogin, handleJobStatus);
router.delete('/:jobId',restrictUserLogin, handleDeleteJob);

export default router