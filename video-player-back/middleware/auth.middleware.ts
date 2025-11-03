import { Request, Response, NextFunction } from "express";
import { supabase } from "../models/supabase";
import { HttpError } from "./errorHandler";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new HttpError("Authentication required", 401);
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new HttpError("Invalid or expired token", 401);
    }

    // Attach user to request object
    req.user = {
      id: user.id,
      email: user.email!,
    };

    next();
  } catch (error) {
    next(error);
  }
};
