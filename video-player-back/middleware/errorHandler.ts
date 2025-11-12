import { NextFunction, Request, Response } from "express";
import { AppError } from "../types";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { config } from "../config";

interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
  timestamp: string;
  path: string;
}

/**
 * Structured logging for errors
 */
const logError = (
  err: Error | AppError,
  statusCode: number,
  req: Request
): void => {
  const logData = {
    timestamp: new Date().toISOString(),
    statusCode,
    message: err.message,
    code: (err as AppError).code,
    path: req.path,
    method: req.method,
    stack: config.NODE_ENV === "development" ? err.stack : undefined,
  };

  if (statusCode >= 500) {
    console.error("❌ Server Error:", JSON.stringify(logData, null, 2));
  } else {
    console.warn("⚠️  Client Error:", JSON.stringify(logData, null, 2));
  }
};

/**
 * Standardized error response formatter
 */
const formatErrorResponse = (
  err: Error | AppError,
  req: Request,
  includeDetails: boolean = false
): ErrorResponse => {
  const appError = err as AppError;

  return {
    success: false,
    error: {
      message: err.message,
      ...(appError.code ? { code: appError.code } : {}),
      ...(includeDetails && appError.details
        ? { details: appError.details }
        : {}),
    },
    timestamp: new Date().toISOString(),
    path: req.path,
  };
};

export const errorHandler = (
  err: Error | AppError | z.ZodError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Handle Zod validation errors
  if (err instanceof z.ZodError) {
    const validationError = fromZodError(err, {
      prefix: "Validation error",
      prefixSeparator: ": ",
    });

    const statusCode = 400;
    logError(validationError, statusCode, req);

    const responseBody: ErrorResponse = {
      success: false,
      error: {
        message: validationError.message,
        code: "VALIDATION_ERROR",
        ...(config.NODE_ENV === "development" ? { details: err.issues } : {}),
      },
      timestamp: new Date().toISOString(),
      path: req.path,
    };

    res.status(statusCode).json(responseBody);
    return;
  }

  // Handle custom app errors
  const appError = err as AppError;
  const statusCode = appError.statusCode || 500;

  logError(err, statusCode, req);

  // Don't leak sensitive information in production
  const isDevelopment = config.NODE_ENV === "development";
  const message =
    statusCode >= 500 && !isDevelopment ? "Internal server error" : err.message;

  const responseBody = formatErrorResponse(
    { ...err, message } as Error | AppError,
    req,
    isDevelopment
  );

  res.status(statusCode).json(responseBody);
};

export class HttpError extends Error implements AppError {
  statusCode: number;
  code?: string;
  details?: unknown;
  isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    details?: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    if (code) {
      this.code = code;
    }
    if (details) {
      this.details = details;
    }
    this.isOperational = true;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);

    // Set the prototype explicitly (needed for extending built-in classes in TS)
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NOT_FOUND");
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ValidationError extends HttpError {
  constructor(message: string = "Validation failed", details?: unknown) {
    super(message, 400, "VALIDATION_ERROR", details);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class DatabaseError extends HttpError {
  constructor(
    message: string = "Database operation failed",
    details?: unknown
  ) {
    super(message, 500, "DATABASE_ERROR", details);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}
