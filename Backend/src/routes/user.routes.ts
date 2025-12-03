import { type Request, type Response, Router } from "express";
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
} from "../controllers/user.controllers";
import { restrictUserLogin, softRestrictUserLogin, prometheusAuth } from "../middlewares/auth.middlewares";
import {
  changeUserDetailsSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyUserIdSchema,
  verifyUserSchema,
} from "../schemas/user.schema";
import { validate } from "../middlewares/validate.middlewares";
import register from "../config/prometheus.config";
const router = Router();

router.get("/", (req: Request, res: Response): void => {
  res.status(200).send(`Hello from my server!`);
});

router.get("/health", (req: Request, res: Response): void => {
  res.status(200).send("OK");
});

router.get("/metrics", prometheusAuth, async (req: Request, res: Response) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/auth/google/callback", passport.authenticate("google", { session: false }), handleGoogleCallBack);

router.get("/details", softRestrictUserLogin, handleUserDetails);

router.post("/logout", handleUserLogout);
router.post("/login", validate(loginSchema), handleUserLogin);
router.post("/register", validate(registerSchema), handleUserRegister);
router.post("/verify-email", validate(verifyUserSchema), handleUserVerification);
router.post("/resend-otp", validate(verifyUserIdSchema), handleOtpResend);
router.post("/forgot-password", validate(forgotPasswordSchema), handleForgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), handleResetPassword);

router.put("/", restrictUserLogin, validate(changeUserDetailsSchema), handleChangeUserDetails);

export default router;
