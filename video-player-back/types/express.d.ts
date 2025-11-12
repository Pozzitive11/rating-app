import { Request } from "express";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
      accessToken?: string;
    }
  }
}
