import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../middleware/errorHandler";
import {
  searchQuerySchema,
  createBeerReviewSchema,
} from "../schemas/beer.schema";
import { serviceContainer } from "../services/serviceContainer";

const beerService = serviceContainer.getBeerService();
/**
 * Controller: Search for beers
 * GET /api/beers/search/:query
 */
export const searchUntappdBeers = async (
  req: Request<{ query: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate query parameter with Zod
    const { query } = searchQuerySchema.parse(req.params);

    const beers = await beerService.searchUntappdBeers(query);
    res.json(beers);
  } catch (error) {
    // Error handler will automatically format Zod errors
    next(error);
  }
};

export const getUntappdBeerDetailsById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const beerId = parseInt(id, 10);
    if (isNaN(beerId)) {
      throw new Error("Invalid beer ID");
    }
    const beer = await beerService.getUntappdBeerDetailsById(beerId);
    res.json(beer);
  } catch (error) {
    next(error);
  }
};

export const getBeerById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const beerId = parseInt(req.params.id, 10);
    if (isNaN(beerId)) {
      throw new Error("Invalid beer ID");
    }
    const result = await beerService.getBeerById(beerId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Create a new beer review
 * POST /api/supabase/beer
 */
export const createBeerReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate request body with Zod
    const validatedData = createBeerReviewSchema.parse(req.body);

    // Get user ID from the authenticated request (set by authenticate middleware)
    if (!req.user) {
      throw new UnauthorizedError("User not authenticated");
    }

    // Get access token from request (set by authenticate middleware)
    const accessToken = req.accessToken;
    if (!accessToken) {
      throw new UnauthorizedError("Access token not found");
    }

    // Service handles all business logic: transformation, defaults, orchestration
    const savedReview = await beerService.createBeerReview(
      validatedData,
      req.user.id,
      accessToken
    );

    res.status(201).json(savedReview.id);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Get all flavor profiles
 * GET /api/supabase/flavor-profiles
 */
export const getFlavorProfiles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const flavorProfiles = await beerService.getFlavorProfiles();
    res.json(flavorProfiles);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Get all presentation styles
 * GET /api/supabase/presentation-styles
 */
export const getPresentationStyles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const presentationStyles = await beerService.getPresentationStyles();
    res.json(presentationStyles);
  } catch (error) {
    next(error);
  }
};
