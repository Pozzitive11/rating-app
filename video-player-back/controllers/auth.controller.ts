import { Request, Response, NextFunction } from "express";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { extractToken } from "../utils/auth.utils";
import { serviceContainer } from "../services/serviceContainer";

const authService = serviceContainer.getAuthService();

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.login(validatedData);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await authService.register(validatedData);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);
    await authService.logout(token);
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);
    const user = await authService.getCurrentUser(token);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};
