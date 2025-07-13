import mongoose from "mongoose";
import bcrypt from 'bcrypt';

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
    password: {
        type: String,
        required: true,
        select: false
    },
    timezone: {
        type: String,
        required: true,
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
    }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 7);
    next();
});

export default mongoose.model("User", userSchema);