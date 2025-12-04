import { verifyToken, extractTokenFromCookie } from "../utils/auth.js";
import { AppError, handleError } from "../utils/errorHandler.js";
import { ADMIN_ROLES } from "../models/admin.js";

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

/**
 * Middleware to authorize users based on their roles
 * @param  {...string} allowedRoles - Roles that are allowed to access the route
 * @returns {Function} Express middleware function
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AppError("Authentication required", 401);
      }

      const userRole = req.user.role;

      if (!userRole || !allowedRoles.includes(userRole)) {
        throw new AppError(
          "You do not have permission to perform this action",
          403
        );
      }

      next();
    } catch (error) {
      handleError(error, req, res);
    }
  };
};

/**
 * Middleware to check if user is super admin
 */
export const isSuperAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    if (req.user.role !== ADMIN_ROLES.SUPER_ADMIN) {
      throw new AppError("Super admin access required", 403);
    }

    next();
  } catch (error) {
    handleError(error, req, res);
  }
};
