import { Tables, TablesInsert, TablesUpdate, Database } from "./database.types";

export type { Database };
export type FlavorProfile = Tables<"flavor_profiles">;
export type PresentationStyle = Tables<"presentation_styles">;
export type BeerReview = Tables<"beer_reviews">;
export type BeerReviewInsert = TablesInsert<"beer_reviews">;
export type BeerReviewUpdate = TablesUpdate<"beer_reviews">;
export type BeerReviewFlavorProfileInsert =
  TablesInsert<"beer_review_flavor_profiles">;
// export type BeerReviewRatingSummary = Pick<
//   BeerReview,
//   "untappd_rating" | "created_at"
// >;
// Beer-related types
export interface UntappdBeer {
  untappdId: number;
  name: string;
  brewery: string | null;
  style: string | null;
  abv: number | null;
  ibu: number | null;
  untappdRating: number | null;
  link: string | null;
  mainImage: string | null;
}

export interface UntappdBeerDetails extends UntappdBeer {
  description: string | null;
  untappdNumberOfRatings: number | null;
}

export interface CommunityRatingSummary {
  communityRating: number | null;
  communityNumberOfRatings: number;
}

export interface BeerDetailsResponse {
  untappd: UntappdBeerDetails;
  community: CommunityRatingSummary;
}

/** Response for GET /api/beer/:id/my-rating (auth required) */
export interface UserRatingResponse {
  rating: number;
  createdAt: string;
}

/** Item in GET /api/supabase/beer/my-all-ratings response (camelCase) */
export interface BeerReviewListItem {
  id: number;
  untappdId?: number;
  name: string;
  brewery: string;
  style: string;
  abv: number;
  ibu: number;
  userRating: number;
  mainImage: string;
  images: string[];
  description: string;
  presentationStyle: number;
  photos?: string[] | null;
  untappdRating: number | null;
}

// Error types
export interface AppError extends Error {
  statusCode: number;
  code?: string; // Machine-readable error code
  details?: unknown; // Additional error details (validation errors, etc.)
  isOperational?: boolean; // Distinguishes operational errors from programmer errors
}
