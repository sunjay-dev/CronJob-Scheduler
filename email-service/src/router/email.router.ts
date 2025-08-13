import { Router } from "express";
import { handleSendEmail, handleHomeRoute } from "../controllers/email.controllers";
import { Validate } from "../middlewares/validation.middleware";
import { emailSchema } from "../schemas/email.schema";
const router = Router();


router.get('/', handleHomeRoute);

router.post('/', Validate(emailSchema), handleSendEmail);

export default router;