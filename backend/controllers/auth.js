import * as authService from "../services/auth.js";
import { loginSchema } from "../validations/auth.js";
import { handleError, AppError } from "../utils/errorHandler.js";
import config from "../config/index.js";
import { extractTokenFromCookie } from "../utils/auth.js";

export const login = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const result = await authService.login(value);

    // Set access token in httpOnly cookie
    res.cookie("accessToken", result.accessToken, {
      httpOnly: config.cookie.httpOnly,
      secure: config.cookie.secure,
      sameSite: config.cookie.sameSite,
      maxAge: config.cookie.accessMaxAge, // 15 minutes
    });

    // Set refresh token in httpOnly cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: config.cookie.httpOnly,
      secure: config.cookie.secure,
      sameSite: config.cookie.sameSite,
      maxAge: config.cookie.maxAge, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
        // Tidak mengirim token di response body
      },
    });
  } catch (error) {
    handleError(error, req, res);
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = extractTokenFromCookie(req.cookies, "refreshToken");

    const result = await authService.refreshAccessToken(refreshToken);

    // Set new access token in httpOnly cookie
    res.cookie("accessToken", result.accessToken, {
      httpOnly: config.cookie.httpOnly,
      secure: config.cookie.secure,
      sameSite: config.cookie.sameSite,
      maxAge: config.cookie.accessMaxAge,
    });

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    handleError(error, req, res);
  }
};

export const me = async (req, res) => {
  try {
    const user = await authService.verifyAuth(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    handleError(error, req, res);
  }
};

export const logout = async (req, res) => {
  try {
    // Clear both cookies
    res.clearCookie("accessToken", {
      httpOnly: config.cookie.httpOnly,
      secure: config.cookie.secure,
      sameSite: config.cookie.sameSite,
    });

    res.clearCookie("refreshToken", {
      httpOnly: config.cookie.httpOnly,
      secure: config.cookie.secure,
      sameSite: config.cookie.sameSite,
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    handleError(error, req, res);
  }
};
