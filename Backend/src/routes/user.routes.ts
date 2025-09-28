import express from "express";
import passport from "passport";
import { Request, Response } from "express";
import { handleUserLogin, handleUserRegister, handleChangeUserDetails, handleForgotPassword, handleUserLogout, handleUserDetails, handleGoogleCallBack, handleResetPassword, handleUserVerification, handleOtpResend } from "../controllers/user.controllers";
import { restrictUserLogin, softRestrictUserLogin } from "../middlewares/auth.middlewares";
import { changeUserDetailsSchema, forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema, verifyUserIdSchema, verifyUserSchema  } from "../schemas/user.schema";
import { validate } from "../middlewares/validate.middlewares";
const router = express.Router();

router.get('/', (req: Request, res: Response): void => {
    res.status(200).send(`Hello from my server!`);
});

router.get("/health", (req: Request, res: Response): void => {
  res.status(200).send("OK");
});

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { session: false }), handleGoogleCallBack);

router.get('/logout', handleUserLogout);
router.get('/details', softRestrictUserLogin, handleUserDetails);

router.post('/login',  validate(loginSchema), handleUserLogin);
router.post('/register',validate(registerSchema) , handleUserRegister);
router.post('/verify-email', validate(verifyUserSchema),handleUserVerification);
router.post('/resend-otp', validate(verifyUserIdSchema), handleOtpResend);
router.post('/forgot-password', validate(forgotPasswordSchema),handleForgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), handleResetPassword);

router.put('/', restrictUserLogin, validate(changeUserDetailsSchema),handleChangeUserDetails);


export default router;