import { Request, Response, NextFunction } from "express";
import { config } from "../config";

/**
 * Request timeout middleware
 * Sets a timeout for all requests to prevent hanging connections
 */
export const requestTimeout = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const timeout = config.REQUEST_TIMEOUT_MS;

  // Set timeout on response
  res.setTimeout(timeout, () => {
    if (!res.headersSent) {
      res.status(408).json({
        success: false,
        error: {
          message: "Request timeout",
          code: "REQUEST_TIMEOUT",
        },
        timestamp: new Date().toISOString(),
        path: req.path,
      });
    }
  });

  next();
};
