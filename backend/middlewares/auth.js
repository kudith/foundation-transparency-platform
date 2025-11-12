import { verifyToken, extractTokenFromCookie } from "../utils/auth.js";
import { AppError, handleError } from "../utils/errorHandler.js";

export const authenticate = async (req, res, next) => {
  try {
    // Ambil token dari cookie, bukan Authorization header
    const token = extractTokenFromCookie(req.cookies, "accessToken");

    if (!token) {
      throw new AppError("Access token is required", 401);
    }

    const decoded = verifyToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    if (error.message.includes("token")) {
      error.statusCode = 401;
    }
    handleError(error, req, res);
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = extractTokenFromCookie(req.cookies, "accessToken");

    if (token) {
      const decoded = verifyToken(token);
      req.user = decoded;
    }

    next();
  } catch (error) {
    // Continue without user if token is invalid
    next();
  }
};
