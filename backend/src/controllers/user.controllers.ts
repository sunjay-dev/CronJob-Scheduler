import type { Request, Response, NextFunction } from "express";
import { signToken } from "../utils/jwt.utils.js";
import { BadRequestError } from "../utils/appError.utils.js";
import * as userService from "../services/user.service.js";

export const handleUserLogin = async (req: Request, res: Response) => {
  const email = req.body.email.trim().toLowerCase();
  const { password, rememberMe = false } = req.body;
  const { user, token } = await userService.loginUser({ email, password, rememberMe });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : undefined,
  });

  res.status(200).json({
    message: "Login successful",
    user,
    token,
  });
};

export const handleUserRegister = async (req: Request, res: Response) => {
  const { name, timezone = "UTC" } = req.body;
  const password = req.body.password.trim();
  const email = req.body.email.trim().toLowerCase();

  const { id } = await userService.registerUser({ name, email, password, timezone });

  res.status(200).json({
    message: "Account created successfully. Please check your email to verify.",
    id,
    email,
  });
};

export const handleUserVerification = async (req: Request, res: Response) => {
  const { otp, userId } = req.body;

  const { token } = await userService.verifyUser({ userId, otp });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "Your email has been successfully verified.",
    token,
  });
};

export const handleOtpResend = async (req: Request, res: Response) => {
  const { userId } = req.body;

  const { delay } = await userService.resendUserOtp(userId);

  res.status(200).json({
    message: `A new OTP has been sent to your email.`,
    wait: delay,
  });
};

export const handleUserLogout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

export const handleUserDetails = async (req: Request, res: Response) => {
  const { userId } = req.jwtUser;

  const user = await userService.getUserDetailsData(userId);
  res.status(200).json(user);
};

export const handleChangeUserDetails = async (req: Request, res: Response) => {
  const { userId } = req.jwtUser;
  const updateFields = req.body;

  const user = await userService.updateUserDetailsData(userId, updateFields);
  res.status(200).json({ message: "User updated successfully", user });
};

export const handleGoogleCallBack = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user || typeof user !== "object" || !("_id" in user) || !("email" in user)) {
    return next(new BadRequestError("Invalid user data from Google authentication"));
  }

  const token = signToken({ userId: user._id! }, "7d");

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.redirect(`${process.env.CLIENT_URL as string}/dashboard?loginMethod=google`);
};

export const handleForgotPassword = async (req: Request, res: Response) => {
  const email = req.body.email.trim().toLowerCase();

  await userService.handleForgotPasswordAction(email);

  res.status(200).json({
    message: "Email has been successfully sent to reset password",
  });
};

export const handleResetPassword = async (req: Request, res: Response) => {
  const { token } = req.body;
  const password = req.body.password.trim();

  const { cookieToken } = await userService.resetUserPassword(token, password);

  res.cookie("token", cookieToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "Your password has been successfully reset. You’re now logged in.",
  });
};
