import User from "../models/admin.js";
import { comparePassword } from "../utils/password.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/auth.js";
import { AppError } from "../utils/errorHandler.js";

export const login = async (loginData) => {
  const { email, password } = loginData;

  // Find user by email
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  // Prepare payload (include role for authorization)
  const payload = {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  // Generate tokens
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ id: user._id });

  // Return user data without password
  const userObject = user.toObject();
  delete userObject.password;

  return {
    user: userObject,
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError("Refresh token is required", 401);
  }

  // Verify refresh token
  const decoded = verifyToken(refreshToken, true);

  // Find user
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Generate new access token (include role for authorization)
  const payload = {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);

  return {
    accessToken,
    user: user.toJSON(),
  };
};

export const verifyAuth = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user.toJSON();
};
