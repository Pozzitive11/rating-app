import { Tables, TablesInsert } from "./database.types";

export type FlavorProfile = Tables<"flavor_profiles">;
export type PresentationStyle = Tables<"presentation_styles">;
export type BeerReview = Tables<"beer_reviews">;
export type BeerReviewInsert = TablesInsert<"beer_reviews">;
export type BeerReviewRatingSummary = Pick<
  BeerReview,
  "untappd_rating" | "community_rating" | "community_number_of_ratings" | "created_at"
>;
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
  untappdRating: number | null;
  untappdNumberOfRatings?: number;
  communityRating?: number | null;
  communityNumberOfRatings?: number | null;
  userRating: number | null;
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
