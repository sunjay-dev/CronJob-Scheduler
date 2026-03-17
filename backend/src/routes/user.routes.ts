import { Router } from "express";
import passport from "passport";
import {
  handleUserLogin,
  handleUserRegister,
  handleChangeUserDetails,
  handleForgotPassword,
  handleUserLogout,
  handleUserDetails,
  handleGoogleCallBack,
  handleResetPassword,
  handleUserVerification,
  handleOtpResend,
} from "../controllers/user.controllers.js";

import { restrictUserLogin, softRestrictUserLogin } from "../middlewares/auth.middlewares.js";
import {
  changeUserDetailsSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyUserIdSchema,
  verifyUserSchema,
} from "../schemas/user.schema.js";

import { validateBody } from "../middlewares/validate.middlewares.js";
const router = Router();

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/auth/google/callback", passport.authenticate("google", { session: false }), handleGoogleCallBack);

router.get("/details", softRestrictUserLogin, handleUserDetails);

router.post("/logout", handleUserLogout);
router.post("/login", validateBody(loginSchema), handleUserLogin);
router.post("/register", validateBody(registerSchema), handleUserRegister);
router.post("/verify-email", validateBody(verifyUserSchema), handleUserVerification);
router.post("/resend-otp", validateBody(verifyUserIdSchema), handleOtpResend);
router.post("/forgot-password", validateBody(forgotPasswordSchema), handleForgotPassword);
router.post("/reset-password", validateBody(resetPasswordSchema), handleResetPassword);

router.put("/", restrictUserLogin, validateBody(changeUserDetailsSchema), handleChangeUserDetails);

export default router;
