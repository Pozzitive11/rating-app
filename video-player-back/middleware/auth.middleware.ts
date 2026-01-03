import { Request, Response, NextFunction } from "express";
import { supabase } from "../models/supabase";
import { UnauthorizedError } from "./errorHandler";
import { extractToken } from "../utils/auth.utils";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new UnauthorizedError("Invalid or expired token");
    }

    // Attach user and token to request object
    req.user = {
      id: user.id,
      email: user.email || "",
    };
    req.accessToken = token;

    next();
  } catch (error) {
    next(error);
  }
};
