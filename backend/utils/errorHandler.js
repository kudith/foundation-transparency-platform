export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (error, req, res) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "No message available";

  // Map status code to error type
  const getErrorType = (code) => {
    if (code >= 500) return "Internal Server Error";
    if (code >= 400) return "Bad Request";
    return "Error";
  };

  res.status(statusCode).json({
    timestamp: new Date().toISOString(),
    status: statusCode,
    error: getErrorType(statusCode),
    message: message,
    path: req.originalUrl || req.url,
  });
};
