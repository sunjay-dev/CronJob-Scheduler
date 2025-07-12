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
            sameSite: 'Strict',      
            maxAge: 3600000,        
        });
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token
        });

    } catch (error) {
        console.log("Error while user Login", error);
        res.status(500).json({ message: "Error while user Login." });
    }
}

export const handleUserRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, email, password } = req.body;

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

        const newUser = await userModel.create({ name, email, password });

        const token = signToken({ userId: newUser.id, email: newUser.email });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,            
            sameSite: 'Strict',      
            maxAge: 3600000,        
        });

        res.status(200).json({
            message: "Signup successful",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
            token
        });
    } catch (error) {
        console.log("Error while user register", error);
        res.status(500).json({ message: "Error while user register." });
    }
}

export const handleUserLogout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
    return;
}

export const handleUserDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId } = req.user;

    try {
        const user = await userModel.findById(userId);
        res.status(200).json(user);

    } catch (error) {
        console.log("Error while fetching user details.", error);
        res.status(500).json({ message: "Error while fetching user details" });
    }
}