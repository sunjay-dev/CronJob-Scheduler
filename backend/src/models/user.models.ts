import mongoose from "mongoose";
import bcrypt from "bcrypt";
import env from "../config/env.config.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    password: {
      type: String,
      required: false,
      select: false,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    timezone: {
      type: String,
      default: "UTC",
    },
    mode: {
      type: String,
      enum: ["day", "dark"],
      default: "day",
    },
    timeFormat24: {
      type: Boolean,
      default: false,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    pushAlerts: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, env.BCRYPT_SALT_ROUNDS);
});

export default mongoose.model("User", userSchema);
