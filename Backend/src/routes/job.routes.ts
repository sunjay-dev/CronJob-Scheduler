import express from 'express';
const router =  express.Router();

import {handleNewCronJobs, handleUserJobs, handleUserJobById, handleRunJobNow, handleJobStatus, handleJobEdit,handleDeleteJob} from '../controllers/job.controllers'
import { restrictUserLogin } from '../middlewares/auth.middlewares';

router.get('/',restrictUserLogin, handleUserJobs);
router.get('/:jobId',restrictUserLogin, handleUserJobById);


router.post('/', restrictUserLogin, handleNewCronJobs);
router.post('/trigger',restrictUserLogin, handleRunJobNow);

router.put('/status',restrictUserLogin, handleJobStatus);
router.put('/:jobId',restrictUserLogin, handleJobEdit);

router.delete('/:jobId',restrictUserLogin, handleDeleteJob);

export default router