import { Request } from "express";
import { UnauthorizedError } from "../middleware/errorHandler";

/**
 * Extracts the Bearer token from the Authorization header
 * @param req - Express request object
 * @returns The access token
 * @throws UnauthorizedError if no token is provided
 */
export function extractToken(req: Request): string {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("No token provided");
  }

  return authHeader.replace("Bearer ", "");
}
