import { Request, Response, NextFunction } from "express"
import userModel from "../models/user.models";
import bcrypt from "bcrypt";
import crypto from 'crypto';
import { signToken } from "../utils/jwt.utils";
import { queueEmail } from "../utils/qstashEmail.util";

export const handleUserLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            res.status(401).json({
                message: "either email or password is incorrect."
            });
            return;
        }

        if (user.authProvider === "google" || !user.password) {
            res.status(400).json({ message: 'Please try login using Google.' });
            return;
        }

        if (!user.verified) {
            res.status(403).json({
                message: "Please verify your email to login.",
                id: user._id
            });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.status(401).json({
                message: "either email or password is incorrect."
            })
            return;
        }

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
        console.error("Error while user Login", error);
        res.status(500).json({ message: "Sign in failed. Please try again later." });
    }
}

export const handleUserRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, email, password, timezone = 'UTC' } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (user) {
            if (user.authProvider !== "local") {
                res.status(400).json({
                    message: "This email is already registered with Google. Please continue using Google login."
                })
                return;
            }
            res.status(400).json({
                message: "An account with this email already exists."
            })
            return;
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = await userModel.create({
            name: name.trim(),
            email,
            password,
            verified: false,
            timezone,
            otp,
            otpExpiry: new Date(Date.now() + 1000 * 60 * 60),
            authProvider: "local"
        });

        await queueEmail({ data: { otp }, name, email, template: "EMAIL_VERIFY" });

        res.status(200).json({
            message: "Account created successfully. Please check your email to verify.",
            id: newUser._id,
            email
        });
    } catch (error) {
        console.error("Error while user register", error);
        res.status(500).json({ message: "Registration failed. Please try again later." });
    }
}

export const handleUserVerification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { otp, userId } = req.body;

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        if (user.verified) {
            res.status(409).json({ message: "User is already verified. Please login to continue" });
            return;
        }

        // Check if locked
        if (user.otpLockedUntil && user.otpLockedUntil > new Date()) {
            const minutesLeft = Math.ceil((user.otpLockedUntil.getTime() - Date.now()) / 1000 / 60);
            res.status(429).json({
                message: `Too many attempts. Try again after ${minutesLeft} minute(s).`
            });
            return;
        }

        if (!user.otp || !user.otpExpiry || user.otpExpiry.getTime() < Date.now()) {
            res.status(400).json({ message: "OTP has expired. Please request a new one." });
            return;
        }

        if (user.otp !== otp) {
            user.otpAttempts = (user.otpAttempts || 0) + 1;

            if (user.otpAttempts >= 5) {
                user.otpLockedUntil = new Date(Date.now() + 30 * 60 * 1000);
                user.otpAttempts = 0;
                await user.save();

                res.status(429).json({
                    message: "Too many failed attempts. You are locked for 15 minutes."
                });
                return;
            }

            await user.save();

            if (user.otpAttempts >= 2) {
                res.status(400).json({
                    message: "Invalid OTP. You have only 3 try left!"
                });
                return;
            }

            res.status(400).json({
                message: "Invalid OTP. Please check and try again."
            });
            return;
        }

        // ✅ OTP is correct
        user.verified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        user.otpAttempts = 0;
        user.otpLockedUntil = new Date(0);
        await user.save();

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
        console.error("Error while user verification", error);
        res.status(500).json({ message: "Error while user verification." });
    }
};

export const handleOtpResend = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId } = req.body;

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        if (user.verified) {
            res.status(409).json({ message: "User is already verified. Please login to continue." });
            return;
        }

        if (!user.otpResendAttempts) {
            user.otpResendAttempts = { count: 0, lastSent: new Date(0) };
        }

        const now = Date.now();
        let delay = 0;

        switch (user.otpResendAttempts.count) {
            case 0:
                delay = 60 * 1000;
                break;
            case 1:
                delay = 5 * 60 * 1000;
                break;
            default:
                delay = 60 * 60 * 60 * 1000;
        }

        if (user.otpResendAttempts.lastSent && (now - user.otpResendAttempts.lastSent.getTime()) < delay) {
            const wait = Math.ceil((delay - (now - user.otpResendAttempts.lastSent.getTime())) / 1000);
            res.status(429).json({
                message: `Too many requests. Please wait before requesting again.`,
                wait
            });
            return;
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiry = new Date(now + 60 * 60 * 1000);

        user.otpResendAttempts.count += 1;
        user.otpResendAttempts.lastSent = new Date(now);
        await user.save();

        await queueEmail({ data: { otp }, name: user.name, email: user.email, template: "EMAIL_VERIFY" });

        res.status(200).json({
            message: `A new OTP has been sent to your email.`,
        });
    } catch (error) {
        console.error("Error while resending OTP", error);
        res.status(500).json({ message: "Something went wrong, Please try again later." });
    }
};

export const handleUserLogout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
    return;
}

export const handleUserDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId } = req.jwtUser;

    try {
        const user = await userModel.findById(userId);
        res.status(200).json(user);

    } catch (error) {
        console.error("Error while fetching user details.", error);
        res.status(500).json({ message: "Error while fetching user details" });
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
        console.error("Error while updating user details.", error);
        res.status(500).json({ message: "Error while updating user details" });
    }
};

export const handleGoogleCallBack = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user;

    if (!user || typeof user !== 'object' || !('_id' in user) || !('email' in user)) {
        console.error("Invalid user object from Google callback:", user);
        res.status(400).json({ message: "Invalid user data from Google authentication" });
        return;
    }

    try {
        const token = signToken({ userId: user._id! });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.redirect(`${process.env.CLIENT_URL}/`);

    } catch (error) {
        console.error("Error while creating account with Google.", error);
        res.status(500).json({ message: "Error while creating account with Google." });
    }
}

export const handleForgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            res.status(404).json({
                message: "No user found with this email address."
            });
            return
        }

        if (user.authProvider === "google") {
            res.status(403).json({
                message: "This account is connected with Google. Please sign in using Google."
            });
            return;
        }

        if (user.resetTokenExpiry && user.resetTokenExpiry.getTime() > Date.now()) {
            res.status(429).json({ message: "You can request a reset link only once per hour." });
            return;
        }

        const token = crypto.randomBytes(32).toString("hex");

        const url = `${process.env.CLIENT_URL}/reset-password/${token}`;

        await queueEmail({ data: { url }, name: user.name, email, template: "FORGOT_PASSWORD" });

        user.resetToken = token;
        user.resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60);
        await user.save();

        res.status(200).json({
            message: "Email has been successfully sent to reset password"
        });

    } catch (error) {
        console.error("Error while forgetting password.", error);
        res.status(500).json({ message: "Something went wrong. Please try again later" });
    }
}

export const handleResetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { token, password } = req.body;
    try {
        const user = await userModel.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            res.status(400).json({
                message: "The reset link is invalid or has expired. Please request a new one."
            });
            return;
        }

        user.password = password;
        user.resetToken = undefined;
        // user.resetTokenExpiry = undefined;
        await user.save();

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
        console.error("Error while resetting password:", error);
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
};