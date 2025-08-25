import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import { boolean } from "zod";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    verified: {
        type: boolean,
        required: true,
        default: false
    },
    password: {
        type: String,
        required: false,
        select: false
    },
    verifyToken: {
        type: String,
        index: true
    },
    verifyTokenExpiry: { type: Date },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    timezone: {
        type: String,
        default: 'UTC'
    },
    mode: {
        type: String,
        enum: ["day", "dark"],
        default: 'day'
    },
    timeFormat24: {
        type: Boolean,
        default: false
    },
    emailNotifications: {
        type: Boolean,
        default: true
    },
    pushAlerts: {
        type: Boolean,
        default: false
    },
    resetToken: {
        type: String
    },
    resetTokenExpiry: {
        type: Date
    }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 7);
    next();
});

export default mongoose.model("User", userSchema);