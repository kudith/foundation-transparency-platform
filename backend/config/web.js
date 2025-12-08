import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import routes from "../routes/index.js";
import { handleError, AppError } from "../utils/errorHandler.js";
import config from "./index.js";

export const createWebServer = () => {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    })
  );

  // Cookie parser middleware
  app.use(cookieParser());

  // Logging middleware
  if (config.env === "development") {
    app.use(morgan("dev"));
  }

  // Body parser middleware
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Health check route
  app.get("/health", (req, res) => {
    res.json({
      success: true,
      message: "Server is healthy",
      timestamp: new Date().toISOString(),
    });
  });

  // API routes
  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "Veritas API is running",
      version: "1.0.0",
    });
  });

  app.use("/api", routes);

  // 404 handler
  app.use((req, res, next) => {
    const error = new AppError("Route not found", 404);
    handleError(error, req, res);
  });

  // Global error handling middleware
  app.use((err, req, res, next) => {
    console.error("Error:", err);

    // Handle different types of errors
    if (err.name === "ValidationError") {
      err.statusCode = 400;
    } else if (err.name === "CastError") {
      err.statusCode = 400;
      err.message = "Invalid ID format";
    } else if (err.code === 11000) {
      err.statusCode = 400;
      err.message = "Duplicate field value entered";
    }

    handleError(err, req, res);
  });

  return app;
};

export default createWebServer;
