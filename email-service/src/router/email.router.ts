import { Router } from "express";
import { handleSendEmail, handleHomeRoute } from "../controllers/email.controllers.js";
import { Validate } from "../middlewares/validation.middleware.js";
import { emailSchema } from "../schemas/email.schema.js";
import { RestrictAuthenticatedRequest } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/", handleHomeRoute);

router.post("/", RestrictAuthenticatedRequest, Validate(emailSchema), handleSendEmail);

export default router;
