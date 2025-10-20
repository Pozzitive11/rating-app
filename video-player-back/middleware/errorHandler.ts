import { NextFunction, Request, Response } from "express";
import { AppError } from "../types";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export const errorHandler = (
  err: Error | AppError | z.ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Handle Zod validation errors
  if (err instanceof z.ZodError) {
    const validationError = fromZodError(err, {
      prefix: "Validation error",
      prefixSeparator: ": ",
    });

    const statusCode = 400;
    res.status(statusCode);

    const responseBody = {
      message: validationError.message,
    };

    console.error(`Validation Error (${statusCode}):`, validationError.message);
    res.json(responseBody);
    return;
  }

  // Handle custom app errors
  const statusCode = (err as AppError).statusCode || 500;
  res.status(statusCode);

  const responseBody = {
    message: err.message,
  };

  console.error(`Error (${statusCode}): ${err.message}`, err.stack);
  res.json(responseBody);
};

export class HttpError extends Error implements AppError {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);

    // Set the prototype explicitly (needed for extending built-in classes in TS)
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ValidationError extends HttpError {
  constructor(message: string = "Validation failed") {
    super(message, 400);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
