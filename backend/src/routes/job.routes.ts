import { Router } from "express";
const router = Router();

import {
  handleNewCronJobs,
  handleUserJobs,
  handleUserJobById,
  handleRunJobNow,
  handleJobStatus,
  handleJobEdit,
  handleDeleteJob,
} from "../controllers/job.controllers.js";
import { restrictUserLogin } from "../middlewares/auth.middlewares.js";
import { validateBody, validateParams } from "../middlewares/validate.middlewares.js";
import { jobIdSchema, jobSchema, jobStatusSchema } from "../schemas/job.schema.js";

router.get("/", restrictUserLogin, handleUserJobs);
router.get("/:jobId", restrictUserLogin, validateParams(jobIdSchema), handleUserJobById);

router.post("/", restrictUserLogin, validateBody(jobSchema), handleNewCronJobs);
router.post("/trigger", restrictUserLogin, validateBody(jobIdSchema), handleRunJobNow);

router.put("/status", restrictUserLogin, validateBody(jobStatusSchema), handleJobStatus);
router.put("/:jobId", restrictUserLogin, validateBody(jobSchema), handleJobEdit);

router.delete("/:jobId", restrictUserLogin, validateParams(jobIdSchema), handleDeleteJob);

export default router;
