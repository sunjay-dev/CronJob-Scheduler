import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: Date.now() + 30 * 24 * 60 * 60 * 1000,
    },
  },
  { timestamps: true },
);

export default mongoose.model("RefreshToken", refreshTokenSchema);
