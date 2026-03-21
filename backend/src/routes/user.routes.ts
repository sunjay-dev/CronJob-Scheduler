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
  handleRefreshAccessToken,
} from "../controllers/user.controllers.js";

import { restrictUserLogin } from "../middlewares/auth.middlewares.js";
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

router.post("/auth/login", validateBody(loginSchema), handleUserLogin);
router.post("/auth/register", validateBody(registerSchema), handleUserRegister);
router.post("/auth/logout", handleUserLogout);
router.post("/auth/refresh", handleRefreshAccessToken);

router.post("/auth/verify-email", validateBody(verifyUserSchema), handleUserVerification);
router.post("/auth/resend-otp", validateBody(verifyUserIdSchema), handleOtpResend);
router.post("/auth/forgot-password", validateBody(forgotPasswordSchema), handleForgotPassword);
router.post("/auth/reset-password", validateBody(resetPasswordSchema), handleResetPassword);

router.get("/me", restrictUserLogin, handleUserDetails);
router.put("/me", restrictUserLogin, validateBody(changeUserDetailsSchema), handleChangeUserDetails);

export default router;
