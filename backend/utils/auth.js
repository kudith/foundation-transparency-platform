import jwt from "jsonwebtoken";
import config from "../config/index.js";

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiresIn,
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};

export const verifyToken = (token, isRefresh = false) => {
  try {
    const secret = isRefresh ? config.jwt.refreshSecret : config.jwt.secret;
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

export const extractTokenFromCookie = (cookies, tokenName = "accessToken") => {
  return cookies?.[tokenName] || null;
};
