import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        lowercase: true
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    password: {
        type: String,
        required: false,
        select: false
    },
    otp: {
        type: String,
        index: true
    },
    otpExpiry: { type: Date },
    otpAttempts: {
        type: Number,
        default: 0
    },
    otpLockedUntil: {
        type: Date,
        default: null
    },
    otpResendAttempts: {
        count: { type: Number, default: 0 },
        lastSent: { type: Date, default: null }
    },
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

export default mongoose.model("User", userSchema);