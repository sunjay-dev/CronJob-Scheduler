import type { Request, Response, NextFunction, CookieOptions } from "express";
import { BadRequestError } from "../utils/appError.utils.js";
import * as userService from "../services/user.service.js";
import { revokeRefreshToken, generateRefreshAndAccessToken } from "../services/token.service.js";
import { OAuthUser } from "../types/user.types.js";

const accessTokenOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 15 * 60 * 1000,
};

const refreshTokenOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

export const handleUserLogin = async (req: Request, res: Response) => {
  const email = req.body.email.trim().toLowerCase();
  const { password, rememberMe = false } = req.body;
  const { user, accessToken, refreshToken } = await userService.loginUser({ email, password });

  res.cookie("accessToken", accessToken, accessTokenOptions);
  res.cookie("refreshToken", refreshToken, {
    ...refreshTokenOptions,
    maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : undefined,
  });

  res.status(200).json({
    message: "Login successful",
    user,
    accessToken,
    refreshToken,
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

export const handleRefreshAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) throw new BadRequestError("Refresh token is required");

  const accessToken = await userService.generateAccessToken(refreshToken);

  res.cookie("accessToken", accessToken, accessTokenOptions);

  res.status(200).json({
    message: "Access token refreshed successfully",
    accessToken,
  });
};

export const handleUserVerification = async (req: Request, res: Response) => {
  const { otp, userId } = req.body;

  const { accessToken, refreshToken } = await userService.verifyUser({ userId, otp });

  res.cookie("accessToken", accessToken, accessTokenOptions);
  res.cookie("refreshToken", refreshToken, {
    ...refreshTokenOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "Your email has been successfully verified.",
    accessToken,
    refreshToken,
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
  revokeRefreshToken(req.cookies?.refreshToken);
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
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
  const user = req.user as OAuthUser;
  if (!user || typeof user !== "object" || !("_id" in user)) {
    return next(new BadRequestError("Invalid user data from Google authentication"));
  }

  const { accessToken, refreshToken } = await generateRefreshAndAccessToken(user._id.toString());

  res.cookie("accessToken", accessToken, accessTokenOptions);
  res.cookie("refreshToken", refreshToken, {
    ...refreshTokenOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000,
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

  const { accessToken, refreshToken } = await userService.resetUserPassword(token, password);

  res.cookie("accessToken", accessToken, accessTokenOptions);
  res.cookie("refreshToken", refreshToken, {
    ...refreshTokenOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "Your password has been successfully reset. You’re now logged in.",
    accessToken,
    refreshToken,
  });
};
