import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../middleware/errorHandler";
import {
  searchQuerySchema,
  createBeerReviewSchema,
} from "../schemas/beer.schema";
import { BeerReviewInsert } from "../types";
import {
  fetchUntappdBeerDetailsById,
  fetchUntappdBeers,
} from "@/middleware/untappd";
import { supabaseHelpers } from "@/models/supabase";

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

    const beers = await fetchUntappdBeers(query);

    if (beers.length === 0) {
      throw new NotFoundError(`No beers found for "${query}"`);
    }

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
    const beer = await fetchUntappdBeerDetailsById(id);
    if (!beer) {
      throw new NotFoundError(`Beer with id "${id}" not found`);
    }
    res.json(beer);
  } catch (error) {
    next(error);
  }
};

export const getBeerById = async (
  req: Request<{ id: number }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const beer = await supabaseHelpers.getBeerById(id);
    if (!beer) {
      throw new NotFoundError(`Beer with id "${id}" not found`);
    }
    res.json(beer);
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

    const {
      name,
      brewery,
      style,
      abv,
      ibu,
      rating,
      link,
      mainImage,
      description,
      flavorProfiles,
      presentationStyle,
      location,
      comment,
      photos,
    } = validatedData;

    // Map API format (camelCase) to DB format (snake_case)
    const reviewData: BeerReviewInsert = {
      name: name,
      brewery: brewery || "",
      style: style || null,
      rating: rating,
      abv: abv || null,
      ibu: ibu || null,
      link: link || null,
      main_image: mainImage || null,
      description: description || null,
      comment: comment || null,
      location: location || null,
      photos: photos || null,
      presentation_style: presentationStyle || null,
      created_at: new Date().toISOString(),
    };

    const savedReview = await supabaseHelpers.saveBeer(reviewData);

    // Save flavor profiles if provided
    if (flavorProfiles && flavorProfiles.length > 0) {
      await supabaseHelpers.saveBeerReviewFlavorProfiles(
        savedReview.id,
        flavorProfiles
      );
    }

    res.status(201).json(savedReview.id);
  } catch (error) {
    console.log(error);
    // Error handler will automatically format Zod errors
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
    const flavorProfiles = await supabaseHelpers.getFlavorProfiles();

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
    const presentationStyles = await supabaseHelpers.getPresentationStyles();

    res.json(presentationStyles);
  } catch (error) {
    next(error);
  }
};
