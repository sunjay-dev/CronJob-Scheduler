import express from 'express';
const router =  express.Router();

import {handleNewCronJobs, handleUserJobs, handleUserJobById, handleRunJobNow, handleJobStatus, handleJobEdit,handleDeleteJob} from '../controllers/job.controllers'
import { restrictUserLogin } from '../middlewares/auth.middlewares';
import { validate, validateParams } from '../middlewares/validate.middlewares';
import { jobIdSchema, jobSchema, jobStatusSchema } from '../schemas/job.schema';

router.get('/',restrictUserLogin, handleUserJobs);
router.get('/:jobId',restrictUserLogin, validateParams(jobIdSchema) ,handleUserJobById);


router.post('/', restrictUserLogin, validate(jobSchema),handleNewCronJobs);
router.post('/trigger',restrictUserLogin, validate(jobIdSchema),handleRunJobNow);

router.put('/status',restrictUserLogin, validate(jobStatusSchema), handleJobStatus);
router.put('/:jobId',restrictUserLogin, validate(jobSchema), handleJobEdit);

router.delete('/:jobId',restrictUserLogin, validateParams(jobIdSchema),handleDeleteJob);

export default router;