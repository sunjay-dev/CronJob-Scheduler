import userModel from "../models/user.models.js";
import { comparePasswords, hashPassword } from "../utils/hash.utils.js";
import { generateRandomToken } from "../utils/crypto.utils.js";
import { signToken } from "../utils/jwt.utils.js";
import { queueEmail } from "../utils/qstashEmail.utils.js";
import { LoginParams, RegisterParams, VerifyParams } from "../types/user.types.js";
import redis from "../config/redis.config.js";
import {
  AppError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  TooManyRequestsError,
  UnauthorizedError,
} from "../utils/appError.utils.js";
import refreshTokenModel from "../models/refreshToken.models.js";
import { generateRefreshAndAccessToken } from "./token.service.js";

export const loginUser = async ({ email, password }: LoginParams) => {
  const user = await userModel.findOne({ email }).select("+password verified authProvider").lean();

  if (!user) throw new UnauthorizedError("Either email or password is incorrect.");

  if (user.authProvider === "google" || !user.password) {
    throw new BadRequestError("Please try login using Google.");
  }

  if (!password) {
    throw new UnauthorizedError("Either email or password is incorrect.");
  }

  const isMatch = await comparePasswords(password, user.password);

  if (!isMatch) throw new UnauthorizedError("Either email or password is incorrect.");

  if (!user.verified) {
    throw new ForbiddenError("Please verify your email to login.", { id: user._id.toString() });
  }

  const { accessToken, refreshToken } = await generateRefreshAndAccessToken(user._id.toString());

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...safeUser } = user;

  return { user: safeUser, accessToken, refreshToken };
};

export const registerUser = async ({ name, email, password, timezone }: RegisterParams) => {
  const user = await userModel.findOne({ email }).select("authProvider").lean();

  if (user) {
    if (user.authProvider !== "local") {
      throw new BadRequestError("This email is already registered with Google. Please continue using Google login.");
    }
    throw new BadRequestError("An account with this email already exists.");
  }

  const newUser = await userModel.create({
    name,
    email,
    password,
    timezone,
  });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await Promise.all([
    queueEmail({ data: { otp }, name, email, template: "EMAIL_VERIFY" }),
    redis.set(`otp:${newUser._id}`, otp, "EX", 60 * 60),
  ]);

  return { id: newUser._id, email };
};

export const generateAccessToken = async (refreshToken: string) => {
  if (!refreshToken) throw new UnauthorizedError("No refresh token provided.");

  const storedToken = await refreshTokenModel.findOne({ refreshToken });
  if (!storedToken) throw new UnauthorizedError("Refresh token revoked or expired.");

  return signToken({ userId: storedToken.user.toString() }, { expiresIn: "15m" });
};

export const verifyUser = async ({ userId, otp }: VerifyParams) => {
  const otpLockedUntil = await redis.ttl(`otpLockedUntil:${userId}`);

  if (otpLockedUntil > 0) {
    const minutesLeft = Math.ceil(otpLockedUntil / 60);
    throw new TooManyRequestsError(`Too many attempts. Try again after ${minutesLeft} minute(s).`);
  }

  const [cachedOtp, otpAttemptsStr] = await redis.mget(`otp:${userId}`, `otpAttempts:${userId}`);

  if (cachedOtp && otp !== cachedOtp) {
    const otpAttempts = parseInt(otpAttemptsStr || "0") + 1;

    if (otpAttempts >= 5) {
      await redis
        .multi()
        .set(`otpLockedUntil:${userId}`, "true", "EX", 15 * 60)
        .del(`otpAttempts:${userId}`)
        .exec();
      throw new TooManyRequestsError(`Too many failed attempts. Try again after 15 minutes`);
    }

    await redis.set(`otpAttempts:${userId}`, otpAttempts, "EX", 15 * 60);

    if (otpAttempts >= 2) {
      throw new BadRequestError(`Invalid OTP. You have only ${5 - otpAttempts} try left!`);
    }

    throw new BadRequestError("Invalid OTP. Please check and try again.");
  }

  const user = await userModel.findById(userId);

  if (!user) throw new NotFoundError("User not found.");

  if (user.verified) throw new AppError("User is already verified. Please login to continue", 409);

  if (!cachedOtp) {
    throw new BadRequestError("The OTP has expired. Please request a new one.");
  }

  user.verified = true;
  await Promise.all([
    user.save(),
    redis.del(`otp:${userId}`, `otpAttempts:${userId}`, `otpResendAttempts:${userId}`, `otpResendLock:${userId}`),
  ]);

  const { accessToken, refreshToken } = await generateRefreshAndAccessToken(user._id.toString());
  return { accessToken, refreshToken };
};

export const resendUserOtp = async (userId: string) => {
  const [otpResendAttemptsStr, otpResendLock] = await Promise.all([
    redis.get(`otpResendAttempts:${userId}`),
    redis.ttl(`otpResendLock:${userId}`),
  ]);

  let delay = 60;
  const otpResendAttempts = parseInt(otpResendAttemptsStr ?? "0");

  switch (otpResendAttempts) {
    case 0:
      break;
    case 1:
      delay = 5 * 60;
      break;
    default:
      delay = 60 * 60;
  }

  if (otpResendLock > 0) {
    throw new TooManyRequestsError(`Too many requests. Please wait before requesting again.`, {
      wait: otpResendLock,
    });
  }

  const user = await userModel.findById(userId).select("verified name email ").lean();

  if (!user) throw new NotFoundError("User not found.");

  if (user.verified) throw new AppError("User is already verified. Please login to continue.", 409);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await Promise.all([
    redis
      .multi()
      .set(`otp:${user._id}`, otp, "EX", 60 * 60)
      .set(`otpResendAttempts:${userId}`, otpResendAttempts + 1, "EX", 24 * 60 * 60)
      .set(`otpResendLock:${userId}`, "true", "EX", delay)
      .exec(),
    queueEmail({
      data: { otp },
      name: user.name,
      email: user.email,
      template: "EMAIL_VERIFY",
    }),
  ]);

  return { delay };
};

export const getUserDetailsData = async (userId: string) => {
  const user = await userModel.findById(userId).lean();
  if (!user) throw new NotFoundError("User not found");
  return user;
};

export const updateUserDetailsData = async (userId: string, updateFields: Record<string, unknown>) => {
  const user = await userModel.findByIdAndUpdate(userId, updateFields, { new: true }).lean();
  return user;
};

export const handleForgotPasswordAction = async (email: string) => {
  const redisOtp = await redis.get(`otp:${email}`);
  if (redisOtp) {
    throw new TooManyRequestsError("You can request a reset link only once per hour.", { email });
  }

  const user = await userModel.findOne({ email }).select("authProvider name email").lean();

  if (!user) throw new NotFoundError("No user found with this email address.", { email });

  if (user.authProvider === "google") {
    throw new ForbiddenError("This account is connected with Google. Please sign in using Google.", { email });
  }

  const token = generateRandomToken();
  const url = `${process.env.CLIENT_URL as string}/reset-password/${token}`;

  await queueEmail({
    data: { url },
    name: user.name,
    email,
    template: "FORGOT_PASSWORD",
  });

  await redis
    .multi()
    .set(`otp:${email}`, token, "EX", 60 * 60, "NX")
    .set(`otptoken:${token}`, email, "EX", 60 * 60)
    .exec();
};

export const resetUserPassword = async (token: string, password: string) => {
  const email = await redis.get(`otptoken:${token}`);

  if (!email) {
    throw new BadRequestError("The reset link is invalid or has expired. Please request a new one.");
  }
  const hashedPassword = await hashPassword(password, 7);
  const user = await userModel
    .findOneAndUpdate({ email }, { password: hashedPassword }, { new: true })
    .select("_id")
    .lean();

  if (!user) throw new NotFoundError("User not found.");

  await redis.del(`otptoken:${token}`);

  const { accessToken, refreshToken } = await generateRefreshAndAccessToken(user._id.toString());
  return { accessToken, refreshToken };
};
