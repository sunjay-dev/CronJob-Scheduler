import express from "express";
import passport from "passport";
import { Request, Response } from "express";
import { handleUserLogin, handleUserRegister, handleChangeUserDetails, handleForgotPassword, handleUserLogout, handleUserDetails, handleGoogleCallBack, handleResetPassword } from "../controllers/user.controllers";
import { restrictUserLogin } from "../middlewares/auth.middlewares";
import { changeUserDetailsSchema, forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema  } from "../schemas/user.schema";
import { validate } from "../middlewares/validate.middlewares";
const router = express.Router();

router.get('/', (req: Request, res: Response): void => {
    res.status(200).send("Hello, I'm running")
});

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { session: false }), handleGoogleCallBack);

router.get('/logout', handleUserLogout);
router.get('/details', restrictUserLogin, handleUserDetails);

router.post('/login',  validate(loginSchema), handleUserLogin);
router.post('/register',validate(registerSchema) , handleUserRegister);
router.post('/forgot-password', validate(forgotPasswordSchema),handleForgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), handleResetPassword);

router.put('/', restrictUserLogin, validate(changeUserDetailsSchema),handleChangeUserDetails);


export default router;