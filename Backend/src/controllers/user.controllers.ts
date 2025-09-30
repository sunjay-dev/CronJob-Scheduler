import { Request, Response, NextFunction } from "express"
import userModel from "../models/user.models";
import bcrypt from "bcrypt";
import crypto from 'crypto';
import { signToken } from "../utils/jwt.utils";
import { queueEmail } from "../utils/qstashEmail.utils";
import { AppError, BadRequestError, ForbiddenError, InternalServerError, NotFoundError, UnauthorizedError } from "../utils/appError.utils";
import redis from "../config/redis.config";

export const handleUserLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;

    try {
        const user = await userModel.findOne({ email }).select('+password');

        if (!user) return next(new UnauthorizedError("Either email or password is incorrect."));

        if (user.authProvider === "google" || !user.password) return next(new BadRequestError("Please try login using Google."));

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return next(new UnauthorizedError("Either email or password is incorrect."));

        if (!user.verified) return next(new ForbiddenError("Please verify your email to login.", { id: user._id }));

        const token = signToken({ userId: user.id }, "3d");

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 3 * 24 * 60 * 60 * 1000
        });
        const { password: _, ...safeUser } = user.toObject();
        res.status(200).json({
            message: "Login successful",
            user: safeUser,
            token
        });
    } catch (error) {
        next(new InternalServerError("Something went wrong. Please try again later."));
    }
}

export const handleUserRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, timezone = 'UTC' } = req.body;
    const password = req.body.password.trim();
    const email = req.body.email.trim().toLowerCase();

    try {
        const user = await userModel.findOne({ email });

        if (user) {
            if (user.authProvider !== "local") return next(new BadRequestError("This email is already registered with Google. Please continue using Google login."));
            return next(new BadRequestError("An account with this email already exists."));
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = await userModel.create({
            name,
            email,
            password,
            timezone
        });

        await Promise.all([
            queueEmail({ data: { otp }, name, email, template: "EMAIL_VERIFY" }),
            redis.set(`otp:${newUser._id}`, otp, 'EX', 60 * 60)
        ]);

        res.status(200).json({
            message: "Account created successfully. Please check your email to verify.",
            id: newUser._id,
            email
        });

    } catch (error) {
        next(new InternalServerError("Something went wrong. Please try again later."));
    }
}

export const handleUserVerification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { otp, userId } = req.body;

    try {
        const otpLockedUntil = await redis.ttl(`otpLockedUntil:${userId}`);

        if (otpLockedUntil > 0) {
            const minutesLeft = Math.ceil((otpLockedUntil / 60));
            return next(new AppError(`Too many attempts. Try again after ${minutesLeft} minute(s).`, 429));
        }

        const [cachedOtp, otpAttemptsStr] = await redis.mget(`otp:${userId}`, `otpAttempts:${userId}`);

        if (cachedOtp && otp !== cachedOtp) {
            let otpAttempts = parseInt(otpAttemptsStr || "0") + 1;

            if (otpAttempts >= 5) {
                await redis.multi()
                    .set(`otpLockedUntil:${userId}`, "true", 'EX', 15 * 60)
                    .del(`otpAttempts:${userId}`)
                    .exec();
                return next(new AppError(`Too many failed attempts. Try again after 15 minutes`, 429));
            }

            await redis.set(`otpAttempts:${userId}`, otpAttempts, 'EX', 15 * 60);

            if (otpAttempts >= 2) {
                return next(new BadRequestError(`Invalid OTP. You have only ${5 - otpAttempts} try left!`));
            }

            return next(new BadRequestError("Invalid OTP. Please check and try again."));
        }

        const user = await userModel.findById(userId);

        if (!user) return next(new NotFoundError("User not found."));

        if (user.verified) return next(new AppError("User is already verified. Please login to continue", 409));

        if (!cachedOtp) {
            return next(new BadRequestError("The OTP has expired. Please request a new one."));
        }

        user.verified = true;
        await Promise.all([
            user.save(),
            redis.del(`otp:${userId}`, `otpAttempts:${userId}`, `otpResendAttempts:${userId}`, `otpResendLock:${userId}`)
        ]);

        const cookieToken = signToken({ userId: user.id }, "3d");

        res.cookie("token", cookieToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 3 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Your email has been successfully verified."
        });
    } catch (error) {
        next(new InternalServerError("Error while verifying user email."));
    }
}

export const handleOtpResend = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId } = req.body;
    let delay = 60;

    try {
        const [otpResendAttemptsStr, otpResendLock] = await Promise.all([
            redis.get(`otpResendAttempts:${userId}`),
            redis.ttl(`otpResendLock:${userId}`)
        ]);

        const otpResendAttempts = parseInt(otpResendAttemptsStr ?? "0");

        switch (otpResendAttempts) {
            case 0: break;
            case 1: delay = 5 * 60; break;
            default: delay = 60 * 60;
        }

        if (otpResendLock > 0) {
            return next(new AppError(`Too many requests. Please wait before requesting again.`, 429, { wait: otpResendLock }));
        }

        const user = await userModel.findById(userId);

        if (!user) return next(new NotFoundError("User not found."));

        if (user.verified) return next(new AppError("User is already verified. Please login to continue.", 409));

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await Promise.all([
            redis.multi()
                .set(`otp:${user._id}`, otp, 'EX', 60 * 60)
                .set(`otpResendAttempts:${userId}`, otpResendAttempts + 1, 'EX', 24 * 60 * 60)
                .set(`otpResendLock:${userId}`, "true", 'EX', delay)
                .exec(),
            queueEmail({ data: { otp }, name: user.name, email: user.email, template: "EMAIL_VERIFY" })
        ]);

        res.status(200).json({
            message: `A new OTP has been sent to your email.`,
            wait: delay
        });
    } catch (error) {
        next(new InternalServerError("Error while resending OTP. Please try again later."));
    }
}

export const handleUserLogout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
    return;
}

export const handleUserDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId } = req.jwtUser;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            res.clearCookie("token");
            return next(new NotFoundError("User not found"));
        }
        res.status(200).json(user);
    } catch (error) {
        next(new InternalServerError("Error while fetching user details"));
    }
}

export const handleChangeUserDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId } = req.jwtUser;
    const updateFields = req.body;

    try {
        const user = await userModel.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true }
        );
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        next(new InternalServerError("Error while updating user details"));
    }
}

export const handleGoogleCallBack = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user) || !('email' in user)) {
        return next(new BadRequestError("Invalid user data from Google authentication"));
    }
    try {
        const token = signToken({ userId: user._id! });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.redirect(`${process.env.CLIENT_URL}/dashboard?loginMethod=google`);
    } catch (error) {
        next(new InternalServerError("Error while creating account with Google."));
    }
}

export const handleForgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email } = req.body;

    try {
        const redisOtp = await redis.get(`otp:${email}`);
        if (redisOtp) {
            return next(new AppError("You can request a reset link only once per hour.", 429));
        }

        const user = await userModel.findOne({ email });

        if (!user) return next(new NotFoundError("No user found with this email address."));

        if (user.authProvider === "google") return next(new ForbiddenError("This account is connected with Google. Please sign in using Google."));

        const token = crypto.randomBytes(32).toString("hex");

        const url = `${process.env.CLIENT_URL}/reset-password/${token}`;

        await queueEmail({ data: { url }, name: user.name, email, template: "FORGOT_PASSWORD" });

        await redis.set(`otp:${email}`, token, 'EX', 60 * 60, 'NX');
        await redis.set(`otptoken:${token}`, email, 'EX', 60 * 60);

        res.status(200).json({
            message: "Email has been successfully sent to reset password"
        });
    } catch (error) {
        next(new InternalServerError("Something went wrong. Please try again later"));
    }
}

export const handleResetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { token } = req.body;
    const password = req.body.password.trim();

    try {
        const email = await redis.get(`otptoken:${token}`);

        if (!email) {
            if (req.cookies?.token) {
                res.clearCookie("token");
            }
            return next(new BadRequestError("The reset link is invalid or has expired. Please request a new one."));
        }
        const hashedPassword = await bcrypt.hash(password, 7);
        const user = await userModel.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true });

        if (!user) return next(new NotFoundError("User not found."));

        await redis.del(`otptoken:${token}`);

        const cookieToken = signToken({ userId: user.id }, "3d");

        res.cookie('token', cookieToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 3 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Your password has been successfully reset. You’re now logged in."
        });
    } catch (error) {
        next(new InternalServerError("Something went wrong. Please try again later."));
    }
}