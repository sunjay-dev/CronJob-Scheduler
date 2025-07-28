import { Request, Response, NextFunction } from "express"
import userModel from "../models/user.models";
import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt.utils";

export const handleUserLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const { email, password } = req.body;

    if (!email || !password) {
        res.status(401).json({
            message: "Both email and password required."
        });
        return;
    }
    try {
        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            res.status(401).json({
                message: "either email or password is incorrect."
            });
            return;
        }

        if (!user.password) {
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

        const token = signToken({ userId: user.id, email: user.email });
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000
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

    if (!name || !email || !password) {
        res.status(401).json({
            message: "All three name, email, and password are required."
        });
        return;
    }
    try {
        const user = await userModel.findOne({ email });
        if (user) {
            res.status(400).json({
                message: "Account already exists."
            })
            return;
        }

        const newUser = await userModel.create({ name, email, password, timezone });

        const token = signToken({ userId: newUser.id, email: newUser.email });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000
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

    const { name, timezone, mode, timeFormat24, emailNotifications, pushAlerts } = req.body;

    const updateFields: any = {};

    if (name !== undefined) {
        if (typeof name !== 'string' || name.trim() === '') {
            res.status(400).json({ message: "Invalid name" });
            return;
        }
        updateFields.name = name.trim();
    }

    if (timezone !== undefined) {
        if (typeof timezone !== 'string' || timezone.trim() === '') {
            res.status(400).json({ message: "Invalid timezone" });
            return;
        }
        updateFields.timezone = timezone.trim();
    }

    if (mode !== undefined) {
        if (mode !== 'day' && mode !== 'dark') {
            res.status(400).json({ message: "Invalid mode (must be 'day' or 'dark')" });
            return;
        }
        updateFields.mode = mode;
    }

    if (timeFormat24 !== undefined) {
        if (typeof timeFormat24 !== 'boolean') {
            res.status(400).json({ message: "Invalid timeFormat24 (must be boolean)" });
            return;
        }
        updateFields.timeFormat24 = timeFormat24;
    }

    if (emailNotifications !== undefined) {
        if (typeof emailNotifications !== 'boolean') {
            res.status(400).json({ message: "Invalid emailNotifications (must be boolean)" });
            return;
        }
        updateFields.emailNotifications = emailNotifications;
    }

    if (pushAlerts !== undefined) {
        if (typeof pushAlerts !== 'boolean') {
            res.status(400).json({ message: "Invalid pushAlerts (must be boolean)" });
            return;
        }
        updateFields.pushAlerts = pushAlerts;
    }

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