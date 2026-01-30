import { Tables, TablesInsert } from "./database.types";

export type FlavorProfile = Tables<"flavor_profiles">;
export type PresentationStyle = Tables<"presentation_styles">;
export type BeerReview = Tables<"beer_reviews">;
export type BeerReviewInsert = TablesInsert<"beer_reviews">;
// Beer-related types
export interface OriginalBeer {
  id: number;
  untappdId?: number;
  userId?: string;
  name: string;
  brewery: string;
  style: string;
  abv: number | null;
  ibu: number | null;
  rating: number | null;
  numberOfRatings?: number;
  mainImage: string | null;
  link: string;
  description?: string | null;
}

// Error types
export interface AppError extends Error {
  statusCode: number;
  code?: string; // Machine-readable error code
  details?: unknown; // Additional error details (validation errors, etc.)
  isOperational?: boolean; // Distinguishes operational errors from programmer errors
}
