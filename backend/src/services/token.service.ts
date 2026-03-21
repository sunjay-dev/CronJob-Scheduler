import { signToken } from "../utils/jwt.utils.js";
import { generateRandomToken } from "../utils/crypto.utils.js";
import refreshTokenModel from "../models/refreshToken.models.js";

export async function generateRefreshAndAccessToken(userId: string) {
  const accessToken = signToken({ userId }, { expiresIn: "15m" });

  const refreshToken = generateRandomToken(64);

  await refreshTokenModel.create({
    user: userId,
    refreshToken,
  });

  return { accessToken, refreshToken };
}

export async function revokeRefreshToken(refreshToken: string) {
  if (refreshToken) await refreshTokenModel.deleteOne({ refreshToken });
}
