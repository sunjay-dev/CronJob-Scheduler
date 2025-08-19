import { Request, Response, NextFunction } from "express"
import userModel from "../models/user.models";
import bcrypt from "bcrypt";
import { signToken, verifyToken } from "../utils/jwt.utils";
import {queueEmail} from "../utils/qstashEmail.util";

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

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.status(401).json({
                message: "either email or password is incorrect."
            })
            return;
        }

        const token = signToken({ userId: user.id, email: user.email }, "3d");
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
        res.status(500).json({ message: "Error while user Login." });
    }
}

export const handleUserRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, email, password, timezone = 'UTC' } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (user) {
            res.status(400).json({
                message: "Account already exists."
            })
            return;
        }

        const newUser = await userModel.create({ name: name.trim(), email, password, timezone, authProvider: "local" });

        const token = signToken({ userId: newUser.id, email: newUser.email }, "3d");

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 3 * 24 * 60 * 60 * 1000
        });

        const { password: _, ...safeUser } = newUser.toObject();

        res.status(200).json({
            message: "Signup successful",
            user: safeUser,
            token
        });
    } catch (error) {
        console.error("Error while user register", error);
        res.status(500).json({ message: "Error while user register." });
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
        const token = signToken({ userId: user._id!, email: user.email! });

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
                message: "No User Found."
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

        const token = signToken({ userId: user._id }, "1h");

        const url = `${process.env.CLIENT_URL}/reset-password/${token}`;

        await queueEmail({ data: {url},name: user.name, email, template: "FORGOT_PASSWORD" });

        user.resetToken = token;
        user.resetTokenExpiry = new Date(Date.now() + 3600000);
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
        let decoded;
        try {
            decoded = verifyToken(token);
        } catch (error) {
            res.status(400).json({
                message: "Invalid or expired token. Please request a new password reset."
            });
            return;
        }

        if (typeof decoded !== "object" || decoded === null || !("userId" in decoded)) {
            res.status(400).json({
                message: "Token verification failed. Please request a new password reset."
            });
            return;
        }

        const user = await userModel.findOne({
            _id: decoded.userId,
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

        const cookieToken = signToken({ userId: user.id, email: user.email }, "3d");
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
